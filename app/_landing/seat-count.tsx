'use client';

import { useEffect, useState } from 'react';

import { SEATS_START } from './offer';

/* One shared countdown, so every instance on the page shows the same number.
   First drop after 3-5s, then seven more at random 3-8s gaps, then it holds. */
const DROPS = 8;
let seats = SEATS_START;
let started = false;
const listeners = new Set<(n: number) => void>();

const randomMs = (min: number, max: number) => (min + Math.random() * (max - min)) * 1000;

function start() {
  if (started) return;
  started = true;
  let done = 0;
  const schedule = () => {
    if (done >= DROPS) return;
    const delay = done === 0 ? randomMs(3, 5) : randomMs(3, 8);
    window.setTimeout(() => {
      seats -= 1;
      done += 1;
      listeners.forEach((fn) => fn(seats));
      schedule();
    }, delay);
  };
  schedule();
}

export function SeatCount() {
  const [n, setN] = useState(SEATS_START);
  useEffect(() => {
    setN(seats);
    listeners.add(setN);
    start();
    return () => {
      listeners.delete(setN);
    };
  }, []);
  return <>{n}</>;
}
