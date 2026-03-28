import { useCallback } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Mail,
  Search,
  Shield,
  Sparkles,
  ThumbsUp,
} from 'lucide-react';
import { Button } from '../components/ui/button.jsx';
import { Card, CardContent } from '../components/ui/card.jsx';

const BenefitCard = ({ icon, title, description }) => (
  <Card className="border-border/50 bg-card/70">
    <CardContent className="space-y-3 p-6">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const StepCard = ({ step, icon, title, description }) => (
  <div className="text-center space-y-4">
    <div className="relative inline-flex items-center justify-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
        {step}
      </span>
    </div>
    <h3 className="text-sm font-semibold text-foreground">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

const PreviewSuggestionCard = ({ sender, subject, count, faded = false }) => (
  <div
    className={`flex items-center justify-between rounded-lg border border-border/60 bg-background p-4 text-sm ${
      faded ? 'opacity-50' : ''
    }`}
  >
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <Mail className="h-4 w-4" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="truncate font-medium text-foreground">{sender}</p>
        <p className="truncate text-xs text-muted-foreground">{subject}</p>
      </div>
    </div>
    <div className="flex items-center gap-3 text-xs text-muted-foreground">
      <span>{count} emails</span>
      {!faded && (
        <div className="flex gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
            <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-destructive/10 text-destructive">
            ×
          </div>
        </div>
      )}
    </div>
  </div>
);

export default function HomePage({ onStart }) {
  const handleScroll = useCallback((id) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative px-4 py-20 md:py-32">
        <div className="mx-auto max-w-4xl space-y-6 text-center">
          <div className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
            <Mail className="h-10 w-10 text-primary" aria-hidden="true" />
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            Review your inbox with more clarity and control
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
            Email Cleaner helps you review, organize, and act on emails without
            losing control of important decisions.
          </p>

          <div className="pt-4">
            <Button onClick={onStart} size="lg" className="h-12 gap-2 px-8 text-base">
              <span>Continue to sign in</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>

          <p className="pt-2 text-sm text-muted-foreground">
            Review first, act with control, and connect Google only when ready
          </p>
        </div>
      </section>

      <section className="bg-muted/30 px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-2xl font-semibold text-foreground md:text-3xl">
            How the review stays under your control
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <BenefitCard
              icon={<Shield className="h-5 w-5" aria-hidden="true" />}
              title="You stay in control"
              description="Sensitive actions stay in your hands. The app helps you review before acting."
            />
            <BenefitCard
              icon={<Sparkles className="h-5 w-5" aria-hidden="true" />}
              title="Guided review"
              description="See suggestions, check context, and decide what makes sense for your inbox."
            />
            <BenefitCard
              icon={<Clock className="h-5 w-5" aria-hidden="true" />}
              title="Less clutter, less effort"
              description="Organize repeated email noise faster without treating every message the same way."
            />
            <BenefitCard
              icon={<CheckCircle2 className="h-5 w-5" aria-hidden="true" />}
              title="More detail only when needed"
              description="Some flows show additional context when you open a specific case for review."
            />
          </div>
        </div>
      </section>

      <section id="como-funciona" className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-semibold text-foreground md:text-3xl">
            How it works
          </h2>
          <p className="mx-auto mb-12 mt-4 max-w-xl text-center text-muted-foreground">
            A guided review flow that explains what happens before you connect your inbox
          </p>

          <div className="grid gap-8 md:grid-cols-3 md:gap-12">
            <StepCard
              step={1}
              icon={<Search className="h-5 w-5" aria-hidden="true" />}
              title="Connect your account"
              description="Sign in with Google to review your inbox inside a safer, guided workspace."
            />
            <StepCard
              step={2}
              icon={<ThumbsUp className="h-5 w-5" aria-hidden="true" />}
              title="Review suggestions and emails"
              description="See suggestions, inspect context, and decide what deserves action."
            />
            <StepCard
              step={3}
              icon={<CheckCircle2 className="h-5 w-5" aria-hidden="true" />}
              title="Act with control"
              description="Approve sensitive actions, review outcomes, and keep track of what happened."
            />
          </div>

          <div className="mt-10 text-center">
            <Button variant="outline" size="lg" onClick={() => handleScroll('preview')}>
              See the review flow first
            </Button>
          </div>
        </div>
      </section>

      <section id="preview" className="bg-muted/30 px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-center text-2xl font-semibold text-foreground md:text-3xl">
            See the review experience
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-center text-muted-foreground">
            A focused interface that helps you review email before taking action
          </p>

          <Card className="overflow-hidden border-border/60 shadow-lg">
            <div className="flex items-center gap-2 border-b border-border/60 bg-card px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-destructive/60" />
              <div className="h-3 w-3 rounded-full bg-yellow-400/60" />
              <div className="h-3 w-3 rounded-full bg-primary/60" />
              <span className="ml-4 text-sm text-muted-foreground">Email Cleaner</span>
            </div>
            <CardContent className="space-y-4 p-6 md:p-8">
              <PreviewSuggestionCard
                sender="newsletter@company.com"
                subject="Weekly digest #142"
                count={87}
              />
              <PreviewSuggestionCard
                sender="promo@store.example"
                subject="Dont miss our sale!"
                count={156}
                faded
              />
              <PreviewSuggestionCard
                sender="updates@service.io"
                subject="Your monthly summary"
                count={24}
                faded
              />
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="px-4 py-20 md:py-28">
        <div className="mx-auto max-w-2xl space-y-6 text-center">
          <h2 className="text-2xl font-semibold text-foreground md:text-3xl">
            Start with a clearer inbox
          </h2>
          <p className="text-lg text-muted-foreground">
            Review email with more context, keep control of sensitive actions, and
            reduce inbox noise without guessing.
          </p>
          <Button onClick={onStart} size="lg" className="h-12 gap-2 px-8 text-base">
            <span>Continue to sign in</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </section>

      <footer className="border-t border-border/60 px-4 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" aria-hidden="true" />
            <span className="text-sm">Email Cleaner</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <button type="button" className="hover:text-foreground transition-colors">
              Privacy
            </button>
            <button type="button" className="hover:text-foreground transition-colors">
              Terms
            </button>
            <button type="button" className="hover:text-foreground transition-colors">
              Contact
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
