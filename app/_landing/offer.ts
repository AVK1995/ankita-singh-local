/**
 * Every date, time, price and destination on the page comes through this file.
 * Nothing else declares one.
 */

/* Guard on a POSITIVE NUMBER, not on null. `??` does not catch an empty
   string, and .env.example ships every key blank, so an unfilled .env.local
   would give Number('') === 0: a page advertising ₹0 and an order for nothing,
   with nothing throwing. */
const RAW_PRICE = Number(process.env.NEXT_PUBLIC_PRICE_RUPEES);
export const PRICE_RUPEES = Number.isFinite(RAW_PRICE) && RAW_PRICE > 0 ? RAW_PRICE : 97;
export const PRICE = `₹${PRICE_RUPEES.toLocaleString('en-IN')}`;

/* The masterclass price anchor, struck through against PRICE on the hero card,
   the recap and the checkout. A FIXED anchor from the approved copy (₹2,699),
   no longer derived from PRICE: the 2-Day copy names it outright. */
const RAW_STRIKE = Number(process.env.NEXT_PUBLIC_STRIKE_PRICE_RUPEES);
export const STRIKE_PRICE_RUPEES =
  Number.isFinite(RAW_STRIKE) && RAW_STRIKE > PRICE_RUPEES ? RAW_STRIKE : 2699;
export const STRIKE_PRICE = `₹${STRIKE_PRICE_RUPEES.toLocaleString('en-IN')}`;
/* Rounded down, so the label never claims more off than the two prices give.
   ₹97 against ₹2,699 is 96.4%, so this reads 96, as the copy does. */
export const DISCOUNT_PCT = Math.floor(
  ((STRIKE_PRICE_RUPEES - PRICE_RUPEES) / STRIKE_PRICE_RUPEES) * 100,
);

/* ── THE TWO CHECKOUT ADD-ONS ────────────────────────────────────────────
   Same positive-number guard as PRICE_RUPEES, for the same reason. Each is its
   own env var so a price test never needs a deploy of code, and both are
   NEXT_PUBLIC because the checkout shows them AND the server charges them:
   one value, read on both sides, so the card and the order cannot disagree.

   ⚠️ The fallbacks are placeholders until the client confirms the prices. */
const RAW_RECORDING = Number(process.env.NEXT_PUBLIC_ADDON_RECORDING_RUPEES);
export const RECORDING_PRICE_RUPEES =
  Number.isFinite(RAW_RECORDING) && RAW_RECORDING > 0 ? RAW_RECORDING : 500;

const RAW_CALL = Number(process.env.NEXT_PUBLIC_ADDON_CALL_RUPEES);
export const CALL_PRICE_RUPEES = Number.isFinite(RAW_CALL) && RAW_CALL > 0 ? RAW_CALL : 1000;

/* Read inside sentences: "…shared in the recordings group {RECORDINGS_DELIVERY}". */
export const RECORDINGS_DELIVERY = 'after the Day 2 session';
export const CALL_BOOKING =
  'Book your call using the private scheduling link provided after payment, subject to available slots';
/* The booking link is PRIVATE: it is never posted in any group. It reaches the
   buyer on the confirmation page and in the confirmation WhatsApp + email. */
export const CALL_LINK_DELIVERY =
  'Your private booking link is on your confirmation page and sent to you on WhatsApp & email';

/* ── THE TWO DAYS ─────────────────────────────────────────────────────────
   ⚠️ REQUIRED BEFORE LAUNCH. Two env values, each holding BOTH days:

     NEXT_PUBLIC_DATES="12, Mar 2027, 13, Mar 2027"
     NEXT_PUBLIC_TIMES="12:00 PM – 2:00 PM, 12:00 PM – 2:00 PM"

   Dates: the "12, Mar 2027" style has a comma INSIDE each date, so the two are
   found by shape (day · month · year), not by splitting on commas. A "|" or
   ";" between them also works ("12 Mar 2027 | 13 Mar 2027").
   Times: Day 1's time first, then Day 2's, separated by a comma, "|" or ";".
   " IST" is added when a time does not already say it.

   Unset or unreadable, the placeholders render, which is loud on purpose. */
function splitPair(raw: string | undefined, shape?: RegExp): [string, string] | null {
  const s = (raw ?? '').trim();
  if (!s) return null;
  if (/[|;]/.test(s)) {
    const parts = s.split(/[|;]/).map((p) => p.trim()).filter(Boolean);
    return parts.length >= 2 ? [parts[0], parts[1]] : null;
  }
  if (shape) {
    const found = s.match(shape);
    if (found && found.length >= 2) return [found[0].trim(), found[1].trim()];
  }
  const parts = s.split(',').map((p) => p.trim()).filter(Boolean);
  return parts.length >= 2 ? [parts[0], parts[1]] : null;
}

/* "12, Mar 2027" → "12 Mar 2027": the comma reads as a typo once rendered. */
const tidyDate = (d: string) => d.replace(/^(\d{1,2})(st|nd|rd|th)?\s*,\s*/i, '$1$2 ');
const withIst = (t: string) => (/\bIST\b/i.test(t) ? t : `${t} IST`);

const DATE_SHAPE = /\d{1,2}(?:st|nd|rd|th)?,?\s*[A-Za-z]{3,9}\.?,?\s*\d{4}/g;
const datePair = splitPair(process.env.NEXT_PUBLIC_DATES, DATE_SHAPE);
const timePair = splitPair(process.env.NEXT_PUBLIC_TIMES);

export const DAY1_DATE = datePair ? tidyDate(datePair[0]) : '[DAY 1 DATE]';
export const DAY2_DATE = datePair ? tidyDate(datePair[1]) : '[DAY 2 DATE]';
/** "12 Mar 2027 and 13 Mar 2027" */
export const DATES = `${DAY1_DATE} and ${DAY2_DATE}`;
/** The first day, for "Starts …" lines. */
export const START_DATE = DAY1_DATE;

/* ONE live session per day. No batch choice anywhere. The approved copy runs
   both days at 12:00 PM – 2:00 PM IST, which is the fallback. */
export const DAY1_TIME = withIst(timePair?.[0] ?? '12:00 PM – 2:00 PM');
export const DAY2_TIME = withIst(timePair?.[1] ?? timePair?.[0] ?? '12:00 PM – 2:00 PM');
/** True when both days run at the same time, which the copy assumes. */
export const SAME_TIME = DAY1_TIME === DAY2_TIME;

/** "12:00 PM – 2:00 PM IST" → "12 PM" (the start, :00 dropped). */
const startOf = (t: string) =>
  t.split(/\s*[–—-]\s*/)[0].replace(/:00/, '').replace(/\s*IST/i, '').trim();
/** "12:00 PM – 2:00 PM IST" → "12–2 PM" when both ends share AM/PM. */
export function compactRange(t: string): string {
  const m = t.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)\s*[–—-]\s*(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);
  if (!m) return t.replace(/\s*IST/i, '');
  const a = m[1] + (m[2] && m[2] !== '00' ? `:${m[2]}` : '');
  const b = m[4] + (m[5] && m[5] !== '00' ? `:${m[5]}` : '');
  return m[3].toUpperCase() === m[6].toUpperCase()
    ? `${a}–${b} ${m[6].toUpperCase()}`
    : `${a} ${m[3].toUpperCase()}–${b} ${m[6].toUpperCase()}`;
}

/** Full time line: "12:00 PM – 2:00 PM IST", or both days when they differ. */
export const SESSION_TIMES_TZ = SAME_TIME
  ? DAY1_TIME
  : `Day 1: ${DAY1_TIME} · Day 2: ${DAY2_TIME}`;
export const SESSION_TIMES = SESSION_TIMES_TZ;
/** "12:00 PM – 2:00 PM IST on both days" / "Day 1: … · Day 2: …" */
export const TIME_LINE = SAME_TIME ? `${DAY1_TIME} on both days` : SESSION_TIMES_TZ;
/** The short form for tight spots: "12 PM IST", or "12 PM & 4 PM IST". */
export const SESSION_SHORT = SAME_TIME
  ? `${startOf(DAY1_TIME)} IST`
  : `${startOf(DAY1_TIME)} & ${startOf(DAY2_TIME)} IST`;
/** "12 Noon" when the session starts at 12 PM, which the copy calls it. */
export const START_SPOKEN = SAME_TIME
  ? startOf(DAY1_TIME).replace(/^12 PM$/i, '12 Noon')
  : SESSION_SHORT;

/**
 * ⚠️ UNVERIFIED, flagged in the approved copy itself: audience proof, awards
 * and seat limits must be checked before publication.
 */
export const WOMEN_GUIDED = '1,000+';

/**
 * ⚠️ REQUIRED BEFORE LAUNCH. The thank-you page is built around joining the
 * group as the single next step, so an empty value shows a dead button at the
 * moment the buyer has just paid.
 */
export const WHATSAPP_INVITE = process.env.NEXT_PUBLIC_WHATSAPP_INVITE ?? '';

/**
 * ⚠️ REQUIRED BEFORE LAUNCH, for the add-on thank-you pages. Same rule as the
 * invite above: an empty value renders the step's button disabled, with the
 * support address in its place.
 *
 * RECORDINGS_INVITE · the SEPARATE WhatsApp group where the session
 *   recordings are shared. Shown only to buyers of the recordings add-on.
 * CALL_BOOKING_URL · the calendar link (Calendly, Google booking page and so
 *   on) where a buyer of the 1-on-1 call picks a slot. Opens in a new tab.
 */
export const RECORDINGS_INVITE = process.env.NEXT_PUBLIC_WHATSAPP_RECORDINGS_INVITE ?? '';
export const CALL_BOOKING_URL = process.env.NEXT_PUBLIC_CALL_BOOKING_URL ?? '';

/** The next click is a payment. Every CTA on the page points here. */
export const CHECKOUT_HREF = '/checkout';

/* The source pair, with the price swapped for the discount. Used at the hero,
   the live-sessions card and the closing recap. */
export const CTA_LABEL = `Start Your 2-Day Reset · ${DISCOUNT_PCT}% Off Today`;
export const CTA_NOTE = '100% Money-Back Guarantee';

/** The two-options beat words its button differently from every other CTA. */
export const CTA_LABEL_ACTION = `Take Action · ${DISCOUNT_PCT}% Off Today`;

/** 2500 → "₹2,500". One formatter, so a value never renders two ways. */
export const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

/**
 * THE VALUE STACK, verbatim from COPY-SOURCE.md (2-Day masterclass copy, 13 Nov
 * 2026) in the order it lists.
 *
 * One source for the toolkit cards, the closing recap ledger and the
 * checkout's order summary (via app/checkout/included.ts). `value` is a
 * NUMBER, so the total is summed rather than typed: ₹2,699 + 4 × ₹497 =
 * ₹4,687, which matches the copy's stated package value.
 *
 * The `challenge` key is an internal id the toolkit maps to a glyph; it now
 * holds the masterclass.
 */
export type IncludedItem = {
  /** Stable key. The toolkit maps it to a glyph; nothing else depends on it. */
  key: 'challenge' | 'tracker' | 'checklist' | 'planner' | 'garbhsanskar';
  n: string;
  title: string;
  /** The short title the recap ledger and the checkout summary use. */
  short: string;
  value: number;
  body: string;
  tag: string;
  /** 'live' for the masterclass itself, 'instant' for the four bonuses. */
  access: 'live' | 'instant';
  /** The eyebrow over the card title ("MAIN MASTERCLASS", "BONUS"). */
  kind: string;
};

export const INCLUDED: IncludedItem[] = [
  {
    key: 'challenge',
    n: '01',
    kind: 'Main Masterclass',
    title: '2-Day LIVE Fertility Reset Masterclass',
    short: '2-Day LIVE Fertility Reset Masterclass',
    value: 2699,
    body: `Two expert-led live Zoom sessions combining cycle education, fertile-window awareness, the Period-Sync Yoga framework, guided yoga and a next-step roadmap. ${TIME_LINE}.`,
    tag: 'LIVE ACCESS · INCLUDED',
    access: 'live',
  },
  {
    key: 'tracker',
    n: '02',
    kind: 'Bonus',
    title: 'Your Cycle & Fertile Window Tracker',
    short: 'Cycle & Fertile Window Tracker',
    value: 497,
    body: 'Understand your menstrual cycle, estimate probable ovulation days and learn when your fertile window may fall.',
    tag: 'BONUS INCLUDED',
    access: 'instant',
  },
  {
    key: 'checklist',
    n: '03',
    kind: 'Bonus',
    title: 'Pre-Conception Do’s & Don’ts Checklist',
    short: 'Pre-Conception Do’s & Don’ts Checklist',
    value: 497,
    body: 'A checklist of everyday habits to focus on and common mistakes to avoid while trying to conceive.',
    tag: 'BONUS INCLUDED',
    access: 'instant',
  },
  {
    key: 'planner',
    n: '04',
    kind: 'Bonus',
    title: 'The Fertility-Friendly Daily Routine Planner',
    short: 'Fertility-Friendly Daily Routine Planner',
    value: 497,
    body: 'Stay consistent with movement, breathing, hydration, sleep and other supportive daily habits.',
    tag: 'BONUS INCLUDED',
    access: 'instant',
  },
  {
    key: 'garbhsanskar',
    n: '05',
    kind: 'Bonus',
    title: 'Garbh Sanskar Before Pregnancy: Introduction',
    short: 'Garbh Sanskar Before Pregnancy: Introduction',
    value: 497,
    body: 'A short introduction to optional traditional and mindfulness practices during the pre-conception phase.',
    tag: 'BONUS INCLUDED',
    access: 'instant',
  },
];

/** Summed, never typed: ₹4,687, the copy's stated package value. */
export const INCLUDED_TOTAL = INCLUDED.reduce((n, item) => n + item.value, 0);
