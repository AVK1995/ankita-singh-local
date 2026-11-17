import type { Metadata } from 'next';
import Link from 'next/link';

import LegalPageLayout from '@/components/LegalPageLayout';

import { LEGAL, LEGAL_STRUCTURE_KNOWN } from '../_landing/legal';
import { DATES, PRICE, SESSION_TIMES_TZ } from '../_landing/offer';

export const metadata: Metadata = {
  title: `Terms and Conditions | ${LEGAL.brand}`,
  description: `The terms that apply when you join the ${LEGAL.product}.`,
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Terms and Conditions"
      effectiveDate={LEGAL.effectiveDate}
      intro={`These terms apply when you buy or take part in the ${LEGAL.product}. By completing checkout you agree to them.`}
    >
      {/* The legal structure is NAMED ONLY WHEN IT IS KNOWN. Asserting one is
          not a detail: it decides who the counterparty is, who is liable, and
          which name has to match the PAN and the gateway's merchant record.
          LEGAL.structure is empty, so this sentence runs without the phrase,
          which asserts nothing untrue. Fill the field and the sentence
          reshapes itself around it. */}
      <h2>1. Who we are</h2>
      <p>
        The programme is provided by {LEGAL.entity}
        {LEGAL_STRUCTURE_KNOWN ? `, ${LEGAL.structure},` : ','} trading as{' '}
        {LEGAL.tradeName}, {LEGAL.address}.
      </p>

      <h2>2. What you are buying</h2>
      <p>
        Access to the {LEGAL.product}: live expert-led sessions delivered on
        Zoom across two days, {DATES}, at the advertised times ({SESSION_TIMES_TZ}),
        together with the four bonus resources listed at checkout. The
        registration fee is {PRICE}. Optional add-ons are charged separately and
        only if selected.
      </p>

      <h2>3. Sessions and scheduling</h2>
      <ul>
        <li>
          Sessions run live at the advertised times. Session recordings are not
          part of the registration fee. They are available only as a separately
          priced add-on chosen at checkout, and only to participants who
          purchased that add-on. Purchased recordings of both days are shared
          through a private WhatsApp group after the Day 2 session.
        </li>
        <li>
          Participants who purchased the private 1-on-1 call add-on can book
          their slot at any time, subject to the slots available, through a
          private booking link. The link is shown on the confirmation page
          after payment and sent to the participant by WhatsApp and email. It
          is personal to the participant and is not shared in any group.
        </li>
        <li>
          We may move a session for reasons outside our control. Registered
          participants will be told as early as possible.
        </li>
        <li>You are responsible for your own internet access and device.</li>
      </ul>

      {/* The subject list is THIS programme's, taken from the 2-Day curriculum
          in COPY-SOURCE.md: cycle and fertile-window education, nutrition and
          daily habits (Day 1); breathing, hip and pelvic mobility, core and
          pelvic-floor awareness (Day 2). A health disclaimer that describes the
          wrong programme protects nobody. */}
      <h2>4. Health disclaimer</h2>
      <p>
        This programme provides general wellness education covering menstrual
        cycle and fertile-window awareness, nutrition and daily habits,
        breathing and relaxation, gentle hip and pelvic mobility, and core and
        pelvic-floor awareness.{' '}
        <strong>It is not medical advice</strong>, it does not diagnose or
        treat any condition, and it is not a substitute for care from your
        doctor, gynaecologist or fertility specialist.
      </p>
      <p>
        Consult a qualified healthcare professional before starting,
        particularly if you are pregnant or may be pregnant, are undergoing
        fertility treatment, are recovering from surgery or injury, are taking
        prescribed medication, or are living with a heart, joint, blood
        pressure, thyroid or hormonal condition. Stop immediately and seek
        medical help if you feel pain, dizziness or breathlessness. You take
        part at your own risk.
      </p>

      <h2>5. Your access</h2>
      <ul>
        <li>Access is personal to you and must not be shared or resold.</li>
        <li>
          Recording, redistributing or republishing any session or guide is not
          permitted.
        </li>
        <li>
          We may withdraw access without refund for abusive conduct toward staff
          or other participants.
        </li>
      </ul>

      <h2>6. Intellectual property</h2>
      <p>
        All session content, resources, recordings and materials remain the
        property of {LEGAL.entity}. You get a personal, non-transferable
        licence to use them for your own benefit.
      </p>

      <h2>7. Results</h2>
      <p>
        We describe what participants commonly notice. We do not promise a
        specific outcome, and results vary with individual circumstances,
        consistency and health status.
      </p>

      <h2>8. Payment and refunds</h2>
      <p>
        Payment is taken at checkout through our payment processor. Refunds are
        governed by our{' '}
        <Link href="/refund-policy">Refund Policy</Link>.
      </p>

      <h2>9. Liability</h2>
      <p>
        To the extent permitted by law, our total liability in connection with
        the programme is limited to the amount you paid for it. Nothing in these
        terms limits liability that cannot lawfully be limited.
      </p>

      <h2>10. Governing law</h2>
      <p>
        These terms are governed by the laws of India, and the courts of{' '}
        {LEGAL.jurisdiction} have exclusive jurisdiction.
      </p>

      <h2>11. Contact</h2>
      <p>
        {LEGAL.entity}, trading as {LEGAL.tradeName}, {LEGAL.address}.
        <br />
        <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>
        {' · '}
        <a href={`tel:${LEGAL.phoneHref}`}>{LEGAL.phone}</a>
      </p>
    </LegalPageLayout>
  );
}
