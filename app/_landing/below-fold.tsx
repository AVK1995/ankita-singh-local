'use client';

/**
 * Everything below the hero:
 *
 *   7  Real Fertility Journeys ................. ./proof   ← HOISTED, see below
 *   3  What Will Change After This 2-Day Reset .. this file
 *   4  Your 2-Day Plan ......................... this file  ← the signature beat
 *   5  One Live Session Per Day ................ this file
 *   6  Does this sound like you? ............... ./proof
 *   8  GET INSTANT ACCESS TO ................... ./toolkit
 *   9  Meet Ankita Singh ....................... ./close
 *  10  What Most Women Miss .................... ./close
 *  11  THE RESULTS ............................. ./close
 *  12  Now You Have Two Options ................ ./close
 *  13  Recap of Everything You'll Get .......... ./close  ← the premium peak
 *  14  Disclaimer + colophon ................... ./close
 *
 * COPY IS VERBATIM. Where the source wraps a sentence across several lines it
 * is joined back into one string; no wording, ordering or punctuation is
 * changed, and nothing is added.
 */
import {
  ArrowRight,
  ArrowsClockwise,
  Barbell,
  BowlFood,
  CalendarBlank,
  Check,
  Clock,
  Compass,
  Heart,
  Lightning,
  PersonSimpleTaiChi,
} from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import Close from './close';
import { legoBrick, legoDelay } from './lego-style';
import { domAnimation, LazyMotion } from './motion-lite';
import {
  CHECKOUT_HREF,
  compactRange,
  CTA_NOTE,
  DAY1_TIME,
  DAY2_TIME,
  START_SPOKEN,
} from './offer';
import { Recognition, Testimonials } from './proof';
import { C, SectionHeading } from './shared';
import Toolkit from './toolkit';

/* Three beds, rotated. Not seven: the palette has three colours, and a card
   grid that cycles a rainbow reads as decoration rather than as a set. Every
   bed here is PALE on a LIGHT band, so each glyph takes the deep step. */
const BEDS = [
  { bed: C.goldPale, fg: C.goldDeep },
  { bed: C.coralBed, fg: C.goldDeep },
  { bed: C.navyBed, fg: C.goldDeep },
];

/* ══ 3 · What Will Change After This 5-Day Reset ══════════════════════════
   Eight parallel capabilities, each with a title and a body. A set, not a
   sequence, so it is a grid of equal pieces and the order carries no meaning
   the reader has to follow. */
const EXPERIENCE = [
  {
    icon: ArrowsClockwise,
    title: 'SYNC',
    body: 'Know what to focus on during your period, fertile window and waiting phase.',
  },
  {
    icon: CalendarBlank,
    title: 'TRACK',
    body: 'Learn to estimate your fertile window and probable ovulation days, not just your period date.',
  },
  {
    icon: PersonSimpleTaiChi,
    title: 'OPEN',
    body: 'Release everyday hip and pelvic stiffness through gentle mobility practices.',
  },
  {
    icon: Barbell,
    title: 'STRENGTHEN',
    body: 'Reconnect your core and pelvic floor for strength, stability and body awareness.',
  },
  {
    icon: Heart,
    title: 'CALM',
    body: 'Let go of some of the stress after months of trying with relaxation and breathing.',
  },
  {
    icon: BowlFood,
    title: 'NOURISH',
    body: 'Know which everyday nutrition habits support reproductive health, without crash diets.',
  },
  {
    icon: Lightning,
    title: 'ENERGIZE',
    body: 'Feel lighter, more flexible and more energetic with manageable movement.',
  },
  {
    icon: Compass,
    title: 'PLAN',
    body: 'Leave with a clear starting plan for your next attempt to get pregnant.',
  },
];

function Experience() {
  return (
    <section className="px-4 py-12 sm:py-20 lg:py-24" style={{ background: C.canvasAlt }}>
      <SectionHeading
        eyebrow="Your fertility reset"
        sub="Most women just try harder every month. This masterclass shows you what to focus on during each phase of your cycle, so your next attempt to get pregnant is built on a plan, not a guess."
      >
        What Will Change After This{' '}
        <span style={{ color: C.goldDeep }}>2-Day Reset?</span>
      </SectionHeading>

      {/* Eight short cards: two rows of four on desktop. */}
      <ul className="mx-auto mt-14 grid max-w-[1120px] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {EXPERIENCE.map(({ icon: Icon, title, body }, idx) => {
          const skin = BEDS[idx % BEDS.length];
          return (
            <li
              key={title}
              data-lego=""
              className="lego-hover flex flex-col rounded-3xl p-7"
              style={{
                ...legoBrick(idx),
                /* No seat shadow, because this beat sits on `canvasAlt`, which
                   is 4% darker than the card: the hairline alone draws the
                   edge. The Schedule below is on `canvas`, where white on
                   near-white needs lifting, and it carries one. A 3px rule
                   along the top ties the card to its bed without letting
                   colour take a large area. */
                background: C.surface,
                border: `1px solid ${C.line}`,
                borderTop: `3px solid ${skin.bed}`,
              }}
            >
              <span
                data-lego-stud=""
                className="lego-stud grid h-12 w-12 place-items-center rounded-2xl"
                style={{ ...legoBrick(idx), background: skin.bed }}
              >
                <Icon weight="duotone" className="h-6 w-6" style={{ color: skin.fg }} />
              </span>
              <h3
                className="mt-5 font-display text-[19px] font-bold leading-snug tracking-[0.06em]"
                style={{ color: C.ink }}
              >
                {title}
              </h3>
              <p className="mt-2.5 text-[14.5px] leading-relaxed" style={{ color: C.inkSoft }}>
                {body}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ══ 4 · Your 2-Day Plan ═══════════════════════════════════════════════════
   The signature beat, and the page's ONE heavy motion moment. The two days are
   a genuine sequence, so it is a spine with a filling rail: the rail's
   progress is a single CSS variable written by a rAF-throttled scroll handler,
   and nodes ignite as the fill reaches them. */
const DAYS = [
  {
    n: 'DAY 01',
    time: compactRange(DAY1_TIME),
    kicker: 'Theory & Clarity',
    title: 'Understand Your Fertility & Know Where to Start',
    body: 'The 2-hour Fertility Reset Blueprint. After months of trying, finally understand how your cycle, probable ovulation and lifestyle routines fit together.',
    points: [
      'How your menstrual cycle and fertile window work',
      'Fertile-window awareness, including irregular cycles',
      'What PCOS/PCOD, thyroid concerns and other fertility challenges can mean for your starting point',
      'Why your yoga approach may change with your cycle',
      'Nutrition, sleep, stress management and daily habits',
      'Build your Fertility Reset Starter Map and ask questions',
    ],
    outcome:
      'You’ll better understand your cycle and know what to focus on before your next attempt.',
  },
  {
    n: 'DAY 02',
    time: compactRange(DAY2_TIME),
    kicker: 'Yoga & Next Steps',
    title: 'Experience Period-Sync Yoga & Know Your Next Steps',
    body: 'Move from understanding the theory to experiencing a guided yoga practice from home, followed by guidance on how to continue.',
    points: [
      'Gentle breathing and relaxation with Ankita',
      'Beginner-friendly hip and pelvic mobility movements',
      'Simple core and pelvic-floor awareness practices',
      'How to adapt movement based on your cycle and comfort',
      'Daily routine, next steps and participant questions',
      'Introduction to Ankita’s complete guided fertility yoga program',
    ],
    outcome:
      'You’ll have experienced the routine and understand options for continuing with structured guidance.',
  },
];

/**
 * Scroll-linked progress for the spine.
 *
 * Writes `--tl-p` (0 → 1) straight onto the <ol> node, so the rail fills
 * without React re-rendering once per frame. The only React state is `active`,
 * which changes five times per pass at most.
 *
 * The read line sits at 62% of the viewport height rather than the middle: a
 * day should light as it arrives at the comfortable reading position, not once
 * it has already gone past.
 */
function useSpineProgress(count: number) {
  const olRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const ol = olRef.current;
    if (!ol) return;

    // Reduced motion: show the finished state and never listen to scroll.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      ol.style.setProperty('--tl-p', '1');
      setActive(count - 1);
      return;
    }

    let raf = 0;
    const measure = () => {
      raf = 0;
      const box = ol.getBoundingClientRect();
      if (!box.height) return;

      const line = window.innerHeight * 0.62;
      const p = Math.min(1, Math.max(0, (line - box.top) / box.height));
      ol.style.setProperty('--tl-p', p.toFixed(4));

      /* offsetTop is no use here: each node's offsetParent is its own <li>,
         not the list. Both rects are current, so the difference is the node's
         position within the rail. */
      const travelled = p * box.height;
      let last = -1;
      ol.querySelectorAll<HTMLElement>('[data-tl-node]').forEach((node, i) => {
        const r = node.getBoundingClientRect();
        if (travelled >= r.top + r.height / 2 - box.top) last = i;
      });
      setActive(last);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [count]);

  return { olRef, active };
}

function Schedule() {
  const { olRef, active } = useSpineProgress(DAYS.length);

  return (
    <section className="px-4 py-12 sm:py-20 lg:py-24" style={{ background: C.canvas }}>
      <SectionHeading
        eyebrow="The complete 4-hour experience"
        sub="On Day 1, understand your body and the Period-Sync Yoga approach. On Day 2, experience gentle live yoga, create a practical next-step plan and learn about ongoing support."
      >
        Your <span style={{ color: C.goldDeep }}>2-Day Plan</span> Before Your Next Pregnancy
        Attempt
      </SectionHeading>

      {/* Alternating spine. The rail is centred on desktop and slides to the
          left edge on mobile, where a zig-zag has no room. */}
      <ol ref={olRef} className="relative mx-auto mt-14 max-w-[920px]">
        <span aria-hidden className="tl-rail">
          <span className="tl-fill" />
        </span>

        {DAYS.map((d, i) => {
          const left = i % 2 === 0; // card in the left column on desktop
          return (
            <li
              key={d.n}
              className={`relative mb-6 pl-14 sm:mb-9 sm:w-1/2 sm:pl-0 ${
                left ? 'sm:pr-12' : 'sm:ml-auto sm:pl-12'
              }`}
            >
              {/* Positioning lives on the outer span and the snap animation on
                  the inner one: one element cannot both hold a centring
                  translate and keyframe its transform. */}
              <span
                data-tl-node
                className={`tl-node ${left ? 'tl-node-right' : 'tl-node-left'} ${
                  i <= active ? 'is-on' : ''
                }`}
              >
                <span aria-hidden className="tl-node-ring" />
                <span className="tl-node-inner">{i + 1}</span>
              </span>

              {/* data-lego-loop, not data-lego: this is the ONE run on the page
                  that replays on every scroll pass, because the spine is meant
                  to be re-read. */}
              <div
                data-lego-loop="x"
                className="lego-hover rounded-2xl p-6"
                style={{
                  ...legoDelay(0),
                  ['--lego-from' as string]: left ? '26px' : '-26px',
                  border: `1px solid ${i <= active ? C.lineStrong : C.line}`,
                  /* The day card is a CARD: it lifts off the band and the
                     border brightens as the rail reaches it. On `canvas` the
                     fill is 1.5% off the ground, so the shadow is what seats
                     it; without one the lit node hangs beside a hole. */
                  background: C.surface,
                  boxShadow: '0 18px 44px -26px rgba(31, 16, 20,0.30)',
                }}
              >
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em]"
                  style={{ background: C.coralBed, color: C.coralInk }}
                >
                  <CalendarBlank weight="bold" className="lego-stud h-3 w-3" />
                  {d.n} · {d.kicker} · {d.time} IST
                </span>
                <h3
                  className="mt-3.5 font-display text-[20px] font-bold leading-snug"
                  style={{ color: C.ink }}
                >
                  {d.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed" style={{ color: C.inkSoft }}>
                  {d.body}
                </p>
                <ul className="mt-3.5 space-y-1.5">
                  {d.points.map((pt) => (
                    <li
                      key={pt}
                      className="flex items-start gap-2 text-[13.5px] leading-snug"
                      style={{ color: C.inkSoft }}
                    >
                      <Check
                        weight="bold"
                        aria-hidden
                        className="mt-[3px] h-3.5 w-3.5 shrink-0"
                        style={{ color: C.emeraldInk }}
                      />
                      {pt}
                    </li>
                  ))}
                </ul>
                <p
                  className="mt-4 rounded-xl px-3.5 py-2.5 text-[13px] leading-snug"
                  style={{ background: C.goldWash, color: C.ink }}
                >
                  <strong>By the end of {d.n === 'DAY 01' ? 'Day 1' : 'Day 2'}:</strong>{' '}
                  {d.outcome}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/* ══ 5 · One Live Session Per Day ══════════════════════════════════════════
   A CTA band, not a section with a structure: one timing and a click.

   This is one of the page's two CONTAINED DARK OBJECTS (with the Option 2
   card), which is the only way dark is allowed below the hero: as an object
   inside a light band, never as a band. On a light ground a dark object is
   seated by a SHADOW, and the accent bloom stays low, because a bloom is the
   dark-page device and at full strength on the canvas it reads as a spotlight
   someone left switched on. */
function SessionsBand() {
  return (
    <section className="px-4 py-14" style={{ background: C.canvasAlt }}>
      <div
        className="mx-auto max-w-[920px] rounded-[28px] px-6 py-12 text-center sm:px-12"
        style={{
          background: `radial-gradient(ellipse 92% 62% at 50% 0%, rgba(252, 228, 234,0.14), transparent 64%), ${C.navyDeep}`,
          border: '1px solid rgba(252, 228, 234,0.20)',
          boxShadow:
            '0 0 46px -24px rgba(248, 113, 134,0.22), 0 30px 60px -34px rgba(31, 16, 20,0.42)',
        }}
      >
        <span
          data-lego=""
          className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.2em]"
          style={{ background: 'rgba(252, 228, 234,0.16)', color: C.gold }}
        >
          <Clock weight="bold" className="h-3 w-3" />
          One Live Session Per Day
        </span>

        <h2
          className="mx-auto mt-6 max-w-[620px] font-display text-[clamp(26px,3.8vw,38px)] font-bold leading-[1.16]"
          style={{ color: C.onDark }}
        >
          One Live Session Per Day. <span style={{ color: C.gold }}>At {START_SPOKEN}.</span>
        </h2>
        <p className="mt-3 text-[15.5px]" style={{ color: C.onDarkMute }}>
          Day 1: {DAY1_TIME} · Day 2: {DAY2_TIME} · Live on Zoom
        </p>

        <div className="mx-auto mt-8 flex max-w-[430px] flex-col items-center">
          <Link
            href={CHECKOUT_HREF}
            data-cta
            className="lego-press cta-shimmer group inline-flex min-h-[56px] w-full items-center justify-center gap-2.5 rounded-full px-7 font-body text-[15px] font-bold"
            style={{
              background: '#FFFFFF',
              color: C.goldInk,
              boxShadow: '0 14px 30px -14px rgba(31, 16, 20,0.45)',
              ['--shimmer' as string]: 'rgba(242, 76, 105,0.25)',
            }}
          >
            <span className="inline-flex items-center gap-2.5">
              Reserve My Seat
              <ArrowRight
                weight="bold"
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </span>
          </Link>
          <p className="mt-3.5 text-[13.5px] font-medium" style={{ color: C.onDarkMute }}>
            {CTA_NOTE}
          </p>
        </div>
      </div>
    </section>
  );
}

export default function BelowFold() {
  /* LazyMotion mounts the single IntersectionObserver that adds `bw-in` to
     revealed elements. Without it every .bw-reveal-* stays at opacity 0 once
     .bw-js is on the document. */
  return (
    <LazyMotion features={domAnimation}>
      {/* The clips are the FIRST child on purpose: page.tsx renders this
          component straight after <Hero />, so first here is "directly below
          the hero" without pulling the block out of the deferred chunk and
          onto the critical path. */}
      <Testimonials />
      <Experience />
      <Schedule />
      <SessionsBand />
      <Recognition />
      <Toolkit />
      <Close />
    </LazyMotion>
  );
}
