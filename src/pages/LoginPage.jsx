import { useState } from 'react';
import { AlertCircle, Eye, Loader2, Mail, Shield } from 'lucide-react';
import { Button } from '../components/ui/button.jsx';
import { Card, CardContent } from '../components/ui/card.jsx';

export default function LoginPage({ onLogin, message }) {
  const [isLoading, setIsLoading] = useState(false);
  const messageType = typeof message === 'object' ? message?.type : message ? 'error' : null;
  const messageText = typeof message === 'object' ? message?.text : message;
  const messageStyles =
    messageType === 'error'
      ? 'border-destructive/20 bg-destructive/10 text-destructive'
      : 'border-primary/20 bg-primary/10 text-foreground';

  const handleGoogleLogin = () => {
    setIsLoading(true);
    onLogin?.();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-3 text-center">
          <div className="mb-2 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Mail className="h-8 w-8 text-primary" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Email Cleaner
          </h1>
          <p className="mx-auto max-w-sm text-base text-muted-foreground">
            Connect your inbox with more clarity and control.
          </p>
        </div>

        <Card className="border-border/60 shadow-sm">
          <CardContent className="space-y-6 p-6">
            <div className="rounded-xl border border-border/70 bg-muted/30 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">
                What happens when you connect Google
              </p>
              <ul className="mt-3 space-y-2 text-sm text-foreground">
                <li>Review suggestions and inbox context inside one workspace.</li>
                <li>Sensitive actions stay under your control before they are applied.</li>
                <li>The app does not silently clean your inbox without your review.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0">
                  <Eye className="h-4 w-4 text-primary" aria-hidden="true" />
                </div>
                <p className="text-sm text-foreground">
                  Review emails with context before acting.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0">
                  <Shield className="h-4 w-4 text-primary" aria-hidden="true" />
                </div>
                <p className="text-sm text-foreground">
                  Sensitive actions stay under your control.
                </p>
              </div>
            </div>

            {messageText && (
              <div className={`flex items-start gap-3 rounded-lg border p-3 ${messageStyles}`}>
                <AlertCircle
                  className={`mt-0.5 h-4 w-4 flex-shrink-0 ${messageType === 'error' ? 'text-destructive' : 'text-primary'}`}
                  aria-hidden="true"
                />
                <p className="text-sm">{messageText}</p>
              </div>
            )}

            <Button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="h-12 w-full gap-3 text-base font-medium"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                  <span>Securing your connection...</span>
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Connect with Google to review your inbox with context before taking action.
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          By continuing, you agree to our{' '}
          <a href="#" className="underline underline-offset-2 transition-colors hover:text-foreground">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="underline underline-offset-2 transition-colors hover:text-foreground">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
