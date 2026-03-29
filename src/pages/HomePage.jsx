import { useCallback } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Eye,
  Mail,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Button } from '../components/ui/button.jsx';
import { Card, CardContent } from '../components/ui/card.jsx';

const trustPoints = [
  {
    icon: ShieldCheck,
    title: 'Not silent automation',
    description:
      'Important actions stay visible instead of happening quietly in the background.',
  },
  {
    icon: Sparkles,
    title: 'Not another noisy inbox',
    description:
      'The goal is to narrow attention to what deserves review first.',
  },
  {
    icon: Eye,
    title: 'Yes to visible decisions',
    description:
      'Context, reasons, and the next step stay on screen while you move faster.',
  },
];

const steps = [
  {
    title: 'Continue with Google',
    description:
      'Sign in and land directly in the review workspace.',
  },
  {
    title: 'Review suggestions and context',
    description:
      'See what deserves attention first and why it matters.',
  },
  {
    title: 'Act on important decisions',
    description:
      'Review first, then confirm important actions explicitly.',
  },
];

const heroChecklist = [
  'Google sign-in opens directly.',
  'A prioritized review workspace appears right after.',
  'Important actions stay explicit.',
];

const decisionProof = {
  label: 'One concrete decision path',
  title: 'From mixed inbox noise to one review-ready message',
  description:
    'Instead of scanning a mixed inbox and guessing what matters, the workspace surfaces one message, shows why it deserves attention, and keeps the next step visible.',
  email: 'Monthly seat invoice ready for review',
  why: 'Recurring billing, financial impact, and a message that should be reviewed before any action.',
  nextAction: 'Review first, then decide from context.',
};

const proofFlow = [
  {
    label: 'Inbox',
    value: 'Mixed signals',
  },
  {
    label: 'Workspace',
    value: 'Reason stays visible',
  },
  {
    label: 'Decision',
    value: 'Action stays explicit',
  },
];

const signalReasons = ['Recurring billing', 'Financial impact', 'Needs review before action'];

const previewRows = [
  {
    sender: 'billing@workspace.io',
    subject: 'Monthly seat invoice ready for review',
    note: 'Needs review first',
    tone: 'border-[#f97316]/40 bg-[#fff7ed]',
  },
  {
    sender: 'newsletter@productweekly.com',
    subject: 'Issue #142 with repeated promotions',
    note: 'Likely cleanup candidate',
    tone: 'border-[#bfdbfe] bg-[#eff6ff]',
  },
  {
    sender: 'updates@service.app',
    subject: 'Security summary and activity digest',
    note: 'Worth checking with context',
    tone: 'border-slate-200 bg-white',
  },
];

function TrustCard({ icon, title, description }) {
  const IconComponent = icon;

  return (
    <Card className="h-full border-slate-200/80 bg-white/95 shadow-[0_20px_60px_-40px_rgba(37,99,235,0.4)]">
      <CardContent className="space-y-4 p-6">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eff6ff] text-[#2563eb]">
          <IconComponent className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <h3 className="font-home-display text-lg font-semibold text-slate-900">{title}</h3>
          <p className="font-home-body text-base leading-7 text-slate-600">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function PreviewRow({ sender, subject, note, tone, className = '' }) {
  return (
    <div
      className={`flex flex-col gap-3 rounded-[1.25rem] border p-4 md:flex-row md:items-center md:justify-between ${tone} ${className}`}
    >
      <div className="min-w-0 space-y-1">
        <p className="font-home-display text-sm font-semibold text-slate-900">{sender}</p>
        <p className="font-home-body text-sm text-slate-700">{subject}</p>
      </div>
      <div className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600">
        <CheckCircle2 className="h-3.5 w-3.5 text-[#2563eb]" aria-hidden="true" />
        <span>{note}</span>
      </div>
    </div>
  );
}

export default function HomePage({ onStart }) {
  const handleScroll = useCallback((id) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.16),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(249,115,22,0.14),_transparent_22%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.96))] px-4 pb-20 pt-8 md:pb-28 md:pt-12">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#2563eb]/50 to-transparent" />
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2563eb] text-white shadow-[0_20px_40px_-24px_rgba(37,99,235,0.9)]">
                <Mail className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="font-home-display text-base font-semibold text-slate-950">Email Cleaner</p>
                <p className="font-home-body text-sm text-slate-500">
                  Decision support for email.
                </p>
              </div>
            </div>

            <Button
              onClick={onStart}
              className="hidden h-11 rounded-full bg-[#f97316] px-6 text-sm font-semibold text-white shadow-[0_16px_40px_-24px_rgba(249,115,22,0.95)] hover:bg-[#ea6a12] md:inline-flex"
            >
              Continue with Google
            </Button>
          </div>

          <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#bfdbfe] bg-white/90 px-4 py-2 text-sm text-[#1d4ed8] shadow-sm">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                <span className="font-home-body font-semibold">
                  Google sign-in, then a review-first workspace
                </span>
              </div>

              <div className="space-y-6">
                <h1 className="font-home-display text-4xl font-semibold leading-tight tracking-[-0.03em] text-slate-950 md:text-6xl">
                  Review important email before anything happens
                </h1>
                <p className="font-home-body max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
                  Open Google and land in a workspace that surfaces what needs attention,
                  shows why it matters, and keeps the next action visible.
                </p>
                <p className="font-home-display text-base font-semibold text-slate-950">
                  Not inbox automation. Decision support for your inbox.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  onClick={onStart}
                  size="lg"
                  className="h-12 rounded-full bg-[#f97316] px-7 text-base font-semibold text-white shadow-[0_18px_40px_-24px_rgba(249,115,22,1)] hover:bg-[#ea6a12]"
                >
                  <span>Continue with Google</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handleScroll('how-it-works')}
                  className="h-12 rounded-full border-slate-300 bg-white/90 px-7 text-base text-slate-700 hover:bg-white"
                >
                  See how review works
                </Button>
              </div>

              <p className="font-home-body text-sm text-slate-500">
                Google sign-in opens directly. The review workspace comes right after sign-in.
              </p>

              <div className="rounded-[1.5rem] border border-white/80 bg-white/80 p-5 shadow-[0_20px_60px_-42px_rgba(15,23,42,0.55)] backdrop-blur">
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <p className="font-home-display text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Product truth
                    </p>
                    <p className="font-home-body text-base leading-7 text-slate-700">
                      Faster review without hidden actions.
                    </p>
                  </div>
                  <div className="hidden items-center gap-2 rounded-full bg-[#eff6ff] px-3 py-2 text-sm font-semibold text-[#1d4ed8] sm:inline-flex">
                    <Clock3 className="h-4 w-4" aria-hidden="true" />
                    <span>No hidden cleanup flow</span>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {heroChecklist.map((item) => (
                    <div
                      key={item}
                      className="rounded-[1.25rem] border border-slate-200 bg-slate-50/90 px-4 py-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#eff6ff] text-[#2563eb]">
                          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                        </div>
                        <p className="font-home-body text-sm leading-6 text-slate-700">{item}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-x-6 top-8 h-32 rounded-full bg-[#2563eb]/15 blur-3xl" />
              <div className="absolute -left-4 top-20 hidden rounded-[1.25rem] border border-white/80 bg-white/95 px-4 py-3 shadow-[0_22px_50px_-32px_rgba(37,99,235,0.6)] lg:block">
                <p className="font-home-display text-xs font-semibold uppercase tracking-[0.2em] text-[#1d4ed8]">
                  Review-first
                </p>
                <p className="mt-1 font-home-body text-sm text-slate-600">
                  Context before action
                </p>
              </div>
              <Card className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 shadow-[0_30px_80px_-40px_rgba(37,99,235,0.42)] backdrop-blur">
                <div className="border-b border-slate-200/80 bg-slate-950 px-6 py-4 text-white">
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <p className="font-home-display text-sm font-semibold">Public preview</p>
                      <p className="font-home-body text-sm text-slate-300">
                        A review-first workspace after Google sign-in
                      </p>
                    </div>
                    <div className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100">
                      Visible decisions
                    </div>
                  </div>
                </div>

                <CardContent className="space-y-5 p-6">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4">
                      <p className="font-home-display text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        After sign-in
                      </p>
                      <p className="mt-2 font-home-display text-lg font-semibold text-slate-950">
                        One review queue
                      </p>
                    </div>
                    <div className="rounded-[1.25rem] border border-[#bfdbfe] bg-[#eff6ff] px-4 py-4">
                      <p className="font-home-display text-xs font-semibold uppercase tracking-[0.18em] text-[#1d4ed8]">
                        Current signal
                      </p>
                      <p className="mt-2 font-home-display text-lg font-semibold text-slate-950">
                        Billing deserves review
                      </p>
                    </div>
                    <div className="rounded-[1.25rem] border border-[#fed7aa] bg-[#fff7ed] px-4 py-4">
                      <p className="font-home-display text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Next step
                      </p>
                      <p className="mt-2 font-home-display text-lg font-semibold text-slate-950">
                        Review before action
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-slate-200 bg-[linear-gradient(135deg,_rgba(37,99,235,0.08),_rgba(249,115,22,0.1))] p-5">
                    <p className="font-home-display text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Product preview
                    </p>
                    <p className="mt-3 font-home-display text-2xl font-semibold text-slate-950">
                      The reason stays visible while you decide
                    </p>
                    <p className="mt-3 font-home-body text-sm leading-6 text-slate-600">
                      The workspace does not just surface a message. It shows why this one
                      deserves attention and keeps the decision explicit.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {previewRows.map((row, index) => (
                      <PreviewRow
                        key={row.sender}
                        {...row}
                        className={index === 2 ? 'hidden md:flex' : ''}
                      />
                    ))}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                    <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
                      <p className="font-home-display text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Why this one was surfaced
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {signalReasons.map((reason) => (
                          <span
                            key={reason}
                            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700"
                          >
                            {reason}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-[1.25rem] border border-[#fed7aa] bg-[#fff7ed] p-4">
                      <p className="font-home-display text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Visible next action
                      </p>
                      <p className="mt-3 font-home-display text-base font-semibold text-slate-950">
                        Review invoice details before confirming anything.
                      </p>
                      <p className="mt-2 font-home-body text-sm leading-6 text-slate-600">
                        The action stays explicit until you choose it.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:py-20">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-45px_rgba(15,23,42,0.55)] md:p-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
            <div className="space-y-4">
              <p className="font-home-display text-sm font-semibold uppercase tracking-[0.22em] text-[#1d4ed8]">
                What changes on screen
              </p>
              <h2 className="font-home-display text-3xl font-semibold tracking-[-0.03em] text-slate-950 md:text-4xl">
                {decisionProof.title}
              </h2>
              <p className="font-home-body max-w-xl text-lg leading-8 text-slate-600">
                {decisionProof.description}
              </p>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[1.5rem] border border-[#bfdbfe] bg-[#eff6ff] p-5">
                <p className="font-home-display text-sm font-semibold uppercase tracking-[0.18em] text-[#1d4ed8]">
                  {decisionProof.label}
                </p>
                <p className="mt-3 font-home-display text-2xl font-semibold text-slate-950">
                  {decisionProof.email}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {proofFlow.map((step) => (
                  <div
                    key={step.label}
                    className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4"
                  >
                    <p className="font-home-display text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                      {step.label}
                    </p>
                    <p className="mt-3 font-home-display text-lg font-semibold text-slate-950">
                      {step.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                  <p className="font-home-display text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Why it matters
                  </p>
                  <p className="mt-3 font-home-body text-base leading-7 text-slate-700">
                    {decisionProof.why}
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-[#fed7aa] bg-[#fff7ed] p-5">
                  <p className="font-home-display text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Visible next step
                  </p>
                  <p className="mt-3 font-home-body text-base leading-7 text-slate-700">
                    {decisionProof.nextAction}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="trust-principles" className="px-4 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl space-y-4">
            <p className="font-home-display text-sm font-semibold uppercase tracking-[0.22em] text-[#1d4ed8]">
              Why this can earn trust
            </p>
            <h2 className="font-home-display text-3xl font-semibold tracking-[-0.03em] text-slate-950 md:text-4xl">
              Built to surface the signal, not hide the decision
            </h2>
            <p className="font-home-body text-lg leading-8 text-slate-600">
              Most inbox tools promise automation. Email Cleaner keeps the message, the reason,
              and the decision visible.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {trustPoints.map((point) => (
              <TrustCard key={point.title} {...point} />
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-y border-slate-200/80 bg-white px-4 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start">
            <div className="space-y-5">
              <p className="font-home-display text-sm font-semibold uppercase tracking-[0.22em] text-[#1d4ed8]">
                How it works
              </p>
              <h2 className="font-home-display text-3xl font-semibold tracking-[-0.03em] text-slate-950 md:text-4xl">
                What happens after you click Google
              </h2>
              <p className="font-home-body text-lg leading-8 text-slate-600">
                The path is short: sign in, land in the review workspace, and decide from context.
              </p>
            </div>

            <div className="grid gap-5">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-[1.5rem] border border-slate-200 bg-slate-50/90 p-6 shadow-[0_18px_40px_-36px_rgba(15,23,42,0.6)]"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2563eb] text-sm font-semibold text-white">
                      {index + 1}
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-home-display text-xl font-semibold text-slate-950">
                        {step.title}
                      </h3>
                      <p className="font-home-body text-base leading-7 text-slate-600">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 md:py-24">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,_rgba(37,99,235,0.08),_rgba(249,115,22,0.1))] p-8 text-center shadow-[0_30px_80px_-50px_rgba(15,23,42,0.65)] md:p-12">
          <p className="font-home-display text-sm font-semibold uppercase tracking-[0.22em] text-[#1d4ed8]">
            Ready to review with more control?
          </p>
          <h2 className="mt-4 font-home-display text-3xl font-semibold tracking-[-0.03em] text-slate-950 md:text-4xl">
            Start with the message that deserves attention
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-home-body text-lg leading-8 text-slate-600">
            Open Google sign-in and move directly into a review-first workspace where the
            reason and the next action stay visible.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              onClick={onStart}
              size="lg"
              className="h-12 rounded-full bg-[#f97316] px-7 text-base font-semibold text-white shadow-[0_18px_40px_-24px_rgba(249,115,22,1)] hover:bg-[#ea6a12]"
            >
              <span>Continue with Google</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleScroll('how-it-works')}
              className="h-12 rounded-full border-slate-300 bg-white/90 px-7 text-base text-slate-700 hover:bg-white"
            >
              Review the flow first
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200/80 bg-white px-4 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-3 text-slate-500">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#2563eb] text-white">
              <Mail className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <p className="font-home-display text-sm font-semibold text-slate-900">
                Email Cleaner
              </p>
              <p className="font-home-body text-sm text-slate-500">
                Decision support for email.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6 font-home-body text-sm text-slate-500">
            <a href="#trust-principles" className="transition-colors hover:text-slate-900">
              Why it's different
            </a>
            <a href="#how-it-works" className="transition-colors hover:text-slate-900">
              How it works
            </a>
            <a href="/login" className="transition-colors hover:text-slate-900">
              Sign in
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
