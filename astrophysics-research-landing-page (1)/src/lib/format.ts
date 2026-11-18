import { mod } from './astro';

const MINUS = '\u2212';

export const pad = (value: number, width = 2): string => String(Math.trunc(Math.abs(value))).padStart(width, '0');

/** Fixed-point number with an explicit sign and a typographic minus. */
export function signed(value: number, digits = 1): string {
  const text = Math.abs(value).toFixed(digits);
  return `${value < 0 && Number(text) !== 0 ? MINUS : '+'}${text}`;
}

/** Fixed-point number with a typographic minus and no plus sign (magnitudes). */
export function plain(value: number, digits = 2): string {
  return value.toFixed(digits).replace('-', MINUS);
}

export interface SciParts {
  mantissa: string;
  /** Null when the value is small enough to print without a power of ten. */
  exponent: string | null;
}

/** Split a number into mantissa and base-ten exponent at the given significant digits. */
export function sci(value: number, digits = 3): SciParts {
  if (!Number.isFinite(value) || value === 0) return { mantissa: '0', exponent: null };
  let exponent = Math.floor(Math.log10(Math.abs(value)));
  if (exponent >= -2 && exponent <= 3) {
    return { mantissa: String(Number(value.toPrecision(digits))).replace('-', MINUS), exponent: null };
  }
  let mantissa = (value / 10 ** exponent).toFixed(digits - 1);
  if (Math.abs(Number(mantissa)) >= 10) {
    exponent += 1;
    mantissa = (value / 10 ** exponent).toFixed(digits - 1);
  }
  return { mantissa: mantissa.replace('-', MINUS), exponent: String(exponent).replace('-', MINUS) };
}

/** Spoken form of a number in scientific notation, for assistive technology. */
export function sciText(value: number, digits = 3): string {
  const parts = sci(value, digits);
  return parts.exponent === null ? parts.mantissa : `${parts.mantissa} times ten to the ${parts.exponent}`;
}

/** Right ascension as hours and minutes. */
export function formatRa(raDeg: number): string {
  const totalMinutes = Math.round((mod(raDeg, 360) / 15) * 60) % 1440;
  return `${pad(Math.floor(totalMinutes / 60))}h ${pad(totalMinutes % 60)}m`;
}

/** Declination as signed degrees and arcminutes. */
export function formatDec(decDeg: number): string {
  const totalMinutes = Math.round(Math.abs(decDeg) * 60);
  const sign = decDeg < 0 && totalMinutes !== 0 ? MINUS : '+';
  return `${sign}${pad(Math.floor(totalMinutes / 60))}\u00b0 ${pad(totalMinutes % 60)}\u2032`;
}

/** Sidereal time as hours, minutes and seconds. */
export function formatSidereal(deg: number): string {
  const totalSeconds = Math.floor((mod(deg, 360) / 15) * 3600) % 86_400;
  return `${pad(Math.floor(totalSeconds / 3600))}h ${pad(Math.floor((totalSeconds % 3600) / 60))}m ${pad(totalSeconds % 60)}s`;
}

/** Azimuth as a zero-padded bearing. */
export function formatAzimuth(az: number): string {
  return `${mod(az, 360).toFixed(1).padStart(5, '0')}\u00b0`;
}

/** Offset from the present as T plus or minus hours and minutes. */
export function formatOffset(minutes: number): string {
  const magnitude = Math.abs(minutes);
  return `T${minutes < 0 ? MINUS : '+'}${pad(Math.floor(magnitude / 60))}:${pad(magnitude % 60)}`;
}

export function utcStamp(date: Date): { date: string; time: string } {
  const iso = date.toISOString();
  return { date: iso.slice(0, 10), time: iso.slice(11, 19) };
}

const zoneFormatters = new Map<string, Intl.DateTimeFormat>();

function zoneFormatter(timeZone: string): Intl.DateTimeFormat {
  const cached = zoneFormatters.get(timeZone);
  if (cached) return cached;

  const base: Intl.DateTimeFormatOptions = { timeZone, hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' };
  let formatter: Intl.DateTimeFormat;
  try {
    const withOffset: Record<string, unknown> = { ...base, timeZoneName: 'shortOffset' };
    formatter = new Intl.DateTimeFormat('en-GB', withOffset as Intl.DateTimeFormatOptions);
  } catch {
    formatter = new Intl.DateTimeFormat('en-GB', base);
  }
  zoneFormatters.set(timeZone, formatter);
  return formatter;
}

/** Wall-clock time and UTC offset in an IANA time zone, from the browser's time-zone database. */
export function zoneClock(date: Date, timeZone: string): { time: string; offset: string } {
  const parts = zoneFormatter(timeZone).formatToParts(date);
  const part = (type: string): string => parts.find((entry) => entry.type === type)?.value ?? '';
  const zone = part('timeZoneName');
  const match = /([+\-\u2212])(\d{1,2})(?::(\d{2}))?/.exec(zone);
  let offset = '';
  if (match) {
    offset = `UTC${match[1] === '+' ? '+' : MINUS}${match[2].padStart(2, '0')}:${match[3] ?? '00'}`;
  } else if (zone) {
    offset = 'UTC+00:00';
  }
  return { time: `${part('hour')}:${part('minute')}:${part('second')}`, offset };
}

const ENERGY_UNITS: readonly (readonly [number, string])[] = [
  [1e12, 'TeV'],
  [1e9, 'GeV'],
  [1e6, 'MeV'],
  [1e3, 'keV'],
  [1, 'eV'],
  [1e-3, 'meV'],
  [1e-6, '\u00b5eV'],
  [1e-9, 'neV'],
  [1e-12, 'peV'],
  [1e-15, 'feV'],
];

/** Energy in electronvolts with an SI prefix, three significant digits. */
export function formatEnergy(electronVolts: number): string {
  for (const [scale, unit] of ENERGY_UNITS) {
    if (electronVolts >= scale) return `${Number((electronVolts / scale).toPrecision(3))} ${unit}`;
  }
  return `${electronVolts.toExponential(2)} eV`;
}
