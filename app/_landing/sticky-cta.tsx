'use client';

/**
 * The docked CTA (page chrome, not a section).
 *
 * On phones it is always on screen. From md up it shows only between the hero
 * and the closing recap, where no other CTA is in view.
 */
import { ArrowRight, CalendarBlank, Clock } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import {
  CHECKOUT_HREF,
  DISCOUNT_PCT,
  PRICE,
  SESSION_TIMES,
  START_DATE,
  STRIKE_PRICE,
} from './offer';
import { C } from './shared';

export default function StickyCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hero = document.querySelector('[data-hero]');
    const final = document.querySelector('[data-final]');
    if (!hero) return;

    const state = { pastHero: false, atFinal: false };
    const apply = () => setShow(state.pastHero && !state.atFinal);

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.target === hero) state.pastHero = !e.isIntersecting;
          if (e.target === final) state.atFinal = e.isIntersecting;
        }
        apply();
      },
      { threshold: 0 },
    );

    io.observe(hero);
    if (final) io.observe(final);
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* Phones only: the bar never hides there, so the footer needs room under it. */}
      <div
        aria-hidden
        className="md:hidden"
        style={{ height: 'calc(76px + env(safe-area-inset-bottom))' }}
      />
      <div
        className={`fixed inset-x-0 bottom-0 z-50 transition-opacity duration-300 ${
          show
            ? 'kz-dock opacity-100'
            : 'opacity-100 md:pointer-events-none md:opacity-0'
        }`}
        style={{
          /* Paper glass: a near-opaque tint of the canvas with blur behind it. */
          background: 'rgba(255, 247, 249,0.94)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderTop: `1px solid ${C.lineStrong}`,
          boxShadow: '0 -12px 36px -24px rgba(31, 16, 20,0.42)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {/* The lit hairline that makes the bar read as a lifted surface rather
            than as a panel taped to the bottom of the window. */}
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${C.goldMid}, transparent)`,
          }}
        />
  
        <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-3 px-4 py-3 sm:px-8">
          <div className="min-w-0 shrink-0">
            <p
              className="truncate font-display text-[13px] font-bold leading-tight sm:text-[16.5px]"
              style={{ color: C.ink }}
            >
              5-Day Fertility Reset
            </p>
            <p className="mt-0.5 flex items-baseline gap-1.5 tabular-nums">
              <s
                className="text-[12px] font-semibold decoration-2 sm:text-[13px]"
                style={{ color: C.inkSoft }}
              >
                {STRIKE_PRICE}
              </s>
              <span
                className="font-display text-[20px] font-extrabold leading-none sm:text-[22px]"
                style={{ color: C.goldDeep }}
              >
                {PRICE}
              </span>
            </p>
            <p
              className="mt-1 hidden items-center gap-3 truncate text-[12px] font-normal sm:flex"
              style={{ color: C.inkMuted }}
            >
              <span className="inline-flex shrink-0 items-center gap-1.5">
                <CalendarBlank weight="bold" className="h-3 w-3" style={{ color: C.goldInk }} />
                Starts {START_DATE}
              </span>
              <span className="inline-flex shrink-0 items-center gap-1.5">
                <Clock weight="bold" className="h-3 w-3" style={{ color: C.coralInk }} />
                {SESSION_TIMES}
              </span>
            </p>
          </div>

          <Link
            href={CHECKOUT_HREF}
            data-cta
            className="lego-press cta-shimmer group inline-flex min-h-[50px] flex-1 items-center justify-center gap-2 rounded-full px-4 text-center text-[14px] font-bold leading-tight sm:flex-none sm:px-7 sm:text-[15px]"
            style={{
              background: C.ctaFill,
              color: C.onAccent,
              boxShadow: C.ctaGlow,
              ['--shimmer' as string]: 'rgba(252, 228, 234,0.42)',
            }}
          >
            <span className="inline-flex items-center gap-2">
              Book My Spot - {DISCOUNT_PCT}% Off Today
              <ArrowRight
                weight="bold"
                className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </span>
          </Link>
        </div>
      </div>
    </>
  );
}
