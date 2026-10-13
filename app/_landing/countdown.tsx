'use client';

import { useEffect, useState } from 'react';

import { C } from './shared';

const pad = (n: number) => String(n).padStart(2, '0');

/* Next local midnight in the viewer's own timezone, so the offer always ends
   at the close of THEIR day and rolls over to a fresh 24h window after. */
function msToMidnight(now: number) {
  const end = new Date(now);
  end.setHours(24, 0, 0, 0);
  return end.getTime() - now;
}

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return [
    { v: Math.floor(s / 3600), label: 'Hrs' },
    { v: Math.floor((s % 3600) / 60), label: 'Mins' },
    { v: s % 60, label: 'Secs' },
  ];
}

/* Time left on today's offer: a boxed HH : MM : SS timer, or one line of text
   for the docked bar. Renders nothing until mounted, so the server HTML and
   the first client render agree. */
export function OfferCountdown({ inline = false }: { inline?: boolean }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (now === null) return null;
  const segs = parts(msToMidnight(now));

  if (inline) {
    const [h, m, s] = segs;
    return (
      <span className="tabular-nums" role="timer">
        {pad(h.v)}h : {pad(m.v)}m : {pad(s.v)}s
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-start gap-1.5"
      role="timer"
      aria-label="Time left on today's offer"
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
