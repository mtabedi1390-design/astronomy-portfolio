import { memo, useMemo, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { sites, type SiteId } from '../data/content';
import { FIGURES, STAR_MAG_LIMIT, STAR_NAMES, STARS, type SkyPoint } from '../data/sky';
import {
  eclipticToEquatorial,
  julianDate,
  lstDeg,
  mod,
  skyState,
  sunEquatorial,
  toEquatorial,
  toHorizontal,
  type Horizontal,
  type SkyState,
} from '../lib/astro';
import { formatAzimuth, formatDec, formatOffset, formatRa, formatSidereal, plain, signed, utcStamp, zoneClock } from '../lib/format';
import { useNow } from '../lib/useNow';
import { cn } from '../utils/cn';
import { PanelHead, StateMark } from './ui';

const SIZE = 400;
const CENTER = SIZE / 2;
const RADIUS = 170;
/** Pointer capture radius around a star, in chart units. */
const HIT_RADIUS = 13;
/** Stars at least this bright carry a permanent name label. */
const LABEL_MAG = 1.3;
/** Named stars at least this bright can be reached with the arrow keys. */
const STEP_MAG = 2.5;

const SITE_IDS = Object.keys(sites) as SiteId[];

const ECLIPTIC: readonly SkyPoint[] = Array.from({ length: 121 }, (_, step): SkyPoint => {
  const point = eclipticToEquatorial(step * 3);
  return [point.ra, point.dec];
});

const AZIMUTH_TICKS = Array.from({ length: 24 }, (_, step) => step * 15);

const CARDINALS = [
  { label: 'N', az: 0 },
  { label: 'E', az: 90 },
  { label: 'S', az: 180 },
  { label: 'W', az: 270 },
] as const;

const STATE_TEXT: Record<SkyState, string> = {
  day: 'Daylight. Stars are plotted for orientation only.',
  civil: 'Civil twilight: Sun 0° to 6° below the horizon.',
  nautical: 'Nautical twilight: Sun 6° to 12° below the horizon.',
  astronomical: 'Astronomical twilight: Sun 12° to 18° below the horizon.',
  night: 'Astronomical night: Sun more than 18° below the horizon.',
};

/** Sky background per twilight class: one step darker each time the Sun sinks a class lower. */
const STATE_FILL: Record<SkyState, string> = {
  day: '#18181c',
  civil: '#111114',
  nautical: '#0a0a0c',
  astronomical: '#050506',
  night: '#000000',
};

const STATE_STAR_OPACITY: Record<SkyState, number> = {
  day: 0.3,
  civil: 0.5,
  nautical: 0.75,
  astronomical: 0.9,
  night: 1,
};

interface Dot {
  index: number;
  x: number;
  y: number;
  r: number;
  opacity: number;
}

interface Sky {
  jd: number;
  lst: number;
  sun: Horizontal;
  state: SkyState;
  dots: Dot[];
  figures: string;
  ecliptic: string;
  eclipticLabel: readonly [number, number] | null;
}

/** Zenithal equidistant projection: zenith at the center, horizon on the rim, north up, east left. */
function project(alt: number, az: number): [number, number] {
  const distance = (RADIUS * (90 - alt)) / 90;
  const angle = (az * Math.PI) / 180;
  return [CENTER - distance * Math.sin(angle), CENTER - distance * Math.cos(angle)];
}

/** SVG path through the points that are above the horizon. The pen lifts at the horizon. */
function trace(points: readonly SkyPoint[], lst: number, lat: number): string {
  let path = '';
  let penDown = false;
  for (const [ra, dec] of points) {
    const position = toHorizontal(ra, dec, lst, lat);
    if (position.alt < 0) {
      penDown = false;
      continue;
    }
    const [x, y] = project(position.alt, position.az);
    path += `${penDown ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
    penDown = true;
  }
  return path;
}

function computeSky(epochSeconds: number, lat: number, lon: number): Sky {
  const jd = julianDate(new Date(epochSeconds * 1000));
  const lst = lstDeg(jd, lon);
  const sunPosition = sunEquatorial(jd);
  const sun = toHorizontal(sunPosition.ra, sunPosition.dec, lst, lat);

  const dots: Dot[] = [];
  STARS.forEach(([ra, dec, mag], index) => {
    const position = toHorizontal(ra, dec, lst, lat);
    if (position.alt <= 0) return;
    const [x, y] = project(position.alt, position.az);
    dots.push({
      index,
      x,
      y,
      // Disc area scales with flux: radius goes as 10^(-0.2 m).
      r: 0.5 + 2.6 * 10 ** (-0.2 * (mag + 1.5)),
      opacity: 0.5 + 0.5 * Math.min(1, Math.max(0, (STAR_MAG_LIMIT - mag) / 4)),
    });
  });

  // Label the ecliptic at its highest point, and only once it climbs clear of the horizon.
  let eclipticLabel: readonly [number, number] | null = null;
  let highest = 8;
  for (const [ra, dec] of ECLIPTIC) {
    const position = toHorizontal(ra, dec, lst, lat);
    if (position.alt > highest) {
      highest = position.alt;
      eclipticLabel = project(position.alt, position.az);
    }
  }

  return {
    jd,
    lst,
    sun,
    state: skyState(sun.alt),
    dots,
    figures: FIGURES.map((line) => trace(line, lst, lat)).join(''),
    ecliptic: trace(ECLIPTIC, lst, lat),
    eclipticLabel,
  };
}

function designationOf(index: number): string {
  return STAR_NAMES[index]?.[1] || `HIP ${STARS[index][3]}`;
}

/** Horizon ring, altitude rings, meridian cross and azimuth bezel. */
const ChartFrame = memo(function ChartFrame({ fill }: { fill: string }) {
  return (
    <g>
      <circle cx={CENTER} cy={CENTER} r={RADIUS} fill={fill} className="stroke-line-strong" strokeWidth={1} />
      <circle cx={CENTER} cy={CENTER} r={(RADIUS * 2) / 3} fill="none" className="stroke-line" strokeWidth={0.75} />
      <circle cx={CENTER} cy={CENTER} r={RADIUS / 3} fill="none" className="stroke-line" strokeWidth={0.75} />
      <path
        d={`M${CENTER} ${CENTER - RADIUS}V${CENTER + RADIUS}M${CENTER - RADIUS} ${CENTER}H${CENTER + RADIUS}`}
        className="stroke-line"
        strokeWidth={0.75}
      />
      {AZIMUTH_TICKS.map((az) => {
        const angle = (az * Math.PI) / 180;
        const length = az % 90 === 0 ? 7 : az % 45 === 0 ? 5 : 3;
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);
        return (
          <line
            key={az}
            x1={CENTER - RADIUS * sin}
            y1={CENTER - RADIUS * cos}
            x2={CENTER - (RADIUS + length) * sin}
            y2={CENTER - (RADIUS + length) * cos}
            className="stroke-line-strong"
            strokeWidth={1}
          />
        );
      })}
      {CARDINALS.map(({ label, az }) => {
        const [x, y] = project(-9.5, az);
        return (
          <text key={label} x={x} y={y + 4} textAnchor="middle" fontSize={11} className="fill-mute">
            {label}
          </text>
        );
      })}
      {/* Ring labels sit on the north meridian at declinations no labeled star reaches, so they never collide. */}
      <text x={CENTER + 4} y={CENTER - (RADIUS * 2) / 3 + 10} fontSize={8} className="fill-dim">
        30°
      </text>
      <text x={CENTER + 4} y={CENTER - RADIUS / 3 + 10} fontSize={8} className="fill-dim">
        60°
      </text>
    </g>
  );
});

/** Constellation figures, ecliptic, stars and the Sun. Re-renders once per second, not on pointer moves. */
const StarLayer = memo(function StarLayer({ sky }: { sky: Sky }) {
  const dim = STATE_STAR_OPACITY[sky.state];
  const sunPoint = sky.sun.alt > -0.833 ? project(Math.max(sky.sun.alt, 0), sky.sun.az) : null;

  return (
    <g>
      <path d={sky.figures} fill="none" className="stroke-line-strong" strokeWidth={0.6} opacity={dim} />
      <path d={sky.ecliptic} fill="none" className="stroke-signal" strokeWidth={0.8} strokeDasharray="3 3" opacity={0.75} />
      {sky.eclipticLabel && (
        <text x={sky.eclipticLabel[0] + 5} y={sky.eclipticLabel[1] - 5} fontSize={8} letterSpacing="0.08em" className="fill-signal">
          ECLIPTIC
        </text>
      )}

      <g className="fill-bright" opacity={dim}>
        {sky.dots.map((dot) => (
          <circle key={dot.index} cx={dot.x} cy={dot.y} r={dot.r} opacity={dot.opacity} />
        ))}
      </g>

      <g className="fill-mute" fontSize={8} letterSpacing="0.05em" opacity={Math.max(dim, 0.6)}>
        {sky.dots.map((dot) => {
          const name = STAR_NAMES[dot.index]?.[0];
          if (!name || STARS[dot.index][2] > LABEL_MAG) return null;
          const flip = dot.x > CENTER + 70;
          return (
            <text
              key={dot.index}
              x={flip ? dot.x - dot.r - 3.5 : dot.x + dot.r + 3.5}
              y={dot.y + 2.8}
              textAnchor={flip ? 'end' : 'start'}
            >
              {name.toUpperCase()}
            </text>
          );
        })}
      </g>

      {sunPoint && (
        <g>
          <circle cx={sunPoint[0]} cy={sunPoint[1]} r={6} fill="none" className="stroke-signal" strokeWidth={1.2} />
          <circle cx={sunPoint[0]} cy={sunPoint[1]} r={1.4} className="fill-signal" />
          <text x={sunPoint[0] + 10} y={sunPoint[1] + 2.8} fontSize={8} letterSpacing="0.08em" className="fill-signal">
            SUN
          </text>
        </g>
      )}
    </g>
  );
});

function Cell({ label, children, wide }: { label: string; children: ReactNode; wide?: boolean }) {
  return (
    <div
      className={cn(
        'flex items-baseline justify-between gap-3 border-b border-line px-3.5 py-2',
        wide ? 'min-[420px]:col-span-2' : 'min-[420px]:odd:border-r',
      )}
    >
      <dt className="label shrink-0">{label}</dt>
      <dd className="data min-w-0 text-right text-bright">{children}</dd>
    </div>
  );
}

/**
 * The sky above a site, computed for the current second.
 * Replaces a decorative star field: every dot is a catalog star at its real position.
 */
export function SkyInstrument() {
  const now = useNow();
  const [siteId, setSiteId] = useState<SiteId>('tehran');
  const [offsetMin, setOffsetMin] = useState(0);
  const [target, setTarget] = useState<number | null>(null);
  const [cursor, setCursor] = useState<Horizontal | null>(null);

  const site = sites[siteId];
  const epochSeconds = Math.floor(now / 1000) + offsetMin * 60;
  const sky = useMemo(() => computeSky(epochSeconds, site.lat, site.lon), [epochSeconds, site.lat, site.lon]);
  const stepList = useMemo(
    () => sky.dots.filter((dot) => STAR_NAMES[dot.index]?.[0] && STARS[dot.index][2] <= STEP_MAG).map((dot) => dot.index),
    [sky],
  );

  const date = new Date(epochSeconds * 1000);
  const utc = utcStamp(date);
  const local = zoneClock(date, site.timeZone);
  const live = offsetMin === 0;

  const targetStar = target === null ? null : STARS[target];
  const targetPosition = targetStar ? toHorizontal(targetStar[0], targetStar[1], sky.lst, site.lat) : null;
  const targetPoint = targetPosition && targetPosition.alt > 0 ? project(targetPosition.alt, targetPosition.az) : null;
  const targetName = target === null ? '' : (STAR_NAMES[target]?.[0] ?? '');
  const targetDesignation = target === null ? '' : designationOf(target);
  const cursorSky = cursor ? toEquatorial(cursor.alt, cursor.az, sky.lst, site.lat) : null;

  const handlePointer = (event: PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * SIZE;
    const y = ((event.clientY - rect.top) / rect.height) * SIZE;

    let nearest: number | null = null;
    let best = HIT_RADIUS * HIT_RADIUS;
    for (const dot of sky.dots) {
      const distance = (dot.x - x) ** 2 + (dot.y - y) ** 2;
      if (distance < best) {
        best = distance;
        nearest = dot.index;
      }
    }
    setTarget(nearest);

    const dx = CENTER - x;
    const dy = CENTER - y;
    const radial = Math.hypot(dx, dy);
    setCursor(
      radial <= RADIUS ? { alt: 90 - (radial / RADIUS) * 90, az: mod((Math.atan2(dx, dy) * 180) / Math.PI, 360) } : null,
    );
  };

  const handleLeave = (event: PointerEvent<SVGSVGElement>) => {
    setCursor(null);
    if (event.pointerType === 'mouse') setTarget(null);
  };

  const handleKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      setTarget(null);
      return;
    }
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    if (stepList.length === 0) return;
    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const current = target === null ? -1 : stepList.indexOf(target);
    const next =
      current === -1 ? (direction === 1 ? 0 : stepList.length - 1) : (current + direction + stepList.length) % stepList.length;
    setTarget(stepList[next]);
    setCursor(null);
  };

  const flipLabel = targetPoint !== null && targetPoint[0] > CENTER + 70;

  return (
    <div className="flex h-full flex-col bg-hull">
      <PanelHead
        title="Sky · all-sky chart"
        aside={
          live ? (
            <>
              <StateMark tone="nominal" />
              <span className="text-nominal">Live</span>
            </>
          ) : (
            <span className="text-signal">{formatOffset(offsetMin)}</span>
          )
        }
      />

      <div role="group" aria-label="Observing site" className="grid grid-cols-2 border-b border-line">
        {SITE_IDS.map((id, index) => {
          const active = id === siteId;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={active}
              onClick={() => setSiteId(id)}
              className={cn(
                'flex items-center justify-between gap-3 px-3.5 py-2.5 text-left transition-colors duration-100',
                index > 0 && 'border-l border-line',
                active ? 'bg-deck' : 'hover:bg-deck',
              )}
            >
              <span className={cn('label flex items-center gap-2', active ? 'text-bright' : 'text-dim')}>
                {active && <StateMark tone="signal" />}
                {sites[id].label}
              </span>
              <span className="label hidden min-[420px]:inline">{sites[id].tag}</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-1 items-center px-4 py-4 sm:px-6">
        <div
          tabIndex={0}
          role="group"
          aria-label={`All-sky chart for ${site.label}: ${sky.dots.length} catalog stars above the horizon. Use the left and right arrow keys to step through named stars.`}
          onKeyDown={handleKey}
          className="mx-auto w-full max-w-[28rem]"
        >
          <svg
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            aria-hidden="true"
            onPointerMove={handlePointer}
            onPointerDown={handlePointer}
            onPointerLeave={handleLeave}
            className="block w-full cursor-crosshair select-none font-mono"
          >
            <ChartFrame fill={STATE_FILL[sky.state]} />
            <StarLayer sky={sky} />
            {targetPoint && (
              <g>
                <path
                  d={`M${targetPoint[0] - 8} ${targetPoint[1] - 4}V${targetPoint[1] - 8}H${targetPoint[0] - 4}M${targetPoint[0] + 4} ${targetPoint[1] - 8}H${targetPoint[0] + 8}V${targetPoint[1] - 4}M${targetPoint[0] + 8} ${targetPoint[1] + 4}V${targetPoint[1] + 8}H${targetPoint[0] + 4}M${targetPoint[0] - 4} ${targetPoint[1] + 8}H${targetPoint[0] - 8}V${targetPoint[1] + 4}`}
                  fill="none"
                  className="stroke-signal"
                  strokeWidth={1}
                />
                <text
                  x={flipLabel ? targetPoint[0] - 12 : targetPoint[0] + 12}
                  y={targetPoint[1] - 10}
                  textAnchor={flipLabel ? 'end' : 'start'}
                  fontSize={9}
                  className="fill-signal"
                >
                  {targetDesignation}
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {targetStar ? `${targetName || targetDesignation}, magnitude ${targetStar[2].toFixed(2)}` : ''}
      </p>

      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-t border-line px-3.5 py-1.5">
        <label htmlFor="sky-time" className="label">
          Time
        </label>
        <input
          id="sky-time"
          type="range"
          className="slider"
          min={-720}
          max={720}
          step={10}
          value={offsetMin}
          onChange={(event) => setOffsetMin(Number(event.target.value))}
          aria-valuetext={live ? 'Now' : `${Math.abs(offsetMin)} minutes ${offsetMin < 0 ? 'before' : 'after'} now`}
        />
        <button
          type="button"
          onClick={() => setOffsetMin(0)}
          disabled={live}
          className="label border border-line-strong px-2 py-1 text-bright transition-colors duration-100 hover:border-bright disabled:border-line disabled:text-faint"
        >
          Now
        </button>
      </div>

      {/* Height is reserved for three lines so the panel does not jump as the readout changes. */}
      <div className="min-h-[5.5rem] border-t border-line px-3.5 py-2.5">
        {targetStar && targetPosition ? (
          <>
            <p className="data">
              <span className="text-signal">{targetDesignation}</span>
              {targetName && <span className="text-bright"> · {targetName}</span>}
              {!targetDesignation.startsWith('HIP') && <span className="text-dim"> · HIP {targetStar[3]}</span>}
            </p>
            <p className="data mt-0.5 text-mute">
              V {plain(targetStar[2])} · RA {formatRa(targetStar[0])} · Dec {formatDec(targetStar[1])} · Alt{' '}
              {signed(targetPosition.alt)}° · Az {formatAzimuth(targetPosition.az)}
              {targetPosition.alt <= 0 && ' (below horizon)'}
            </p>
          </>
        ) : cursor && cursorSky ? (
          <>
            <p className="label">Cursor</p>
            <p className="data mt-0.5 text-mute">
              Alt {signed(cursor.alt)}° · Az {formatAzimuth(cursor.az)} · RA {formatRa(cursorSky.ra)} · Dec {formatDec(cursorSky.dec)}
            </p>
          </>
        ) : (
          <>
            <p className="label">Target</p>
            <p className="mt-0.5 text-[13px] leading-snug text-dim">
              Point at a star to identify it. With the chart focused, the left and right arrow keys step through named stars.
            </p>
          </>
        )}
      </div>

      <dl className="grid grid-cols-1 border-t border-line min-[420px]:grid-cols-2">
        <Cell label="UTC">
          {utc.date} {utc.time}
        </Cell>
        <Cell label="Local">
          {local.time} <span className="text-dim">{local.offset}</span>
        </Cell>
        <Cell label="JD">{sky.jd.toFixed(5)}</Cell>
        <Cell label="LST">{formatSidereal(sky.lst)}</Cell>
        <Cell label="Site">{site.coords}</Cell>
        <Cell label="Sun alt">{signed(sky.sun.alt)}°</Cell>
        <Cell label="Sky" wide>
          <span className="font-sans text-[13px] text-body">{STATE_TEXT[sky.state]}</span>
        </Cell>
      </dl>

      <p className="px-3.5 py-3 text-[12.5px] leading-relaxed text-dim">
        {STARS.length} stars to V {STAR_MAG_LIMIT.toFixed(1)} from the XHIP Hipparcos compilation, at J2000 positions.
        Precession and atmospheric refraction are not applied. Dashed line: the ecliptic, near which most asteroids are found.
      </p>
    </div>
  );
}
