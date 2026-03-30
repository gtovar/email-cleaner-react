import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useInView, useMotionValue, useTransform, useSpring } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  Inbox,
  Lock,
  Mail,
  Scan,
  Shield,
  Sparkles,
} from 'lucide-react';
import { Button } from '../components/ui/button.jsx';

/* ─────────────────────────────── Data ─────────────────────────────── */

const principles = [
  {
    icon: Eye,
    title: 'Review before action',
    body: 'Open the email, inspect the evidence, and decide with full context — not from a subject line.',
    gradient: 'from-teal-400 to-emerald-400',
    glow: 'rgba(45, 212, 191, 0.12)',
  },
  {
    icon: Shield,
    title: 'Sensitive actions stay explicit',
    body: 'Nothing critical runs behind the scenes. Every important confirmation is visible and requires your call.',
    gradient: 'from-violet-400 to-purple-400',
    glow: 'rgba(167, 139, 250, 0.12)',
  },
  {
    icon: Sparkles,
    title: 'Suggestions first, inbox second',
    body: 'Your workspace opens with the decisions that matter most. Manual review is always one step away.',
    gradient: 'from-amber-400 to-orange-400',
    glow: 'rgba(251, 191, 36, 0.12)',
  },
];

const steps = [
  { n: '01', label: 'Connect your workspace with Google.', icon: Lock },
  { n: '02', label: 'Review suggestions with visible context and confidence.', icon: Scan },
  { n: '03', label: 'Confirm, ignore, or inspect the original email before acting.', icon: CheckCircle2 },
];

const previewRows = [
  {
    sender: 'payments@northstar.io',
    subject: 'Invoice 8821 pending review',
    tag: 'High priority',
    dot: 'bg-amber-400',
  },
  {
    sender: 'ops@warehouse.mx',
    subject: 'Receipt requires manual follow-up',
    tag: 'Needs receipt check',
    dot: 'bg-teal-400',
  },
  {
    sender: 'support@vendor.example',
    subject: 'General update, low urgency',
    tag: 'Manual inbox context',
    dot: 'bg-slate-400',
  },
];

/* ────────────────────────── Motion helpers ────────────────────────── */

const ease = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.1, ease },
  }),
};

const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

/* Scroll-triggered section wrapper */
function Reveal({ children, className = '', delay = 0, ...rest }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={fadeUp}
      custom={delay}
      className={className}
      {...rest}
    >
      {children}
    </motion.section>
  );
}

/* Interactive tilt card — follows cursor with a soft 3D rotation */
function TiltCard({ children, className = '', glowColor }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 20 });

  const handleMouse = useCallback(
    (e) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      x.set((e.clientX - rect.left) / rect.width - 0.5);
      y.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [x, y],
  );

  const handleLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className={className}
    >
      {/* Colored glow behind the card on hover */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[1.25rem] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${glowColor || 'rgba(56,189,248,0.06)'}, transparent 40%)` }}
      />
      {children}
    </motion.div>
  );
}

/* Animated mesh gradient background — pure CSS, no canvas */
function AuroraMesh() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-[#0B1120]" />

      {/* Animated aurora blobs */}
      <div
        className="absolute -left-[20%] -top-[30%] h-[70vh] w-[70vh] rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(56,189,248,0.4) 0%, transparent 70%)',
          animation: 'aurora-drift 18s ease-in-out infinite alternate',
        }}
      />
      <div
        className="absolute -right-[15%] top-[10%] h-[60vh] w-[60vh] rounded-full opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)',
          animation: 'aurora-drift 22s ease-in-out infinite alternate-reverse',
        }}
      />
      <div
        className="absolute bottom-[5%] left-[20%] h-[50vh] w-[50vh] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(20,184,166,0.3) 0%, transparent 70%)',
          animation: 'aurora-drift 15s ease-in-out 3s infinite alternate',
        }}
      />

      {/* Subtle noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', backgroundRepeat: 'repeat', backgroundSize: '128px 128px' }} />
    </div>
  );
}

/* ────────────────────────── Main component ────────────────────────── */

export default function HomePage({ onStart }) {
  /* Track mouse for glow effect on hero card */
  const heroCardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: '50%', y: '50%' });

  const handleHeroMouse = useCallback((e) => {
    const el = heroCardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setMousePos({
      x: `${e.clientX - rect.left}px`,
      y: `${e.clientY - rect.top}px`,
    });
  }, []);

  return (
    <div className="home-aurora relative min-h-screen overflow-x-hidden text-slate-100">
      <AuroraMesh />

      {/* ═══════════════════════ NAV ═══════════════════════ */}
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-blue-500 shadow-lg shadow-teal-500/20">
            <Mail className="h-4 w-4 text-white" aria-hidden="true" />
          </div>
          <span className="font-home-display text-base font-semibold tracking-tight text-white">
            Email Cleaner
          </span>
        </div>

        <Button
          type="button"
          onClick={onStart}
          className="hidden rounded-full border border-white/10 bg-white/5 px-5 text-sm text-slate-300 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10 hover:text-white md:inline-flex"
        >
          Continue with Google
        </Button>
      </motion.nav>

      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <header className="relative z-10 px-5 pb-24 pt-12 md:px-8 md:pb-36 md:pt-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">

            {/* Left: copy */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="space-y-8"
            >
              <motion.div variants={fadeUp} custom={0}>
                <span className="inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/[0.07] px-3.5 py-1.5 text-xs font-medium text-teal-300">
                  <Zap className="h-3.5 w-3.5" />
                  Review important email before anything happens
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                custom={1}
                className="max-w-[15ch] font-home-display text-[3.2rem] font-extrabold leading-[1.05] tracking-[-0.035em] md:text-[4.5rem]"
              >
                <span className="block bg-[linear-gradient(135deg,#ffffff_0%,#f8fffe_18%,#c7fff5_56%,#5eead4_100%)] bg-clip-text text-transparent [text-shadow:0_14px_36px_rgba(45,212,191,0.14)]">
                  Make inbox decisions with
                </span>
                <span className="block bg-[linear-gradient(135deg,#99f6e4_0%,#2dd4bf_52%,#14b8a6_100%)] bg-clip-text text-transparent [text-shadow:0_16px_40px_rgba(20,184,166,0.22)]">
                  context, not panic.
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                custom={2}
                className="max-w-lg font-home-body text-lg leading-8 text-slate-400"
              >
                Email Cleaner surfaces the emails that deserve attention, shows why they matter,
                and keeps the final action in your hands.
              </motion.p>

              <motion.div variants={fadeUp} custom={3} className="flex flex-wrap items-center gap-4">
                <Button
                  type="button"
                  onClick={onStart}
                  size="lg"
                  className="aurora-cta group relative h-12 overflow-hidden rounded-full bg-gradient-to-r from-teal-500 to-blue-500 px-7 text-base font-semibold text-white shadow-xl shadow-teal-500/25 transition-shadow hover:shadow-teal-500/40"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Continue with Google
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                  className="h-12 rounded-full border-white/10 bg-transparent px-7 text-base text-slate-400 transition-all hover:border-white/20 hover:bg-white/5 hover:text-white"
                >
                  See how the review works
                </Button>
              </motion.div>
            </motion.div>

            {/* Right: suggestion board preview */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.25, ease }}
              ref={heroCardRef}
              onMouseMove={handleHeroMouse}
              className="group relative"
            >
              {/* Outer glow that follows cursor */}
              <div
                className="pointer-events-none absolute -inset-4 rounded-3xl opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-100"
                style={{ background: `radial-gradient(400px circle at ${mousePos.x} ${mousePos.y}, rgba(56,189,248,0.12), transparent 60%)` }}
              />

              <motion.div
                initial={{ rotate: 2.5, y: 8, scale: 0.985 }}
                animate={{ rotate: 2.5, y: 8, scale: 0.985 }}
                whileHover={{ rotate: 0, y: 0, scale: 1 }}
                transition={{ duration: 0.55, ease }}
                className="relative origin-bottom-left"
              >
              <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] shadow-2xl shadow-black/20 backdrop-blur-xl">

                {/* Faux window chrome */}
                <div className="border-b border-white/[0.05] bg-white/[0.035] px-5 py-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57] shadow-[0_0_12px_rgba(255,95,87,0.28)]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e] shadow-[0_0_12px_rgba(254,188,46,0.24)]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#28c840] shadow-[0_0_12px_rgba(40,200,64,0.24)]" />
                    </div>
                    <div className="px-1 text-[10px] font-medium uppercase tracking-[0.22em] text-slate-500">
                      Review board
                    </div>
                  </div>
                </div>

                <div className="p-6">

                {/* Header */}
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10">
                      <Inbox className="h-4 w-4 text-teal-400" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-teal-400">
                        Suggestion board
                      </p>
                      <h2 className="font-home-display text-base font-semibold text-white">
                        Next decisions, already framed.
                      </h2>
                    </div>
                  </div>
                  <span className="rounded-full bg-teal-500/10 px-2.5 py-1 text-[11px] font-medium text-teal-400">
                    3 active
                  </span>
                </div>

                {/* Separator */}
                <div className="mb-4 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

                {/* Rows */}
                <div className="space-y-2.5">
                  {previewRows.map((row, i) => (
                    <motion.div
                      key={row.subject}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.12, duration: 0.6, ease }}
                      className="group/row flex items-center justify-between gap-4 rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-3.5 transition-all hover:border-white/[0.08] hover:bg-white/[0.04]"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-slate-500">{row.sender}</p>
                        <p className="mt-0.5 truncate text-sm text-slate-300">{row.subject}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className={`h-1.5 w-1.5 rounded-full ${row.dot}`} />
                        <span className="text-[11px] font-medium text-slate-500">{row.tag}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Bottom visual accent */}
                <div className="mt-5 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xs text-slate-600">Showing top suggestions by review priority</p>
                  <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className={`h-1 rounded-full ${i === 0 ? 'w-4 bg-teal-500' : 'w-1 bg-slate-700'}`} />
                    ))}
                  </div>
                </div>
                </div>
              </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* ═══════════════════ TRUST PRINCIPLES ═══════════════════ */}
      <Reveal className="relative z-10 px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-400">
              Trust principles
            </p>
            <h2 className="mt-4 font-home-display text-3xl font-bold tracking-[-0.02em] text-white md:text-[2.75rem]">
              Designed for review, not for blind inbox automation.
            </h2>
            <p className="mt-4 font-home-body text-base leading-7 text-slate-500">
              The first screen should make the product promise obvious: clearer review,
              less noise, and no hidden loss of control.
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="mt-16 grid gap-6 lg:grid-cols-3"
          >
            {principles.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div key={p.title} variants={fadeUp} custom={i}>
                  <TiltCard
                    className="group relative h-full rounded-[1.25rem] border border-white/[0.06] bg-white/[0.02] p-7 backdrop-blur-sm transition-colors hover:border-white/[0.1]"
                    glowColor={p.glow}
                  >
                    <div className="relative z-10">
                      <div className={`mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${p.gradient} shadow-lg`}>
                        <Icon className="h-5 w-5 text-white" aria-hidden="true" />
                      </div>
                      <h3 className="font-home-display text-lg font-semibold text-white">{p.title}</h3>
                      <p className="mt-3 font-home-body text-sm leading-7 text-slate-500">{p.body}</p>
                    </div>
                  </TiltCard>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </Reveal>

      {/* ═══════════════════ HOW IT WORKS ═══════════════════ */}
      <Reveal id="how-it-works" className="relative z-10 px-5 py-24 md:px-8 md:py-32" delay={0.05}>
        <div className="mx-auto max-w-5xl">
          <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 backdrop-blur-sm md:p-12">
            <div className="grid gap-12 md:grid-cols-[0.48fr_1fr] md:items-start">

              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
                  How it works
                </p>
                <h2 className="font-home-display text-2xl font-bold tracking-[-0.02em] text-white md:text-3xl">
                  A calmer workflow for messy email.
                </h2>
                <p className="font-home-body text-sm leading-7 text-slate-500">
                  The product reduces noise by structuring the next decision, not by pretending
                  every email can be solved with one automatic rule.
                </p>
              </div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={stagger}
                className="space-y-4"
              >
                {steps.map((s, i) => {
                  const StepIcon = s.icon;
                  return (
                    <motion.div
                      key={s.n}
                      variants={fadeUp}
                      custom={i}
                      className="flex items-start gap-5 rounded-xl border border-white/[0.04] bg-white/[0.02] px-5 py-4 transition-colors hover:border-white/[0.08] hover:bg-white/[0.04]"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/20 to-blue-500/20 text-sm font-bold text-violet-400">
                        {s.n}
                      </div>
                      <div className="flex items-start gap-2 pt-1.5">
                        <StepIcon className="mt-0.5 h-4 w-4 shrink-0 text-slate-600" aria-hidden="true" />
                        <p className="font-home-body text-sm leading-7 text-slate-400">{s.label}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ═══════════════════ FINAL CTA ═══════════════════ */}
      <Reveal className="relative z-10 px-5 pb-28 pt-8 md:px-8 md:pb-36" delay={0.1}>
        <div className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#0f1d32] to-[#0B1120] p-10 md:p-14">
            {/* Internal glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />

            <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-400">
                  Start with the real workflow
                </p>
                <h2 className="max-w-[18ch] font-home-display text-2xl font-bold tracking-[-0.02em] text-white md:text-3xl">
                  Open the review workspace and inspect the next decision.
                </h2>
                <p className="max-w-lg font-home-body text-sm leading-7 text-slate-500">
                  Connect Google only when you are ready to review with context. The product
                  keeps the path focused from the first click.
                </p>
              </div>

              <Button
                type="button"
                onClick={onStart}
                size="lg"
                className="group shrink-0 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 px-8 py-3 text-base font-semibold text-white shadow-xl shadow-teal-500/20 transition-shadow hover:shadow-teal-500/35"
              >
                Continue with Google
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/[0.04] px-5 py-8 text-center md:px-8">
        <p className="text-xs text-slate-600">
          Email Cleaner · Review workspace for high-signal email decisions
        </p>
      </footer>
    </div>
  );
}

/* ── Tiny inline component used in the hero badge (avoids adding it to the lucide import list) */
function Zap(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
    </svg>
  );
}
