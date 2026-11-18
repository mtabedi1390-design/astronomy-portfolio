/**
 * Constants and textbook relations behind the two reference models.
 * SI units unless noted. Fundamental constants: CODATA 2018.
 */

export const G = 6.6743e-11; // m^3 kg^-1 s^-2
export const HBAR = 1.054571817e-34; // J s
export const C = 299_792_458; // m s^-1 (exact)
export const K_B = 1.380649e-23; // J K^-1 (exact)
export const EV = 1.602176634e-19; // J (exact)
export const JULIAN_YEAR = 31_557_600; // s

/** Age of the universe, Planck 2018 (TT,TE,EE+lowE+lensing+BAO). */
export const AGE_OF_UNIVERSE_YR = 13.787e9;
/** CMB monopole temperature, Fixsen 2009. */
export const T_CMB = 2.7255; // K

export const M_SUN = 1.98841e30; // kg
export const M_EARTH = 5.9722e24; // kg
export const M_MOON = 7.346e22; // kg
/** Initial PBH mass that completes evaporation today with Standard Model emission (Carr et al. 2010: 5e14 g). */
export const M_STAR = 5e11; // kg

/** Schwarzschild radius, r_s = 2GM / c^2. */
export const schwarzschildRadius = (mass: number): number => (2 * G * mass) / C ** 2;

/** Hawking temperature, T_H = hbar c^3 / (8 pi G M k_B). */
export const hawkingTemperature = (mass: number): number => (HBAR * C ** 3) / (8 * Math.PI * G * mass * K_B);

/** Blackbody luminosity of the horizon, P = hbar c^6 / (15360 pi G^2 M^2). Photons only. */
export const hawkingPower = (mass: number): number => (HBAR * C ** 6) / (15_360 * Math.PI * G ** 2 * mass ** 2);

/** Evaporation time in seconds, t_ev = 5120 pi G^2 M^3 / (hbar c^4). Photons only: an upper bound. */
export const evaporationTime = (mass: number): number => (5120 * Math.PI * G ** 2 * mass ** 3) / (HBAR * C ** 4);

/** Earth's mean motion in degrees per day (Gaussian gravitational constant). */
export const EARTH_MEAN_MOTION = 0.98560767;

/** ZTF camera plate scale in arcseconds per pixel (Dekany et al. 2020). */
export const ZTF_PIXEL_SCALE = 1.01;

/**
 * Apparent sky-plane rate, in degrees per day, of a body on a circular, coplanar orbit
 * of semi-major axis `a` (au, a > 1) seen from Earth at opposition:
 *   mu = n_E (1 - a^-1/2) / (a - 1)
 */
export function oppositionRate(a: number): number {
  return (EARTH_MEAN_MOTION * (1 - 1 / Math.sqrt(a))) / (a - 1);
}
