import { useState } from 'react';
import { formatEnergy, sciText } from '../lib/format';
import {
  AGE_OF_UNIVERSE_YR,
  EV,
  JULIAN_YEAR,
  K_B,
  M_EARTH,
  M_MOON,
  M_STAR,
  M_SUN,
  T_CMB,
  evaporationTime,
  hawkingPower,
  hawkingTemperature,
  schwarzschildRadius,
} from '../lib/physics';
import { cn } from '../utils/cn';
import { PanelHead, Readout, Sci } from './ui';

const LOG_MIN = 5;
const LOG_MAX = 31;

const PRESETS = [
  { id: 'mstar', label: 'M*', logM: Math.log10(M_STAR) },
  { id: 'moon', label: 'Moon', logM: Math.log10(M_MOON) },
  { id: 'earth', label: 'Earth', logM: Math.log10(M_EARTH) },
  { id: 'sun', label: 'Sun', logM: Math.log10(M_SUN) },
] as const;

/**
 * Plot geometry: two stacked log-log panels that share the mass axis.
 * The grid is 360 units wide so that 9-unit labels stay legible on a phone.
 */
const FRAME = { left: 40, right: 352, topA: 10, bottomA: 104, topB: 124, bottomB: 218 };
const LABEL = 9;
const LIFETIME_RANGE = [-10, 70] as const; // log10(t_ev / yr)
const TEMPERATURE_RANGE = [-10, 20] as const; // log10(T_H / K)
const MASS_TICKS = [5, 10, 15, 20, 25, 30];
const LIFETIME_TICKS = [0, 20, 40, 60];
const TEMPERATURE_TICKS = [0, 10, 20];

const xOf = (logM: number): number => FRAME.left + ((logM - LOG_MIN) / (LOG_MAX - LOG_MIN)) * (FRAME.right - FRAME.left);
const scaleY = (value: number, range: readonly [number, number], top: number, bottom: number): number =>
  bottom - ((value - range[0]) / (range[1] - range[0])) * (bottom - top);
const yLifetime = (value: number): number => scaleY(value, LIFETIME_RANGE, FRAME.topA, FRAME.bottomA);
const yTemperature = (value: number): number => scaleY(value, TEMPERATURE_RANGE, FRAME.topB, FRAME.bottomB);
const logLifetime = (logM: number): number => Math.log10(evaporationTime(10 ** logM) / JULIAN_YEAR);
const logTemperature = (logM: number): number => Math.log10(hawkingTemperature(10 ** logM));

const Y_AGE = yLifetime(Math.log10(AGE_OF_UNIVERSE_YR));
const Y_CMB = yTemperature(Math.log10(T_CMB));
const X_STAR = xOf(Math.log10(M_STAR));

function Plot({ logM }: { logM: number }) {
  const x = xOf(logM);

  return (
    <svg
      viewBox="0 0 360 250"
      role="img"
      aria-label="Two log-log plots against black hole mass: evaporation time, which rises as mass cubed, and Hawking temperature, which falls as one over mass. Reference lines mark the age of the universe and the CMB temperature."
      className="block w-full font-mono"
    >
      <rect
        x={FRAME.left}
        y={FRAME.topA}
        width={FRAME.right - FRAME.left}
        height={FRAME.bottomA - FRAME.topA}
        fill="none"
        className="stroke-line-strong"
      />
      <rect
        x={FRAME.left}
        y={FRAME.topB}
        width={FRAME.right - FRAME.left}
        height={FRAME.bottomB - FRAME.topB}
        fill="none"
        className="stroke-line-strong"
      />

      {MASS_TICKS.map((tick) => (
        <g key={tick}>
          <line x1={xOf(tick)} x2={xOf(tick)} y1={FRAME.topA} y2={FRAME.bottomA} className="stroke-line" strokeWidth={0.5} />
          <line x1={xOf(tick)} x2={xOf(tick)} y1={FRAME.topB} y2={FRAME.bottomB} className="stroke-line" strokeWidth={0.5} />
          <text x={xOf(tick)} y={FRAME.bottomB + 13} fontSize={LABEL} textAnchor="middle" className="fill-dim">
            1e{tick}
          </text>
        </g>
      ))}
      {LIFETIME_TICKS.map((tick) => (
        <g key={tick}>
          <line x1={FRAME.left} x2={FRAME.right} y1={yLifetime(tick)} y2={yLifetime(tick)} className="stroke-line" strokeWidth={0.5} />
          <text x={FRAME.left - 5} y={yLifetime(tick) + 3.2} fontSize={LABEL} textAnchor="end" className="fill-dim">
            1e{tick}
          </text>
        </g>
      ))}
      {TEMPERATURE_TICKS.map((tick) => (
        <g key={tick}>
          <line
            x1={FRAME.left}
            x2={FRAME.right}
            y1={yTemperature(tick)}
            y2={yTemperature(tick)}
            className="stroke-line"
            strokeWidth={0.5}
          />
          <text x={FRAME.left - 5} y={yTemperature(tick) + 3.2} fontSize={LABEL} textAnchor="end" className="fill-dim">
            1e{tick}
          </text>
        </g>
      ))}

      {/* Reference levels. */}
      <line x1={FRAME.left} x2={FRAME.right} y1={Y_AGE} y2={Y_AGE} className="stroke-dim" strokeWidth={0.75} strokeDasharray="4 3" />
      <text x={FRAME.right - 5} y={Y_AGE - 4} fontSize={LABEL} textAnchor="end" className="fill-mute">
        t0 = 13.787 Gyr
      </text>
      <line x1={FRAME.left} x2={FRAME.right} y1={Y_CMB} y2={Y_CMB} className="stroke-dim" strokeWidth={0.75} strokeDasharray="4 3" />
      <text x={FRAME.left + 6} y={Y_CMB - 4} fontSize={LABEL} className="fill-mute">
        T_CMB = 2.7255 K
      </text>
      <line x1={X_STAR} x2={X_STAR} y1={FRAME.bottomA - 8} y2={FRAME.bottomA} className="stroke-mute" />
      <text x={X_STAR + 4} y={FRAME.bottomA - 4} fontSize={LABEL} className="fill-mute">
        M*
      </text>

      {/* The two power laws. */}
      <line
        x1={xOf(LOG_MIN)}
        y1={yLifetime(logLifetime(LOG_MIN))}
        x2={xOf(LOG_MAX)}
        y2={yLifetime(logLifetime(LOG_MAX))}
        className="stroke-bright"
        strokeWidth={1.25}
      />
      <line
        x1={xOf(LOG_MIN)}
        y1={yTemperature(logTemperature(LOG_MIN))}
        x2={xOf(LOG_MAX)}
        y2={yTemperature(logTemperature(LOG_MAX))}
        className="stroke-bright"
        strokeWidth={1.25}
      />

      <text x={FRAME.left + 6} y={FRAME.topA + 13} fontSize={LABEL} className="fill-bright">
        t_ev [yr]
      </text>
      <text x={FRAME.right - 6} y={FRAME.topB + 13} fontSize={LABEL} textAnchor="end" className="fill-bright">
        T_H [K]
      </text>
      <text x={FRAME.right} y={FRAME.bottomB + 27} fontSize={LABEL} textAnchor="end" className="fill-bright">
        M [kg]
      </text>

      {/* Selected mass. */}
      <line x1={x} x2={x} y1={FRAME.topA} y2={FRAME.bottomB} className="stroke-signal" strokeWidth={1} />
      <rect x={x - 3} y={yLifetime(logLifetime(logM)) - 3} width={6} height={6} className="fill-signal" />
      <rect x={x - 3} y={yTemperature(logTemperature(logM)) - 3} width={6} height={6} className="fill-signal" />
    </svg>
  );
}

/** Plain-language reading of the numbers, including where the simple estimate is known to fall short. */
function stateText(mass: number, ratio: number, temperature: number): string {
  if (ratio < 1) {
    return 'Lifetime shorter than the age of the universe: a primordial hole of this mass has already evaporated.';
  }
  if (mass <= M_STAR * 1.0001) {
    return 'Borderline. This photon-only estimate exceeds the age of the universe, but with Standard Model emission holes up to M* have evaporated by now.';
  }
  if (temperature > T_CMB) {
    return 'Outlives the universe so far and is hotter than the CMB: still present, slowly losing mass.';
  }
  return 'Colder than the CMB: it absorbs more radiation than it emits.';
}

/**
 * Semiclassical Hawking relations for a chosen black hole mass.
 * The baseline physics behind the manuscript's topic. It does not reproduce the manuscript.
 */
export function HawkingModel() {
  const [logM, setLogM] = useState<number>(PRESETS[0].logM);

  const mass = 10 ** logM;
  const radius = schwarzschildRadius(mass);
  const temperature = hawkingTemperature(mass);
  const power = hawkingPower(mass);
  const lifetimeYears = evaporationTime(mass) / JULIAN_YEAR;
  const ratio = lifetimeYears / AGE_OF_UNIVERSE_YR;

  return (
    <div>
      <PanelHead title="Hawking evaporation" aside="Reference model" />

      <div className="border-b border-line px-3.5 py-3">
        <div className="flex items-baseline justify-between gap-3">
          <label htmlFor="hawking-mass" className="label">
            Mass, log scale
          </label>
          <output htmlFor="hawking-mass" className="data text-signal">
            M = <Sci value={mass} /> kg
          </output>
        </div>
        <input
          id="hawking-mass"
          type="range"
          className="slider"
          min={LOG_MIN}
          max={LOG_MAX}
          step={0.01}
          value={logM}
          onChange={(event) => setLogM(Number(event.target.value))}
          aria-valuetext={`${sciText(mass)} kilograms`}
        />
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((preset) => {
            const active = Math.abs(logM - preset.logM) < 0.004;
            return (
              <button
                key={preset.id}
                type="button"
                aria-pressed={active}
                onClick={() => setLogM(preset.logM)}
                className={cn(
                  'border px-2 py-1 font-mono text-[11px] leading-4 tracking-[0.08em] transition-colors duration-100',
                  active ? 'border-signal text-signal' : 'border-line-strong text-mute hover:border-bright hover:text-bright',
                )}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-2 py-3">
        <Plot logM={logM} />
      </div>

      <dl>
        <Readout label="Mass">
          <Sci value={mass} /> kg{' '}
          <span className="text-dim">
            · <Sci value={mass * 1000} /> g
          </span>
        </Readout>
        <Readout label="Radius">
          <Sci value={radius} /> m
        </Readout>
        <Readout label="Temperature">
          <Sci value={temperature} /> K{' '}
          <span className="text-dim">
            · k<sub>B</sub>T = {formatEnergy((K_B * temperature) / EV)}
          </span>
        </Readout>
        <Readout label="Power">
          <Sci value={power} /> W
        </Readout>
        <Readout label="Lifetime">
          <span className="text-signal">
            <Sci value={lifetimeYears} /> yr
          </span>{' '}
          <span className="text-dim">
            · <Sci value={ratio} digits={2} /> t<sub>0</sub>
          </span>
        </Readout>
        <Readout label="State">
          <span className="font-sans text-[13px] text-body">{stateText(mass, ratio, temperature)}</span>
        </Readout>
      </dl>

      <div className="border-t border-line px-3.5 py-3">
        <div className="data space-y-0.5 text-bright">
          <p>
            r<sub>s</sub> = 2GM / c<sup>2</sup>
          </p>
          <p>
            T<sub>H</sub> = ħc<sup>3</sup> / (8πGMk<sub>B</sub>)
          </p>
          <p>
            P = ħc<sup>6</sup> / (15360πG<sup>2</sup>M<sup>2</sup>)
          </p>
          <p>
            t<sub>ev</sub> = 5120πG<sup>2</sup>M<sup>3</sup> / (ħc<sup>4</sup>)
          </p>
        </div>
        <p className="mt-3 text-[12.5px] leading-relaxed text-dim">
          Semiclassical blackbody estimate with photon emission only, so lifetimes are upper bounds. With Standard Model
          emission, the initial mass that finishes evaporating today is M* ~ 5 × 10<sup>11</sup> kg (Carr et al. 2010). The
          Loop Quantum Gravity and Memory Burden effects studied in the manuscript are not modeled. Constants: CODATA 2018.
          t<sub>0</sub>: Planck 2018. T<sub>CMB</sub>: Fixsen 2009.
        </p>
      </div>
    </div>
  );
}
