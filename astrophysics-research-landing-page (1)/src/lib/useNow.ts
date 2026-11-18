import { useSyncExternalStore } from 'react';

/**
 * One shared 1 Hz clock. Every live readout on the page subscribes to the same
 * interval, so all clocks tick together and the timer stops when nothing listens.
 */
let now = Date.now();
let timer: number | undefined;
const listeners = new Set<() => void>();

function tick(): void {
  now = Date.now();
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  if (timer === undefined) {
    now = Date.now();
    timer = window.setInterval(tick, 1000);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer !== undefined) {
      window.clearInterval(timer);
      timer = undefined;
    }
  };
}

const getSnapshot = (): number => now;

/** Milliseconds since the Unix epoch, refreshed once per second. */
export function useNow(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
