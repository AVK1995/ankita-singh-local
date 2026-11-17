'use client';

import { useEffect, useState } from 'react';

/* ── "Last N seats left" ────────────────────────────────────────────────
   One shared countdown, so every instance on the page shows the same number.

   Starts at a RANDOM number between 40 and 70, then drops by one every 30–40
   seconds (randomised per drop). The current number is kept in sessionStorage,
   so a reload or a hop to the checkout and back never jumps it back up.
   It stops at FLOOR rather than running to zero on a long visit.

   ⚠️ This is a display number, not a real inventory count. */
const START_MIN = 40;
const START_MAX = 70;
const STEP_MIN_S = 30;
const STEP_MAX_S = 40;
const FLOOR = 9;
const KEY = 'bwy_seats';

let seats: number | null = null;
let started = false;
const listeners = new Set<(n: number) => void>();

const rand = (min: number, max: number) => min + Math.random() * (max - min);

function read(): number | null {
  try {
    const v = Number(window.sessionStorage.getItem(KEY));
    return Number.isFinite(v) && v >= FLOOR && v <= START_MAX ? v : null;
  } catch {
    return null;
  }
}

function write(n: number) {
  try {
    window.sessionStorage.setItem(KEY, String(n));
  } catch {
    /* storage blocked: the count still runs for this page view */
  }
}

function start() {
  if (started) return;
  started = true;
  seats = read() ?? Math.round(rand(START_MIN, START_MAX));
  write(seats);
  listeners.forEach((fn) => fn(seats as number));

  const tick = () => {
    window.setTimeout(() => {
      if (seats !== null && seats > FLOOR) {
        seats -= 1;
        write(seats);
        listeners.forEach((fn) => fn(seats as number));
      }
      tick();
    }, rand(STEP_MIN_S, STEP_MAX_S) * 1000);
  };
  tick();
}

export function SeatCount() {
  /* null until mounted: the server cannot know the random start, and
     rendering one there would mismatch the client on hydration. */
  const [n, setN] = useState<number | null>(seats);
  useEffect(() => {
    listeners.add(setN);
    start();
    if (seats !== null) setN(seats);
    return () => {
      listeners.delete(setN);
    };
  }, []);
  return (
    <span key={n ?? 'x'} className={n === null ? 'invisible' : 'addon-pop'}>
      {n ?? '00'}
    </span>
  );
}
