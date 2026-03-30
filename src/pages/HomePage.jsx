import {
  ArrowRight,
  CheckCircle2,
  Eye,
  Mail,
  MessageSquareText,
  Shield,
  Sparkles,
} from 'lucide-react';
import { Button } from '../components/ui/button.jsx';
import { Card, CardContent } from '../components/ui/card.jsx';

const trustSignals = [
  {
    icon: Eye,
    title: 'Review before action',
    body: 'Open the email, inspect the evidence, and decide with context instead of guessing from a subject line.',
  },
  {
    icon: Shield,
    title: 'Sensitive actions stay explicit',
    body: 'Nothing important is hidden behind blind automation. The product keeps critical confirmation steps visible.',
  },
  {
    icon: Sparkles,
    title: 'Suggestions first, inbox second',
    body: 'The workspace starts with the next decisions that matter, then lets you drop into manual review only when needed.',
  },
];

const workflowSteps = [
  'Connect your workspace with Google.',
  'Review the suggestions with visible context and confidence.',
  'Confirm, ignore, or inspect the original email before acting.',
];

const previewRows = [
  {
    sender: 'payments@northstar.io',
    subject: 'Invoice 8821 pending review',
    status: 'High priority',
    tone: 'bg-amber-100 text-amber-900',
  },
  {
    sender: 'ops@warehouse.mx',
    subject: 'Receipt requires manual follow-up',
    status: 'Needs receipt check',
    tone: 'bg-sky-100 text-sky-900',
  },
  {
    sender: 'support@vendor.example',
    subject: 'General update, low urgency',
    status: 'Manual inbox context',
    tone: 'bg-emerald-100 text-emerald-900',
  },
];

function SignalCard({ icon, title, body }) {
  const Icon = icon;

  return (
    <Card className="h-full rounded-[1.75rem] border border-[#d7e6e2] bg-white/88 shadow-[0_24px_70px_-52px_rgba(15,23,42,0.45)] backdrop-blur">
      <CardContent className="flex h-full flex-col gap-4 p-6">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <h3 className="font-home-display text-2xl font-semibold tracking-[-0.04em] text-slate-950">
            {title}
          </h3>
          <p className="font-home-body text-base leading-7 text-slate-600">{body}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export default function HomePage({ onStart }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f6efe6] text-slate-950">
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,#f6efe6_0%,#f2e6d7_34%,#efe6db_68%,#f7f3ee_100%)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[42rem] bg-[radial-gradient(circle_at_18%_12%,rgba(245,109,72,0.26),transparent_28%),radial-gradient(circle_at_82%_16%,rgba(31,168,146,0.18),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.3),transparent_65%)]" />

      <section className="relative px-4 pb-16 pt-6 md:px-6 md:pb-24 md:pt-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between gap-4 rounded-full border border-black/10 bg-white/70 px-4 py-3 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.3)] backdrop-blur md:px-6">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#111111] text-[#f7f1ea] shadow-sm">
                <Mail className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="font-home-display text-base font-semibold tracking-[-0.03em]">
                  Email Cleaner
                </p>
                <p className="font-home-body text-sm text-slate-600">
                  Review workspace for high-signal email decisions.
                </p>
              </div>
            </div>

            <Button
              type="button"
              onClick={onStart}
              className="hidden rounded-full bg-[#111111] px-5 text-[#f7f1ea] hover:bg-black md:inline-flex"
            >
              Continue with Google
            </Button>
          </div>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start">
            <div className="space-y-7 pt-4 lg:pt-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-3 py-2 text-sm text-slate-700 shadow-sm">
                <CheckCircle2 className="h-4 w-4 text-[#f56d48]" aria-hidden="true" />
                Review important email before anything happens
              </div>

              <div className="space-y-5">
                <h1 className="max-w-[9ch] text-balance font-home-display text-5xl font-semibold leading-[0.84] tracking-[-0.085em] text-[#111111] md:text-[5.6rem]">
                  Make inbox decisions with context, not panic.
                </h1>
                <p className="max-w-xl font-home-body text-lg leading-8 text-slate-700 md:text-xl">
                  Email Cleaner surfaces the emails that deserve attention, shows why they matter,
                  and keeps the final action in your hands.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  type="button"
                  onClick={onStart}
                  size="lg"
                  className="h-12 rounded-full bg-[#111111] px-7 text-base text-[#f7f1ea] shadow-[0_18px_40px_-24px_rgba(17,17,17,0.7)] hover:bg-black"
                >
                  Continue with Google
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => scrollToId('how-it-works')}
                  className="h-12 rounded-full border-black/10 bg-white/75 px-7 text-base text-slate-700 hover:bg-white"
                >
                  See how the review works
                </Button>
              </div>

              <div className="grid gap-3 sm:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-[1.8rem] border border-black/10 bg-[#111111] p-5 text-[#f7f1ea] shadow-[0_26px_80px_-46px_rgba(17,17,17,0.8)]">
                  <p className="font-home-display text-xs font-semibold uppercase tracking-[0.28em] text-[#f2b59f]">
                    Product truth
                  </p>
                  <p className="mt-3 max-w-sm font-home-display text-2xl font-semibold leading-[0.95] tracking-[-0.05em]">
                    Not a magic inbox. A sharper review desk.
                  </p>
                  <p className="mt-3 font-home-body text-sm leading-6 text-[#ddd0c5]">
                    The design should feel more like an editorial control room than a generic SaaS
                    homepage.
                  </p>
                </div>
                <div className="rounded-[1.8rem] border border-black/10 bg-white/75 p-5 shadow-[0_20px_50px_-36px_rgba(15,23,42,0.35)]">
                  <p className="font-home-display text-xs font-semibold uppercase tracking-[0.28em] text-[#f56d48]">
                    Visible value
                  </p>
                  <div className="mt-3 space-y-3 font-home-body text-sm leading-6 text-slate-700">
                    <p>Suggestions first.</p>
                    <p>Evidence stays visible.</p>
                    <p>Sensitive actions remain explicit.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative lg:pl-6">
              <div className="absolute left-[8%] top-6 hidden h-48 w-48 rounded-full border border-black/8 bg-white/20 lg:block" />
              <div className="absolute right-0 top-0 hidden h-24 w-24 rounded-[2rem] bg-[#f56d48] lg:block" />
              <div className="absolute bottom-12 left-0 hidden h-20 w-20 rounded-full bg-[#1fa892] lg:block" />

              <div className="relative overflow-hidden rounded-[2.4rem] border border-black/10 bg-[linear-gradient(145deg,#fff8f1_0%,#f6ecdf_56%,#f1e5d8_100%)] p-4 shadow-[0_40px_120px_-56px_rgba(15,23,42,0.55)] md:p-5">
                <div className="grid gap-4 lg:grid-cols-[0.78fr_1.22fr]">
                  <div className="rounded-[1.8rem] bg-[#111111] p-5 text-[#f7f1ea]">
                    <p className="font-home-display text-xs font-semibold uppercase tracking-[0.28em] text-[#f2b59f]">
                      Review queue preview
                    </p>
                    <h2 className="mt-3 max-w-[10ch] font-home-display text-3xl font-semibold leading-[0.9] tracking-[-0.06em]">
                      One place to triage what actually matters.
                    </h2>
                    <p className="mt-4 font-home-body text-sm leading-6 text-[#d6c8bc]">
                      The home should feel like the first frame of the product, not a marketing
                      template pasted on top of it.
                    </p>
                  </div>

                  <div className="rounded-[1.8rem] border border-black/10 bg-white/82 p-4">
                    <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
                    <div>
                      <p className="font-home-display text-xs font-semibold uppercase tracking-[0.24em] text-[#1fa892]">
                        Suggestion board
                      </p>
                      <h2 className="mt-2 font-home-display text-3xl font-semibold tracking-[-0.05em] text-slate-950">
                        Next decisions, already framed.
                      </h2>
                    </div>
                    <div className="hidden rounded-full bg-[#f2f4f2] px-3 py-1 text-xs font-semibold text-slate-700 md:block">
                      Suggestions
                    </div>
                  </div>

                    <div className="mt-5 space-y-3">
                    {previewRows.map((row) => (
                      <div
                        key={row.subject}
                        className="rounded-[1.35rem] border border-slate-200 bg-[#fcfaf7] px-4 py-4 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.25)]"
                      >
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <div className="min-w-0">
                            <p className="truncate font-home-display text-sm font-semibold text-slate-900">
                              {row.sender}
                            </p>
                            <p className="mt-1 text-sm text-slate-600">{row.subject}</p>
                          </div>
                          <span
                            className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${row.tone}`}
                          >
                            {row.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                    <div className="mt-5 grid gap-3 md:grid-cols-2">
                      <div className="rounded-[1.5rem] bg-[#f56d48] p-4 text-[#fff6ef]">
                        <p className="font-home-display text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                          Why this feels different
                        </p>
                        <p className="mt-3 font-home-body text-sm leading-6 text-white/90">
                          The composition is asymmetrical on purpose. It should feel sharper,
                          warmer, and less interchangeable.
                        </p>
                      </div>
                      <div className="rounded-[1.5rem] bg-[#1f2c2a] p-4 text-[#eef6f3]">
                        <p className="font-home-display text-xs font-semibold uppercase tracking-[0.24em] text-[#8ce1d1]">
                          Visible controls
                        </p>
                        <div className="mt-3 flex items-center gap-2 text-sm text-[#d6ede8]">
                          <MessageSquareText className="h-4 w-4 text-[#8ce1d1]" aria-hidden="true" />
                          Receipt review and manual send remain explicit.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-[1.8rem] border border-black/10 bg-white/78 p-5 backdrop-blur">
                    <p className="font-home-display text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                      Design intent
                    </p>
                    <p className="mt-3 max-w-lg font-home-body text-base leading-7 text-slate-700">
                      Stronger graphic design without fake claims: warmer palette, harder shapes,
                      layered surfaces, and a layout that looks selected rather than default.
                    </p>
                  </div>
                  <div className="rounded-[1.8rem] border border-black/10 bg-[#fff8f1] p-5">
                    <div>
                      <p className="font-home-display text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                        What stays true
                      </p>
                      <div className="mt-3 space-y-2 font-home-body text-sm leading-6 text-slate-700">
                        <p>Review before action.</p>
                        <p>Context before automation.</p>
                        <p>Product first, brochure last.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="trust-principles" className="px-4 py-16 md:px-6 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl space-y-4">
            <p className="font-home-display text-sm font-semibold uppercase tracking-[0.28em] text-[#f56d48]">
              Trust principles
            </p>
            <h2 className="text-balance font-home-display text-4xl font-semibold leading-[0.95] tracking-[-0.05em] text-slate-950 md:text-5xl">
              Designed for review, not for blind inbox automation.
            </h2>
            <p className="font-home-body text-lg leading-8 text-slate-600">
              The first screen should make the product promise obvious: clearer review, less noise,
              and no hidden loss of control.
            </p>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {trustSignals.map((signal) => (
              <SignalCard key={signal.title} {...signal} />
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="px-4 py-16 md:px-6 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 rounded-[2rem] border border-black/10 bg-white/78 p-8 shadow-[0_30px_90px_-60px_rgba(15,23,42,0.45)] backdrop-blur lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:items-start">
          <div className="space-y-4">
            <p className="font-home-display text-sm font-semibold uppercase tracking-[0.28em] text-[#1fa892]">
              How it works
            </p>
            <h2 className="max-w-[12ch] text-balance font-home-display text-4xl font-semibold leading-[0.95] tracking-[-0.05em] text-slate-950">
              A calmer workflow for messy email.
            </h2>
            <p className="font-home-body text-lg leading-8 text-slate-600">
              The product reduces noise by structuring the next decision, not by pretending every
              email can be solved with one automatic rule.
            </p>
          </div>

          <div className="grid gap-4">
            {workflowSteps.map((step, index) => (
              <div
                key={step}
                className="flex items-start gap-4 rounded-[1.4rem] border border-slate-200 bg-[#fcfaf7] px-5 py-5"
              >
                <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#111111] text-sm font-semibold text-[#f7f1ea]">
                  0{index + 1}
                </div>
                <p className="font-home-body text-base leading-7 text-slate-700">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 pt-6 md:px-6 md:pb-24">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 rounded-[2rem] border border-black/10 bg-[#111111] px-8 py-10 text-white shadow-[0_32px_100px_-60px_rgba(15,23,42,0.85)] lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="font-home-display text-sm font-semibold uppercase tracking-[0.28em] text-[#8ce1d1]">
              Start with the real workflow
            </p>
            <h2 className="max-w-[14ch] text-balance font-home-display text-4xl font-semibold leading-[0.95] tracking-[-0.05em]">
              Open the review workspace and inspect the next decision.
            </h2>
            <p className="max-w-2xl font-home-body text-lg leading-8 text-slate-300">
              Connect Google only when you are ready to review with context. The product keeps the
              path focused from the first click.
            </p>
          </div>

          <Button
            type="button"
            onClick={onStart}
            size="lg"
            className="h-12 rounded-full bg-[#f56d48] px-7 text-base text-white hover:bg-[#eb5f37]"
          >
            Continue with Google
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </section>
    </div>
  );
}
