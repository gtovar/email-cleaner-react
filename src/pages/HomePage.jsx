import { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Eye,
  Lock,
  Mail,
  Scan,
  Shield,
  Sparkles,
  Terminal,
  Zap,
} from 'lucide-react';
import { Button } from '../components/ui/button.jsx';

/* ───────────────────────────────── Data ───────────────────────────────── */

const principles = [
  {
    icon: Eye,
    title: 'Review before action',
    body: 'Open the email, inspect the evidence, and decide with full context — never from a subject line alone.',
    accent: 'var(--void-accent)',
  },
  {
    icon: Shield,
    title: 'Sensitive actions stay explicit',
    body: 'Nothing critical runs behind the scenes. Every important confirmation is visible and requires your input.',
    accent: 'var(--void-accent-2)',
  },
  {
    icon: Sparkles,
    title: 'Suggestions first, inbox second',
    body: 'Your workspace opens with the decisions that matter most, then drops into manual review only when needed.',
    accent: 'var(--void-accent-3)',
  },
];

const workflowSteps = [
  {
    step: '01',
    label: 'Connect',
    detail: 'Authenticate your workspace with Google.',
    icon: Lock,
  },
  {
    step: '02',
    label: 'Review',
    detail: 'See suggestions with visible context, confidence, and sensitivity.',
    icon: Scan,
  },
  {
    step: '03',
    label: 'Decide',
    detail: 'Confirm, ignore, or inspect the original email before acting.',
    icon: Terminal,
  },
];

const previewRows = [
  {
    sender: 'payments@northstar.io',
    subject: 'Invoice 8821 pending review',
    priority: 'High',
    badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  },
  {
    sender: 'ops@warehouse.mx',
    subject: 'Receipt requires manual follow-up',
    priority: 'Receipt',
    badgeClass: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  },
  {
    sender: 'support@vendor.example',
    subject: 'General update, low urgency',
    priority: 'Low',
    badgeClass: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20',
  },
];

/* ──────────────────────────── Motion presets ──────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ─────────────────────── Reusable subcomponents ──────────────────────── */

/* Scroll-triggered section wrapper with fade-up entrance */
function RevealSection({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={fadeUp}
      custom={delay}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* Animated number counter for the stats ring */
function CountUp({ target, suffix = '', duration = 2 }) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration * 60);
    const tick = () => {
      start += step;
      if (start >= target) {
        setValue(target);
        return;
      }
      setValue(Math.round(start));
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target, duration]);

  return (
    <span ref={ref} className="font-home-mono text-3xl font-semibold tracking-tight text-white">
      {value}
      {suffix}
    </span>
  );
}

/* Typing effect for the terminal-style tagline */
function TerminalTyper({ text }) {
  const [chars, setChars] = useState('');
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setChars(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 32);
    return () => clearInterval(id);
  }, [inView, text]);

  return (
    <span ref={ref} className="font-home-mono">
      {chars}
      <motion.span
        className="inline-block h-5 w-[2px] translate-y-[2px] bg-cyan-400"
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
        aria-hidden="true"
      />
    </span>
  );
}

/* ──────────────────────────── Main component ─────────────────────────── */

export default function HomePage({ onStart }) {
  return (
    <div className="home-void home-grid-mesh relative min-h-screen overflow-x-hidden">

      {/* ── Ambient glow orbs ── */}
      <div
        className="home-glow-orb"
        style={{ width: 600, height: 600, top: -120, left: '-10%', background: 'var(--void-glow-cyan)' }}
      />
      <div
        className="home-glow-orb"
        style={{ width: 500, height: 500, top: '25%', right: '-8%', background: 'var(--void-glow-violet)' }}
      />
      <div
        className="home-glow-orb"
        style={{ width: 400, height: 400, bottom: '10%', left: '15%', background: 'rgba(249,115,22,0.08)' }}
      />

      {/* ════════════════════ HERO ════════════════════ */}
      <header className="relative px-4 pb-20 pt-6 md:px-6 md:pb-32 md:pt-8">
        <div className="mx-auto max-w-7xl">

          {/* ── Top navigation bar ── */}
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="home-glass-card mb-12 flex items-center justify-between px-5 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500">
                <Mail className="h-4 w-4 text-white" aria-hidden="true" />
              </div>
              <div>
                <p className="font-home-display text-sm font-semibold tracking-tight text-white">
                  Email Cleaner
                </p>
                <p className="font-home-mono text-[11px] tracking-wider text-zinc-500">
                  v1.0 · review workspace
                </p>
              </div>
            </div>

            <Button
              type="button"
              onClick={onStart}
              className="hidden rounded-full border border-white/10 bg-white/5 px-5 text-sm text-zinc-300 backdrop-blur hover:border-cyan-500/40 hover:bg-white/10 hover:text-white md:inline-flex"
            >
              Continue with Google
            </Button>
          </motion.nav>

          {/* ── Hero content grid ── */}
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">

            {/* Left: headline + CTA */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="space-y-8 pt-2 lg:pt-6"
            >
              <motion.div variants={fadeUp} custom={0}>
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/8 px-3 py-1.5">
                  <Zap className="h-3.5 w-3.5 text-cyan-400" aria-hidden="true" />
                  <span className="font-home-mono text-xs tracking-wide text-cyan-400">
                    Review important email before anything happens
                  </span>
                </div>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                custom={1}
                className="max-w-[14ch] font-home-display text-5xl font-extrabold leading-[0.92] tracking-[-0.04em] text-white md:text-7xl"
              >
                Make inbox decisions with context, not panic.
              </motion.h1>

              <motion.p
                variants={fadeUp}
                custom={2}
                className="max-w-xl font-home-body text-lg leading-8 text-zinc-400"
              >
                Email Cleaner surfaces the emails that deserve attention, shows why they matter,
                and keeps the final action in your hands.
              </motion.p>

              <motion.div variants={fadeUp} custom={3} className="flex flex-col gap-4 sm:flex-row">
                <Button
                  type="button"
                  onClick={onStart}
                  size="lg"
                  className="group relative h-12 overflow-hidden rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 px-7 text-base font-semibold text-white shadow-[0_0_32px_-8px_rgba(34,211,238,0.5)] transition-all hover:shadow-[0_0_48px_-4px_rgba(34,211,238,0.6)]"
                >
                  Continue with Google
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                  className="h-12 rounded-full border-white/10 bg-transparent px-7 text-base text-zinc-400 hover:border-white/20 hover:bg-white/5 hover:text-white"
                >
                  See how the review works
                </Button>
              </motion.div>

              {/* Terminal-style microcopy */}
              <motion.div
                variants={fadeUp}
                custom={4}
                className="home-glass-card inline-flex items-center gap-3 px-5 py-3"
              >
                <Terminal className="h-4 w-4 text-cyan-400" aria-hidden="true" />
                <p className="text-sm text-zinc-500">
                  <TerminalTyper text="Not a magic inbox. A sharper review desk." />
                </p>
              </motion.div>
            </motion.div>

            {/* Right: preview panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative"
            >
              <div className="home-glow-border">
                <div className="home-scanline relative rounded-[1.25rem] bg-[#0a0a0a] p-5">

                  {/* Panel header */}
                  <div className="mb-5 flex items-center justify-between border-b border-white/5 pb-4">
                    <div>
                      <p className="font-home-mono text-[11px] font-medium uppercase tracking-[0.2em] text-cyan-400">
                        Suggestion board
                      </p>
                      <h2 className="mt-1 font-home-display text-xl font-semibold tracking-tight text-white">
                        Next decisions, already framed.
                      </h2>
                    </div>
                    <div className="home-pulse-badge rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 font-home-mono text-[11px] text-cyan-400">
                      3 active
                    </div>
                  </div>

                  {/* Preview rows */}
                  <div className="space-y-3">
                    <AnimatePresence>
                      {previewRows.map((row, i) => (
                        <motion.div
                          key={row.subject}
                          initial={{ opacity: 0, x: 12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + i * 0.15, duration: 0.5 }}
                          className="home-preview-row px-4 py-3.5"
                        >
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0">
                              <p className="truncate font-home-mono text-xs font-medium text-zinc-400">
                                {row.sender}
                              </p>
                              <p className="mt-1 truncate text-sm text-zinc-300">{row.subject}</p>
                            </div>
                            <span
                              className={`inline-flex w-fit shrink-0 rounded-full border px-2.5 py-0.5 font-home-mono text-[11px] font-medium ${row.badgeClass}`}
                            >
                              {row.priority}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Stats mini-bar */}
                  <div className="mt-5 grid grid-cols-3 gap-3">
                    {[
                      { label: 'Reviewed', value: 142 },
                      { label: 'Confirmed', value: 89 },
                      { label: 'Saved hrs', value: 24, suffix: 'h' },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-3 text-center"
                      >
                        <CountUp target={stat.value} suffix={stat.suffix || ''} />
                        <p className="mt-1 font-home-mono text-[10px] uppercase tracking-wider text-zinc-600">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* ════════════════ TRUST PRINCIPLES ════════════════ */}
      <RevealSection className="px-4 py-20 md:px-6 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl space-y-4">
            <p className="font-home-mono text-xs font-medium uppercase tracking-[0.25em] text-cyan-400">
              Trust principles
            </p>
            <h2 className="font-home-display text-4xl font-bold tracking-[-0.03em] text-white md:text-5xl">
              Designed for review, not for blind inbox automation.
            </h2>
            <p className="font-home-body text-lg leading-8 text-zinc-500">
              The first screen should make the product promise clear: sharper review, less noise,
              and no hidden loss of control.
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={stagger}
            className="mt-12 grid gap-5 lg:grid-cols-3"
          >
            {principles.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.title}
                  variants={fadeUp}
                  custom={i}
                  className="home-glass-card home-glow-border group p-6"
                >
                  <div className="relative z-10">
                    <div
                      className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `color-mix(in srgb, ${p.accent} 12%, transparent)` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: p.accent }} aria-hidden="true" />
                    </div>
                    <h3 className="font-home-display text-lg font-semibold text-white">{p.title}</h3>
                    <p className="mt-2 font-home-body text-sm leading-7 text-zinc-500">{p.body}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </RevealSection>

      {/* ════════════════ HOW IT WORKS ════════════════ */}
      <RevealSection id="how-it-works" className="px-4 py-20 md:px-6 md:py-28" delay={0.1}>
        <div className="mx-auto max-w-7xl">
          <div className="home-glass-card overflow-hidden p-8 md:p-12">
            <div className="grid gap-12 lg:grid-cols-[0.55fr_1fr] lg:items-start">

              <div className="space-y-4">
                <p className="font-home-mono text-xs font-medium uppercase tracking-[0.25em] text-violet-400">
                  How it works
                </p>
                <h2 className="font-home-display text-3xl font-bold tracking-[-0.03em] text-white md:text-4xl">
                  A calmer workflow for messy email.
                </h2>
                <p className="font-home-body text-base leading-7 text-zinc-500">
                  The product reduces noise by structuring the next decision, not by pretending
                  every email can be solved with one automatic rule.
                </p>
              </div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={stagger}
                className="grid gap-4"
              >
                {workflowSteps.map((ws, i) => {
                  const StepIcon = ws.icon;
                  return (
                    <motion.div
                      key={ws.step}
                      variants={fadeUp}
                      custom={i}
                      className="group flex items-start gap-5 rounded-2xl border border-white/5 bg-white/[0.02] px-6 py-5 transition-colors hover:border-violet-500/20 hover:bg-white/[0.04]"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 font-home-mono text-sm font-semibold text-violet-400">
                        {ws.step}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <StepIcon className="h-4 w-4 text-zinc-600" aria-hidden="true" />
                          <h3 className="font-home-display text-sm font-semibold uppercase tracking-wide text-zinc-300">
                            {ws.label}
                          </h3>
                        </div>
                        <p className="mt-1 font-home-body text-sm leading-7 text-zinc-500">{ws.detail}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* ════════════════ FINAL CTA ════════════════ */}
      <RevealSection className="px-4 pb-24 pt-8 md:px-6 md:pb-32" delay={0.15}>
        <div className="mx-auto max-w-5xl">
          <div className="home-glow-border">
            <div className="relative z-10 flex flex-col gap-8 rounded-[1.25rem] bg-[#0a0a0a] px-8 py-12 lg:flex-row lg:items-end lg:justify-between lg:px-12 lg:py-14">
              <div className="space-y-4">
                <p className="font-home-mono text-xs font-medium uppercase tracking-[0.25em] text-cyan-400">
                  Start with the real workflow
                </p>
                <h2 className="max-w-[18ch] font-home-display text-3xl font-bold tracking-[-0.03em] text-white md:text-4xl">
                  Open the review workspace and inspect the next decision.
                </h2>
                <p className="max-w-2xl font-home-body text-base leading-8 text-zinc-500">
                  Connect Google only when you are ready to review with context. The product keeps
                  the path focused from the first click.
                </p>
              </div>

              <Button
                type="button"
                onClick={onStart}
                size="lg"
                className="group h-13 shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 px-8 text-base font-semibold text-white shadow-[0_0_32px_-8px_rgba(34,211,238,0.5)] transition-all hover:shadow-[0_0_48px_-4px_rgba(34,211,238,0.6)]"
              >
                Continue with Google
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Button>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* ── Footer micro ── */}
      <footer className="border-t border-white/5 px-4 py-8 text-center md:px-6">
        <p className="font-home-mono text-xs tracking-wider text-zinc-600">
          Email Cleaner · Review workspace for high-signal email decisions
        </p>
      </footer>
    </div>
  );
}
