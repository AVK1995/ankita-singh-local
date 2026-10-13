'use client';

import { useEffect, useState } from 'react';

import { START_AT } from './offer';
import { C } from './shared';

const START_MS = new Date(START_AT).getTime();
const pad = (n: number) => String(n).padStart(2, '0');

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return [
    { v: Math.floor(s / 86400), label: 'Days' },
    { v: Math.floor((s % 86400) / 3600), label: 'Hrs' },
    { v: Math.floor((s % 3600) / 60), label: 'Mins' },
    { v: s % 60, label: 'Secs' },
  ];
}

/* Time left until the first session: a boxed DD : HH : MM : SS timer, or one
   line of text for the docked bar. Renders nothing until mounted, so the server
   HTML and the first client render agree, and nothing once the reset starts. */
export function StartCountdown({ inline = false }: { inline?: boolean }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (now === null || now >= START_MS) return null;
  const segs = parts(START_MS - now);

  if (inline) {
    const [d, h, m, s] = segs;
    return (
      <span className="tabular-nums" role="timer">
        {pad(d.v)}d : {pad(h.v)}h : {pad(m.v)}m : {pad(s.v)}s
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-start gap-1.5"
      role="timer"
      aria-label="Time until the reset starts"
    >
      {segs.map((p, i) => (
        <span key={p.label} className="inline-flex items-start gap-1.5">
          {i > 0 && (
            <span
              aria-hidden
              className="font-display text-[20px] font-bold leading-[42px]"
              style={{ color: C.goldInk }}
            >
              :
            </span>
          )}
          <span className="inline-flex flex-col items-center">
            <span
              className="grid h-[42px] min-w-[46px] place-items-center rounded-lg px-1.5 font-display text-[20px] font-bold tabular-nums"
              style={{ background: C.goldInk, color: '#FFFFFF' }}
            >
              {pad(p.v)}
            </span>
            <span
              className="mt-1 text-[9.5px] font-bold uppercase tracking-[0.08em]"
              style={{ color: C.inkSoft }}
            >
              {p.label}
            </span>
          </span>
        </span>
      ))}
    </span>
  );
}
