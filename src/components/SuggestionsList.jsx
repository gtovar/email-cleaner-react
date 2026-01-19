// src/components/SuggestionsList.jsx
import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Check, Mail, X } from 'lucide-react';
import { toast } from 'sonner';
import { getSuggestions, confirmAction } from '../services/api.js';
import ConfirmButton from './ConfirmButton.jsx';
import StatusMessage from './StatusMessage.jsx';
import EmptyState from './State/EmptyState.jsx';
import { Button } from './ui/button.jsx';
import { Badge } from './ui/badge.jsx';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card.jsx';
import { Skeleton } from './ui/skeleton.jsx';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog.jsx';

function SuggestionsList() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [feedbackType, setFeedbackType] = useState(null);
  const [initialCount, setInitialCount] = useState(0);
  const prevReviewedRef = useRef(0);
  const [compactView, setCompactView] = useState(false);
  const [rejectOpenId, setRejectOpenId] = useState(null);
  const [rejectLoadingId, setRejectLoadingId] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [ariaMessage, setAriaMessage] = useState('');

  useEffect(() => {
    async function loadSuggestions() {
      setLoading(true);
      setFeedback(null);
      setFeedbackType(null);

      try {
        const data = await getSuggestions('daily');
        // data debería ser un array de correos con { id, subject, from, date, suggestions }
        const normalized = Array.isArray(data) ? data : [];
        setEmails(normalized);
        setInitialCount(normalized.length);
      } catch (err) {
        console.error(err);
        setFeedback( err.message || '❌ Error al cargar sugerencias desde el backend.');
          setFeedbackType('error');
        setInitialCount(0);
      } finally {
        setLoading(false);
      }
    }

    loadSuggestions();
  }, []);

  const handleActionSuccess = (emailId) => {
    const removedEmail = emails.find((email) => email.id === emailId);
    const nextReviewedCount = Math.max(0, initialCount - (emails.length - 1));
    const progressPercent = initialCount
      ? Math.round((nextReviewedCount / initialCount) * 100)
      : 0;
    const feedbackMessage =
      nextReviewedCount % 2 === 0
        ? `Bien hecho — ${nextReviewedCount} correos menos en tu inbox`
        : `Vas avanzando — ya limpiaste ${progressPercent}%`;
    setFeedback(null);
    setFeedbackType(null);
    setAriaMessage(feedbackMessage);
    if (removedEmail) {
      toast(feedbackMessage, {
        duration: 3000,
        action: {
          label: 'Deshacer',
          onClick: () => {
            setEmails((prev) => [removedEmail, ...prev]);
          },
        },
      });
    }
    setTimeout(() => {
      setEmails((prev) => prev.filter((email) => email.id !== emailId));
      setProcessingId((current) => (current === emailId ? null : current));
    }, 1200);
  };

  const reviewedCount = Math.max(0, initialCount - emails.length);
  useEffect(() => {
    if (reviewedCount === 0 || reviewedCount === prevReviewedRef.current) {
      return;
    }
    if (reviewedCount % 5 === 0) {
      toast('Good job — inbox getting cleaner', { duration: 2500 });
    }
    prevReviewedRef.current = reviewedCount;
  }, [reviewedCount]);

  useEffect(() => {
    if (!ariaMessage) return;
    const timeout = setTimeout(() => setAriaMessage(''), 3000);
    return () => clearTimeout(timeout);
  }, [ariaMessage]);

  const formatSuggestion = (value) => {
    if (!value) return 'Sin detalle disponible.';
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      if (value.reason) return value.reason;
      if (value.summary) return value.summary;
      const actionLabel =
        value.action === 'review'
          ? 'Review'
          : value.action === 'accept'
            ? 'Accept'
            : value.action === 'reject'
              ? 'Reject'
              : value.action;
      const classificationLabel =
        value.classification === 'recent'
          ? 'Recent'
          : value.classification;
      const confidence =
        typeof value.confidence_score === 'number'
          ? `Confidence ${value.confidence_score}`
          : null;
      const parts = [actionLabel, classificationLabel, confidence].filter(Boolean);
      if (parts.length > 0) return parts.join(' · ');
      return 'Detalle de sugerencia no legible.';
    }
    return String(value);
  };

  const formatDate = (value) => {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const buildTags = (email) => {
    const tags = [];
    if (email?.category) {
      tags.push(email.category);
    }
    if (Array.isArray(email?.labels)) {
      tags.push(...email.labels);
    }
    return tags.filter(Boolean);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
        <span>Review AI-recommended emails for cleanup</span>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant={compactView ? 'default' : 'ghost'}
            size="sm"
            className="rounded-full px-3"
            onClick={() => setCompactView((prev) => !prev)}
          >
            Compact view
          </Button>
          <span>
            {reviewedCount} of {initialCount} reviewed
          </span>
        </div>
      </div>

      <div className="sr-only" aria-live="polite" role="status">
        {ariaMessage}
      </div>

      <StatusMessage message={feedback} type={feedbackType || 'info'} />

      {loading && (
        <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={`loading-${index}`} className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <div className="mt-4 space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {!loading && emails.length === 0 && (
        <EmptyState type="suggestions" />
      )}

      <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {emails.map((email) => (
          <Card
            key={email.id}
            className="transition-all hover:shadow-md"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Mail className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <h3 className="font-medium leading-snug truncate" title={email.subject}>
                    {email.subject || '(Sin asunto)'}
                  </h3>
                </div>
                <Badge variant="secondary" className="shrink-0">
                  Pending
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              {!compactView && (
                <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  {formatDate(email.date) && (
                    <span>{formatDate(email.date)}</span>
                  )}
                  {buildTags(email).length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      {buildTags(email).map((tag) => (
                        <Badge key={`${email.id}-${tag}`} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {!compactView && email.snippet && (
                <p className="mb-2 line-clamp-2 text-sm text-foreground/70">
                  {email.snippet}
                </p>
              )}
              {!compactView &&
                Array.isArray(email.suggestions) &&
                email.suggestions.length > 0 && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {formatSuggestion(email.suggestions[0])}
                  </p>
                )}
            </CardContent>
            <CardFooter className="gap-2 pt-0">
              <ConfirmButton
                emailId={email.id}
                action="accept"
                onSuccess={handleActionSuccess}
                onStart={() => setProcessingId(email.id)}
                disabled={processingId === email.id || rejectLoadingId === email.id}
                className="flex-1 gap-2"
                icon={<Check className="h-4 w-4" aria-hidden="true" />}
              />
              <AlertDialog
                open={rejectOpenId === email.id}
                onOpenChange={(open) => setRejectOpenId(open ? email.id : null)}
              >
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex-1 gap-2 text-muted-foreground hover:text-foreground hover:bg-muted"
                    disabled={processingId === email.id || rejectLoadingId === email.id}
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                    Rechazar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                        <AlertTriangle className="h-5 w-5 text-destructive" aria-hidden="true" />
                      </div>
                      <AlertDialogTitle>
                        ¿Rechazar esta sugerencia?
                      </AlertDialogTitle>
                    </div>
                  <AlertDialogDescription className="pt-2">
                    Vas a rechazar la sugerencia de limpieza para:
                    <span className="mt-2 block font-medium text-foreground">
                      "{email.subject || 'Sin asunto'}"
                    </span>
                    <span className="mt-2 block">
                      Este correo se quedara en tu inbox y no se volvera a sugerir.
                    </span>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={rejectLoadingId === email.id}>
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={async (event) => {
                        event.preventDefault();
                        if (rejectLoadingId === email.id) {
                          return;
                        }
                        setRejectLoadingId(email.id);
                        setProcessingId(email.id);
                        try {
                          await confirmAction([email.id], 'reject');
                          handleActionSuccess(email.id, 'reject');
                          setRejectOpenId(null);
                        } catch (err) {
                          console.error(err);
                          setFeedback(err.message || '❌ Error al rechazar la sugerencia.');
                          setFeedbackType('error');
                        } finally {
                          setRejectLoadingId(null);
                        }
                      }}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      disabled={rejectLoadingId === email.id}
                    >
                      {rejectLoadingId === email.id ? 'Rechazando...' : 'Si, rechazar'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default SuggestionsList;
