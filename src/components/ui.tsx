import type { ReactNode } from 'react';
import { sci } from '../lib/format';
import { cn } from '../utils/cn';

type ArrowDirection = 'right' | 'down' | 'up' | 'out';

const ARROW_PATHS: Record<ArrowDirection, string> = {
  right: 'M1 6h10M7 2l4 4-4 4',
  down: 'M6 1v10M2 7l4 4 4-4',
  up: 'M6 11V1M2 5l4-4 4 4',
  out: 'M3 9l6-6M4 3h5v5',
};

interface ArrowProps {
  direction?: ArrowDirection;
  className?: string;
}

/** Square-capped arrow drawn on a 12-unit grid. Replaces an icon library. */
export function Arrow({ direction = 'right', className }: ArrowProps) {
  return (
    <svg
      viewBox="0 0 12 12"
      width="12"
      height="12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      aria-hidden="true"
      className={cn('shrink-0', className)}
    >
      <path d={ARROW_PATHS[direction]} />
    </svg>
  );
}

interface StateMarkProps {
  tone: 'nominal' | 'signal';
}

/** Square status mark. Green: active. Amber: needs attention or is selected. */
export function StateMark({ tone }: StateMarkProps) {
  return (
    <span
      aria-hidden="true"
      className={cn('inline-block h-1.5 w-1.5 shrink-0', tone === 'nominal' ? 'bg-nominal' : 'bg-signal')}
    />
  );
}

interface PanelHeadProps {
  title: string;
  aside?: ReactNode;
}

/** Header strip of an instrument panel: name on the left, state on the right. */
export function PanelHead({ title, aside }: PanelHeadProps) {
  return (
    <div className="panel-head">
      <p className="label text-mute">{title}</p>
      {aside !== undefined && <p className="label flex shrink-0 items-center gap-2">{aside}</p>}
    </div>
  );
}

interface ReadoutProps {
  label: string;
  children: ReactNode;
  className?: string;
}

/** One labeled value in a readout list. Use inside a <dl>. */
export function Readout({ label, children, className }: ReadoutProps) {
  return (
    <div className={cn('grid grid-cols-[6.5rem_minmax(0,1fr)] items-baseline gap-3 border-t border-line px-3.5 py-2', className)}>
      <dt className="label">{label}</dt>
      <dd className="data min-w-0 text-bright">{children}</dd>
    </div>
  );
}

interface SciProps {
  value: number;
  digits?: number;
}

/** A number in scientific notation with a true superscript exponent. */
export function Sci({ value, digits = 3 }: SciProps) {
  const parts = sci(value, digits);
  if (parts.exponent === null) return <>{parts.mantissa}</>;
  return (
    <>
      {parts.mantissa} × 10<sup>{parts.exponent}</sup>
    </>
  );
}
