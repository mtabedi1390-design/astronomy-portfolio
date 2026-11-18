import { useState } from 'react';
import { EARTH_MEAN_MOTION, ZTF_PIXEL_SCALE, oppositionRate } from '../lib/physics';
import { cn } from '../utils/cn';
import { PanelHead, Readout } from './ui';

const PRESETS = [
  { a: 2.2, label: 'Inner belt' },
  { a: 2.7, label: 'Mid belt' },
  { a: 3.2, label: 'Outer belt' },
  { a: 5.2, label: 'Jupiter Trojans' },
] as const;

/**
 * Drawing constants. The ruler spans 240 detector pixels, drawn to scale.
 * The grid is 360 units wide so that 9-unit labels stay legible on a phone.
 */
const ORIGIN = 16;
const UNITS_PER_PIXEL = 1.375;
const RULER_PIXELS = 240;
const RULER_END = ORIGIN + RULER_PIXELS * UNITS_PER_PIXEL;
const RULER_TICKS = Array.from({ length: RULER_PIXELS / 10 + 1 }, (_, step) => step * 10);
const FRAMES = [0, 1, 2] as const;
const LABEL = 9;
/** Below this marker spacing the per-frame labels would overlap, so one combined label is drawn. */
const MIN_LABEL_SPACING = 15;

/**
 * How far an asteroid shifts on the ZTF detector between frames.
 * A first-order opposition model: the reason a moving object separates from fixed stars in frame catalogs.
 */
export function MotionModel() {
  const [a, setA] = useState(2.7);
  const [dt, setDt] = useState(30);

  const rateDegDay = oppositionRate(a);
  const rateArcsecHour = (rateDegDay * 3600) / 24;
  const shiftArcsec = (rateArcsecHour * dt) / 60;
  const shiftPixels = shiftArcsec / ZTF_PIXEL_SCALE;
  const spacing = shiftPixels * UNITS_PER_PIXEL;
  const subPixel = shiftPixels < 1;
  const labelEach = spacing >= MIN_LABEL_SPACING;

  return (
    <div>
      <PanelHead title="Sky-plane motion" aside="Reference model" />

      <div className="border-b border-line px-3.5 py-3">
        <div className="flex items-baseline justify-between gap-3">
          <label htmlFor="motion-a" className="label">
            Semi-major axis
          </label>
          <output htmlFor="motion-a" className="data text-signal">
            a = {a.toFixed(2)} au
          </output>
        </div>
        <input
          id="motion-a"
          type="range"
          className="slider"
          min={1.5}
          max={5.5}
          step={0.05}
          value={a}
          onChange={(event) => setA(Number(event.target.value))}
          aria-valuetext={`${a.toFixed(2)} astronomical units`}
        />
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((preset) => {
            const active = Math.abs(a - preset.a) < 0.001;
            return (
              <button
                key={preset.a}
                type="button"
                aria-pressed={active}
                onClick={() => setA(preset.a)}
                className={cn(
                  'label border px-2 py-1 transition-colors duration-100',
                  active ? 'border-signal text-signal' : 'border-line-strong text-mute hover:border-bright hover:text-bright',
                )}
              >
                {preset.label} {preset.a}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex items-baseline justify-between gap-3">
          <label htmlFor="motion-dt" className="label">
            Time between frames
          </label>
          <output htmlFor="motion-dt" className="data text-signal">
            Δt = {dt} min
          </output>
        </div>
        <input
          id="motion-dt"
          type="range"
          className="slider"
          min={1}
          max={120}
          step={1}
          value={dt}
          onChange={(event) => setDt(Number(event.target.value))}
          aria-valuetext={`${dt} minutes`}
        />
      </div>

      <div className="px-2 py-3">
        <svg
          viewBox="0 0 360 136"
          role="img"
          aria-label={`Detector positions in three frames. A fixed source stays in place. The moving object shifts ${shiftPixels.toFixed(1)} pixels per frame.`}
          className="block w-full font-mono"
        >
          {/* Fixed source: the same pixel in every frame. */}
          <text x={ORIGIN} y={13} fontSize={LABEL} letterSpacing="0.08em" className="fill-dim">
            FIXED SOURCE
          </text>
          <text x={RULER_END} y={13} fontSize={LABEL} textAnchor="end" className="fill-dim">
            0.0 px / frame
          </text>
          <line x1={ORIGIN} x2={RULER_END} y1={36} y2={36} className="stroke-line" />
          <rect x={ORIGIN - 3.5} y={32.5} width={7} height={7} className="fill-hull stroke-bright" />
          <text x={ORIGIN + 9} y={30} fontSize={LABEL - 0.5} className="fill-mute">
            t0 = t1 = t2
          </text>

          {/* Moving object: displaced by the computed shift in each frame. */}
          <text x={ORIGIN} y={62} fontSize={LABEL} letterSpacing="0.08em" className="fill-dim">
            MOVING OBJECT
          </text>
          <text x={RULER_END} y={62} fontSize={LABEL} textAnchor="end" className="fill-signal">
            {shiftPixels.toFixed(1)} px / frame
          </text>
          <line x1={ORIGIN} x2={RULER_END} y1={88} y2={88} className="stroke-line" />
          <line x1={ORIGIN} x2={ORIGIN + 2 * spacing} y1={88} y2={88} className="stroke-signal" />
          {FRAMES.map((frame) => (
            <g key={frame}>
              <rect x={ORIGIN + frame * spacing - 3.5} y={84.5} width={7} height={7} className="fill-hull stroke-signal" />
              {labelEach && (
                <text x={ORIGIN + frame * spacing} y={79} fontSize={LABEL - 0.5} textAnchor="middle" className="fill-mute">
                  t{frame}
                </text>
              )}
            </g>
          ))}
          {!labelEach && (
            <text x={ORIGIN + 2 * spacing + 9} y={82} fontSize={LABEL - 0.5} className="fill-mute">
              t0 to t2
            </text>
          )}

          {/* Detector ruler, in pixels. */}
          <line x1={ORIGIN} x2={RULER_END} y1={110} y2={110} className="stroke-line-strong" />
          {RULER_TICKS.map((tick) => {
            const x = ORIGIN + tick * UNITS_PER_PIXEL;
            const major = tick % 50 === 0;
            return (
              <g key={tick}>
                <line x1={x} x2={x} y1={110} y2={major ? 116 : 113} className="stroke-line-strong" />
                {major && tick <= 200 && (
                  <text x={x} y={129} fontSize={LABEL} textAnchor="middle" className="fill-dim">
                    {tick}
                  </text>
                )}
              </g>
            );
          })}
          <text x={RULER_END} y={129} fontSize={LABEL} textAnchor="end" className="fill-dim">
            px
          </text>
        </svg>
      </div>

      <dl>
        <Readout label="Rate">
          {rateArcsecHour.toFixed(1)} ″/h <span className="text-dim">· {rateDegDay.toFixed(3)} °/day</span>
        </Readout>
        <Readout label="Shift">
          {shiftArcsec.toFixed(1)}″ <span className="text-dim">per frame, Δt = {dt} min</span>
        </Readout>
        <Readout label="On detector">
          <span className="text-signal">{shiftPixels.toFixed(1)} px</span>{' '}
          <span className="text-dim">at {ZTF_PIXEL_SCALE} ″/px</span>
        </Readout>
        <Readout label="State">
          <span className="font-sans text-[13px] text-body">
            {subPixel
              ? 'Sub-pixel shift: at this baseline the object looks like a fixed source.'
              : 'Resolved shift: the object changes pixel position between frames.'}
          </span>
        </Readout>
      </dl>

      <div className="border-t border-line px-3.5 py-3">
        <p className="data text-bright">
          μ = n<sub>E</sub> (1 − a<sup>−½</sup>) / (a − 1)
        </p>
        <p className="data mt-0.5 text-dim">
          n<sub>E</sub> = {EARTH_MEAN_MOTION.toFixed(4)} °/day
        </p>
        <p className="mt-3 text-[12.5px] leading-relaxed text-dim">
          Opposition model: circular, coplanar orbits, with the object at opposition, where it appears to move retrograde.
          Rates at other geometries differ. Textbook estimate, not pipeline output.
        </p>
      </div>
    </div>
  );
}
