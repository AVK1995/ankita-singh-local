/**
 * Above the fold: the announcement strip, the LIGHT hero stage, and the trust
 * ledger that straddles the seam beneath it.
 *
 * A pure Server Component (no 'use client', no hooks) so it paints from static
 * HTML with zero JavaScript on the critical path.
 *
 * The stage is light since 24 Sep 2026 and the page now carries no dark band at
 * all. That is not a background swap: `.kz-lit` replaces `.kz-lit-dark`, every
 * accent sitting on the stage steps to its ink variant, the rules that were
 * brighter than their rows are now darker than them, and the shadows drop from
 * near-black to an ink tint. Each of those fails silently, because the page
 * still looks deliberate with any one of them left undone.
 *
 * COPY IS VERBATIM from COPY-SOURCE.md. Where a run-on line is split across
 * elements the words and their order are untouched.
 */
import {
  ArrowRight,
  CalendarBlank,
  Clock,
  Gift,
  Heart,
  ShieldCheck,
  Star,
  VideoCamera,
} from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import Link from 'next/link';

import { legoBrick, legoDelay } from './lego-style';
import {
  CHECKOUT_HREF,
  DATES,
  compactRange,
  DAY1_DATE,
  DAY1_TIME,
  DAY2_DATE,
  DAY2_TIME,
  DISCOUNT_PCT,
  INCLUDED,
  INCLUDED_TOTAL,
  inr,
  PRICE,
  SAME_TIME,
  SESSION_SHORT,
  SESSION_TIMES_TZ,
  STRIKE_PRICE,
  WOMEN_GUIDED,
} from './offer';
import { asset } from './asset-version';
import { C } from './shared';

/* ══ 0 · Announcement strip ════════════════════════════════════════════════ */
export function AnnouncementBar() {
  /* The doc's header line ("2 Days · 12 PM IST · Live on Zoom") plus the
     offer. The old "Price increases tomorrow" line is gone: the approved copy
     makes no such deadline claim. */
  const segments = [
    <>
      <span className="font-bold">Special Offer:</span> 2-Day Fertility Reset Masterclass for{' '}
      {/* gold, not goldInk. The bar is dark, and goldInk measures 1.88:1 on
          navyDeep. The pale step is 10.88:1. */}
      <span style={{ color: C.gold }}>{PRICE}</span>
    </>,
    <>2 Days · {SESSION_SHORT} · Live on Zoom</>,
    <>
      <s>{STRIKE_PRICE}</s> <span style={{ color: C.gold }}>{PRICE}</span> · {DISCOUNT_PCT}% Off
    </>,
    <>100% Money-Back Guarantee</>,
  ];

  /* One copy of the strip, rendered twice inside the track, which is what makes
     a -50% translate loop seamlessly: at the reset the second copy sits exactly
     where the first began. The duplicate is decorative, so it is hidden from
     assistive tech rather than read out twice. */
  const strip = (copy: '1' | '2') => (
    <ul
      key={copy}
      data-marquee-copy={copy}
      aria-hidden={copy === '2' ? true : undefined}
      className="flex shrink-0 items-center gap-x-3 whitespace-nowrap pr-3 text-[12.5px] leading-snug sm:text-[13.5px]"
    >
      {segments.map((seg, i) => (
        <li key={i} className="inline-flex items-center gap-3 pr-3">
          {i === 0 ? (
            <span
              className="lego-pulse-dot inline-block h-[7px] w-[7px] shrink-0 rounded-full"
              style={{
                background: C.coral,
                ['--dot-pulse' as string]: 'rgba(255, 110, 136,0.6)',
              }}
            />
          ) : (
            <span aria-hidden style={{ color: 'rgba(255, 247, 249,0.38)' }}>
              |
            </span>
          )}
          <span>{seg}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className="cta-shimmer w-full py-2.5"
      style={{
        /* Dark, in the theme's deepest step. It is the only dark thing above
           the fold and it caps the light stage rather than sitting inside it. */
        background: C.navyDeep,
        color: C.onDark,
        borderBottom: '1px solid rgba(252, 228, 234,0.16)',
        ['--shimmer' as string]: 'rgba(255, 247, 249,0.16)',
      }}
    >
      {/* The mask lives on this inner element, NOT on the bar. A mask applies
          to the element's own background as well as its content, so masking
          the bar fades the strip's own fill and lets the page show through at
          both ends. */}
      <div className="kz-marquee">
        <div className="kz-marquee-track">
          {strip('1')}
          {strip('2')}
        </div>
      </div>
    </div>
  );
}

/* ══ 1 · Hero ══════════════════════════════════════════════════════════════ */

const HERO_CTA_LABEL = `Book My Seat Now - ${DISCOUNT_PCT}% Off Today!`;

export function Hero() {
  return (
    <>
      <section data-hero className="kz-stage pb-24 pt-10 sm:pt-12">
        <div className="mx-auto flex max-w-[1180px] flex-col items-center gap-10 px-5 pt-6 sm:gap-12 md:px-8 lg:pt-10">
          {/* ══ LEFT ══════════════════════════════════════════════════════ */}
          <div className="w-full max-w-[860px] text-center">
            <span
              className="inline-flex items-center justify-center gap-2.5 rounded-full px-4 py-2 text-center text-[10.5px] font-bold uppercase leading-[1.5] tracking-[0.1em]"
              style={{
                background: C.goldWash,
                border: '1px solid rgba(248, 113, 134,0.45)',
                /* 10.5px uppercase is the smallest type on the screen, so it
                   takes the 4.5:1 step: goldInk is 7.47:1 on goldWash. */
                color: C.goldInk,
              }}
            >
              <span
                className="lego-pulse-dot inline-block h-2 w-2 shrink-0 rounded-full"
                style={{
                  background: C.coral,
                  ['--dot-pulse' as string]: 'rgba(255, 110, 136,0.6)',
                }}
              />
              2-Day LIVE Fertility Reset Masterclass
            </span>

            <p
              className="mx-auto mt-6 max-w-[680px] font-body text-[17px] font-semibold leading-[1.45] sm:text-[19px]"
              style={{ color: C.inkSoft }}
            >
              Want to get pregnant even with{' '}
              {[
                'PCOS/PCOD',
                'thyroid issues',
                'endometriosis',
                'irregular periods',
                'weight gain',
                'unexplained fertility struggles',
              ].map((c, i, all) => (
                <span key={c}>
                  <strong className="whitespace-nowrap font-extrabold" style={{ color: C.goldDeep }}>
                    {c}
                  </strong>
                  {i === all.length - 1 ? '?' : i === all.length - 2 ? ' or ' : ', '}
                </span>
              ))}
            </p>

            <h1
              className="mt-4 font-display text-[30px] font-extrabold leading-[1.12] sm:text-[40px] lg:text-[46px]"
              style={{ color: C.ink, textWrap: 'balance' } as React.CSSProperties}
            >
              Double your chances of Pregnancy with a simple at-home{' '}
              <span className="kz-lit kz-lit-hero">&ldquo;Period-Sync Yoga Routine&rdquo;</span>
            </h1>

            <p
              className="mx-auto mt-4 max-w-[620px] font-body text-[17px] font-semibold leading-[1.45] sm:text-[19px]"
              style={{ color: C.inkSoft }}
            >
              Even after trying IVF/IUI, hormonal injections or medicines.
            </p>
            <p
              className="mx-auto mt-2 max-w-[620px] font-body text-[15px] leading-[1.55] sm:text-[16.5px]"
              style={{ color: C.inkSoft }}
            >
              Understand your cycle, learn what to do during each phase and experience
              gentle live yoga with Ankita Singh.
            </p>

            <p
              className="mx-auto mt-6 flex max-w-[620px] flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[14.5px] font-semibold"
              style={{ color: C.ink }}
            >
              <span className="inline-flex gap-0.5" aria-label="Five stars">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} weight="fill" className="h-4 w-4" style={{ color: C.goldDeep }} />
                ))}
              </span>
              <span>
                Trusted by {WOMEN_GUIDED} women across their fertility &amp; motherhood journeys
              </span>
            </p>

            {/* ONE event card at every width, widened past the 860 copy column
                on desktop. It replaces the old offer card + floating fact
                tiles, which said the same things twice in two places. */}
            <EventCard className="mt-8 lg:-mx-[60px]" />

            <div className="mt-9 flex justify-center">
              {/* Sized to the button, so the note below centres under it. */}
              <div className="flex w-full flex-col items-center sm:w-auto">
                <Link
                  href={CHECKOUT_HREF}
                  data-cta
                  className="lego-press cta-shimmer group inline-flex min-h-[58px] w-full items-center justify-center gap-2.5 rounded-full px-8 font-body text-[15.5px] font-bold sm:w-auto"
                  style={{
                    background: C.ctaFill,
                    color: C.onAccent,
                    boxShadow: C.ctaGlow,
                    ['--shimmer' as string]: 'rgba(255,255,255,0.55)',
                  }}
                >
                  <span className="inline-flex items-center gap-2.5">
                    {HERO_CTA_LABEL}
                    <ArrowRight
                      weight="bold"
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                    />
                  </span>
                </Link>

                {/* Replaces the old "Last xx seats left" line: the approved
                    copy makes no seat-limit claim under the button. */}
                <p
                  className="mt-4 text-center font-display text-[15px] font-bold leading-snug sm:text-[16px]"
                  style={{ color: C.ink }}
                >
                  Single live batch · {SESSION_SHORT}
                  {SAME_TIME ? ' both days' : ''} · 100% money-back guarantee
                </p>

                <p
                  className="mt-3 max-w-[560px] text-center text-[13.5px] leading-snug"
                  style={{ color: C.inkSoft }}
                >
                  <ShieldCheck
                    weight="fill"
                    aria-hidden
                    className="mr-1.5 inline-block h-4 w-4 align-[-3px]"
                    style={{ color: C.emeraldInk }}
                  />
                  <strong style={{ color: C.ink }}>Get-Clarity Promise:</strong> Understand your
                  cycle and learn how to begin your Fertility Reset Routine by Day 2 or get a 100%
                  refund, subject to the published{' '}
                  <Link href="/refund-policy" className="underline" style={{ color: C.goldInk }}>
                    refund policy
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="kz-stage-seam" aria-hidden />
      <TrustLedger />
    </>
  );
}

/* ── The event card ──────────────────────────────────────────────────────
   The doc's hero event box as ONE object: Ankita on the left, then what it
   is, when it runs (both days as a mini schedule), what comes with it, and
   the price collapse. It replaces an offer card plus four floating fact
   tiles that repeated each other.

   The photo is the client's own (303 x 585). It is kept in a column no wider
   than ~300px so it is never shown much larger than it was shot, and is
   cropped from the top so the face always survives. */
const SCHEDULE = [
  {
    day: 'DAY 01',
    date: DAY1_DATE,
    time: compactRange(DAY1_TIME),
    title: 'Understand your cycle & the Fertility Reset Blueprint',
    tag: 'Theory & clarity',
  },
  {
    day: 'DAY 02',
    date: DAY2_DATE,
    time: compactRange(DAY2_TIME),
    title: 'Guided Period-Sync Yoga & your next steps',
    tag: 'Live yoga practice',
  },
];

/* The four bonuses, summed rather than typed (₹1,988). */
const BONUS_VALUE = INCLUDED.filter((i) => i.access === 'instant').reduce((n, i) => n + i.value, 0);

function EventCard({ className = '' }: { className?: string }) {
  return (
    <div
      data-lego=""
      className={`grid overflow-hidden rounded-[28px] text-left sm:grid-cols-[240px_minmax(0,1fr)] lg:grid-cols-[290px_minmax(0,1fr)] ${className}`}
      style={{
        ...legoDelay(2, 90),
        background: C.surface,
        border: `1px solid ${C.lineStrong}`,
        boxShadow: '0 0 0 8px rgba(248, 113, 134,0.10), 0 30px 64px -34px rgba(31, 16, 20,0.36)',
      }}
    >
      {/* ── Ankita ── */}
      <div className="relative aspect-[4/5] sm:aspect-auto sm:min-h-full">
        <Image
          src={asset('/system-images/ankita-hero.jpg')}
          alt="Ankita Singh, founder of Bindwithyoga"
          fill
          priority
          sizes="(min-width: 1024px) 290px, (min-width: 640px) 240px, 100vw"
          className="object-cover"
          style={{ objectPosition: '50% 12%' }}
        />
        <span
          className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em]"
          style={{ background: 'rgba(255,255,255,0.94)', color: C.goldInk, boxShadow: '0 6px 16px -8px rgba(31,16,20,0.4)' }}
        >
          <span
            className="lego-pulse-dot inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: C.coral, ['--dot-pulse' as string]: 'rgba(255, 110, 136,0.6)' }}
          />
          Live on Zoom
        </span>
        <div
          className="absolute inset-x-0 bottom-0 px-4 pb-4 pt-14"
          style={{ background: 'linear-gradient(to top, rgba(31,16,20,0.82), rgba(31,16,20,0))' }}
        >
          <p className="font-display text-[17px] font-bold leading-tight text-white">Ankita Singh</p>
          <p className="mt-0.5 text-[11.5px] leading-snug" style={{ color: 'rgba(255,255,255,0.85)' }}>
            Yoga Therapist · Fertility Yoga Practitioner
          </p>
        </div>
      </div>

      {/* ── The masterclass ── */}
      <div className="flex flex-col p-5 sm:p-6 lg:p-7">
        <h2
          className="font-display text-[22px] font-bold leading-[1.15] sm:text-[24px] lg:text-[26px]"
          style={{ color: C.ink }}
        >
          Your 2-Day Live Fertility Reset Masterclass
        </h2>

        <div className="mt-3 flex flex-wrap gap-2 text-[12px] font-semibold" style={{ color: C.ink }}>
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5" style={{ background: C.goldPale }}>
            <CalendarBlank weight="bold" className="h-3.5 w-3.5" style={{ color: C.goldInk }} />
            2 consecutive days · {DATES}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5" style={{ background: C.goldPale }}>
            <Clock weight="bold" className="h-3.5 w-3.5" style={{ color: C.goldInk }} />
            {SAME_TIME ? `${SESSION_TIMES_TZ} · Both days` : SESSION_TIMES_TZ}
          </span>
        </div>

        {/* Both days, as the schedule they are. */}
        <ol className="mt-5 space-y-2.5">
          {SCHEDULE.map((d, i) => (
            <li
              key={d.day}
              className="flex items-stretch gap-3 rounded-2xl p-2.5"
              style={{ background: C.canvasAlt, border: `1px solid ${C.line}` }}
            >
              <span
                className="flex w-[64px] shrink-0 flex-col items-center justify-center rounded-xl text-center text-white"
                style={{ background: i === 0 ? C.ctaFill : C.ink }}
              >
                <span className="text-[9.5px] font-bold tracking-[0.14em] opacity-85">{d.day}</span>
                <span className="mt-0.5 text-[10.5px] font-semibold leading-tight">{d.time}</span>
              </span>
              <span className="min-w-0 py-0.5">
                <span className="block text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: C.goldInk }}>
                  {d.tag} · {d.date}
                </span>
                <span className="mt-0.5 block text-[14px] font-semibold leading-snug" style={{ color: C.ink }}>
                  {d.title}
                </span>
              </span>
            </li>
          ))}
        </ol>

        <ul className="mt-4 grid gap-2 text-[13px] sm:grid-cols-2" style={{ color: C.inkSoft }}>
          <li className="flex items-center gap-2">
            <VideoCamera weight="fill" className="h-4 w-4 shrink-0" style={{ color: C.goldDeep }} />
            One LIVE Zoom session each day
          </li>
          <li className="flex items-center gap-2">
            <Gift weight="fill" className="h-4 w-4 shrink-0" style={{ color: C.goldDeep }} />
            Four bonus resources worth {inr(BONUS_VALUE)}
          </li>
        </ul>

        {/* The price collapse. */}
        <div
          className="mt-5 flex items-center justify-between gap-3 rounded-2xl px-4 py-3.5 sm:mt-auto"
          style={{ background: C.goldWash, border: `1px solid ${C.lineStrong}` }}
        >
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: C.inkSoft }}>
              Masterclass value <s className="ml-1 decoration-2">{STRIKE_PRICE}</s>
            </p>
            <p className="mt-1 flex items-baseline gap-2">
              <span className="kz-lit font-display text-[38px] font-extrabold leading-none sm:text-[42px]">
                {PRICE}
              </span>
              <span className="text-[12px] font-semibold" style={{ color: C.inkSoft }}>
                today
              </span>
            </p>
            <p className="mt-1 text-[11px]" style={{ color: C.inkMuted }}>
              Total package value {inr(INCLUDED_TOTAL)}
            </p>
          </div>
          <span
            className="shrink-0 rounded-2xl px-3 py-2.5 text-center leading-none text-white"
            style={{ background: C.ctaFill, boxShadow: C.ctaGlow }}
          >
            <span className="block font-display text-[22px] font-extrabold">{DISCOUNT_PCT}%</span>
            <span className="mt-1 block text-[9.5px] font-bold uppercase tracking-[0.14em]">Off</span>
          </span>
        </div>
      </div>
    </div>
  );
}

/* ══ 2 · The trust ledger ══════════════════════════════════════════════════
   Four figures on a ruled row, lifted so the card straddles the seam that
   closes the hero: the join is a designed object rather than a hairline.

   The doc's section 03 trust strip, verbatim. */
const STATS = [
  {
    icon: Heart,
    big: `${WOMEN_GUIDED} Women`,
    small: 'Guided on their journeys',
    bed: C.coralBed,
    fg: C.coralInk,
  },
  {
    icon: Star,
    big: 'Expert-Led',
    small: 'Yoga & cycle awareness',
    bed: C.goldPale,
    fg: C.goldInk,
  },
  {
    icon: ShieldCheck,
    big: '100% Guarantee',
    small: 'See refund conditions',
    bed: C.navyBed,
    fg: C.emeraldInk,
  },
  {
    icon: VideoCamera,
    big: 'Live on Zoom',
    small: `${SESSION_SHORT.replace(/\s*IST$/, '')}, one session daily`,
    bed: C.goldPale,
    fg: C.goldInk,
  },
];

function TrustLedger() {
  return (
    <div className="relative z-10 mx-auto -mt-14 max-w-[1120px] px-5 md:px-8">
      <ul
        className="grid grid-cols-2 gap-x-5 gap-y-7 rounded-3xl px-6 py-8 sm:px-9 lg:grid-cols-4"
        style={{
          background: C.surface,
          border: `1px solid ${C.line}`,
          boxShadow: '0 26px 54px -30px rgba(31, 16, 20,0.32)',
        }}
      >
        {STATS.map(({ icon: Icon, big, small, bed, fg }, idx) => (
          /* lego-hover-icon: the whole row is the hover target so the hit area
             stays generous, but only the glyph moves. Lifting a figure drags
             the eye off the number, which is the one thing worth reading. */
          <li
            key={small}
            data-lego=""
            className="lego-hover-icon flex items-center gap-3.5"
            style={legoBrick(idx, 85)}
          >
            <span
              data-lego-stud=""
              className="lego-stud grid h-11 w-11 shrink-0 place-items-center rounded-full"
              style={{ ...legoBrick(idx, 85), background: bed }}
            >
              <Icon weight="fill" className="h-5 w-5" style={{ color: fg }} />
            </span>
            <span className="leading-tight">
              <span
                className="block font-display text-[18px] font-bold"
                style={{ color: C.ink }}
              >
                {big}
              </span>
              <span className="mt-0.5 block text-[12.5px] font-normal" style={{ color: C.inkMuted }}>
                {small}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
