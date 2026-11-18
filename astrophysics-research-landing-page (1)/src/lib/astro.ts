/**
 * Positional astronomy for the sky panel.
 * All angles are in degrees. Azimuth is measured from north through east.
 */

const RAD = Math.PI / 180;

export const mod = (value: number, modulus: number): number => ((value % modulus) + modulus) % modulus;

const clampUnit = (value: number): number => Math.min(1, Math.max(-1, value));

export interface Horizontal {
  alt: number;
  az: number;
}

export interface Equatorial {
  ra: number;
  dec: number;
}

/** Julian Date for a JavaScript Date (UTC; UT1 differs by under a second). */
export function julianDate(date: Date): number {
  return date.getTime() / 86_400_000 + 2_440_587.5;
}

/** Greenwich mean sidereal time. Meeus, Astronomical Algorithms (1998), eq. 12.4. */
export function gmstDeg(jd: number): number {
  const days = jd - 2_451_545.0;
  const centuries = days / 36_525;
  return mod(
    280.46061837 + 360.98564736629 * days + 0.000387933 * centuries ** 2 - centuries ** 3 / 38_710_000,
    360,
  );
}

/** Local mean sidereal time for an east-positive longitude. */
export function lstDeg(jd: number, lonEast: number): number {
  return mod(gmstDeg(jd) + lonEast, 360);
}

/** Equatorial (RA, Dec) to horizontal (altitude, azimuth) for a given sidereal time and latitude. */
export function toHorizontal(ra: number, dec: number, lst: number, lat: number): Horizontal {
  const hourAngle = (lst - ra) * RAD;
  const d = dec * RAD;
  const phi = lat * RAD;
  const sinAlt = Math.sin(phi) * Math.sin(d) + Math.cos(phi) * Math.cos(d) * Math.cos(hourAngle);
  const az = Math.atan2(
    -Math.cos(d) * Math.sin(hourAngle),
    Math.sin(d) * Math.cos(phi) - Math.cos(d) * Math.sin(phi) * Math.cos(hourAngle),
  );
  return { alt: Math.asin(clampUnit(sinAlt)) / RAD, az: mod(az / RAD, 360) };
}

/** Horizontal (altitude, azimuth) back to equatorial (RA, Dec). */
export function toEquatorial(alt: number, az: number, lst: number, lat: number): Equatorial {
  const a = alt * RAD;
  const azimuth = az * RAD;
  const phi = lat * RAD;
  const sinDec = Math.sin(a) * Math.sin(phi) + Math.cos(a) * Math.cos(phi) * Math.cos(azimuth);
  const hourAngle = Math.atan2(
    -Math.sin(azimuth) * Math.cos(a),
    Math.sin(a) * Math.cos(phi) - Math.cos(a) * Math.sin(phi) * Math.cos(azimuth),
  );
  return { ra: mod(lst - hourAngle / RAD, 360), dec: Math.asin(clampUnit(sinDec)) / RAD };
}

/** Apparent position of the Sun. Astronomical Almanac low-precision formula, good to about 0.01 deg. */
export function sunEquatorial(jd: number): Equatorial {
  const days = jd - 2_451_545.0;
  const meanLongitude = mod(280.46 + 0.9856474 * days, 360);
  const meanAnomaly = mod(357.528 + 0.9856003 * days, 360) * RAD;
  const lambda = (meanLongitude + 1.915 * Math.sin(meanAnomaly) + 0.02 * Math.sin(2 * meanAnomaly)) * RAD;
  const obliquity = (23.439 - 0.0000004 * days) * RAD;
  return {
    ra: mod(Math.atan2(Math.cos(obliquity) * Math.sin(lambda), Math.cos(lambda)) / RAD, 360),
    dec: Math.asin(clampUnit(Math.sin(obliquity) * Math.sin(lambda))) / RAD,
  };
}

/** Mean obliquity of the ecliptic at J2000.0. */
export const OBLIQUITY_J2000 = 23.4393;

/** A point on the ecliptic (latitude zero) at the given ecliptic longitude. */
export function eclipticToEquatorial(longitude: number): Equatorial {
  const lambda = longitude * RAD;
  const obliquity = OBLIQUITY_J2000 * RAD;
  return {
    ra: mod(Math.atan2(Math.cos(obliquity) * Math.sin(lambda), Math.cos(lambda)) / RAD, 360),
    dec: Math.asin(clampUnit(Math.sin(obliquity) * Math.sin(lambda))) / RAD,
  };
}

export type SkyState = 'day' | 'civil' | 'nautical' | 'astronomical' | 'night';

/** Twilight class from the Sun's altitude (standard 6, 12 and 18 degree limits). */
export function skyState(sunAltitude: number): SkyState {
  if (sunAltitude > -0.833) return 'day';
  if (sunAltitude > -6) return 'civil';
  if (sunAltitude > -12) return 'nautical';
  if (sunAltitude > -18) return 'astronomical';
  return 'night';
}
