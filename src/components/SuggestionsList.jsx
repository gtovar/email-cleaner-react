// src/components/SuggestionsList.jsx
import { useEffect, useMemo, useRef, useState } from 'react';
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

function getPrimarySuggestion(email) {
  if (!Array.isArray(email?.suggestions) || email.suggestions.length === 0) {
    return null;
  }

  return email.suggestions[0];
}

function parseSender(fromValue) {
  if (!fromValue || typeof fromValue !== 'string') {
    return 'Remitente desconocido';
  }

  const match = fromValue.match(/^(.*)<(.+)>$/);
  if (match) {
    const name = match[1].trim().replace(/^"|"$/g, '');
    return name || match[2].trim();
  }

  return fromValue;
}

function getSuggestedActionLabel(email) {
  const suggestion = getPrimarySuggestion(email);
  const action = suggestion?.action;

  if (action === 'archive') return 'Archivar';
  if (action === 'delete') return 'Eliminar';
  if (action === 'mark_unread') return 'Marcar como no leido';
  if (action === 'review') return 'Revisar con mas detalle';

  return 'Revisar y decidir';
}

function getClassificationLabel(classification) {
  if (!classification) return 'Patron detectado';
  if (classification === 'repeated_low_value') return 'Contenido repetido de bajo valor';
  if (classification === 'stale_promotional_noise') return 'Promocion vieja con poco valor';
  if (classification === 'needs_follow_up') return 'Seguimiento pendiente';
  if (classification === 'receipt_manual_review') return 'Caso especializado de recibo';
  return classification.replaceAll('_', ' ');
}

function getConfidenceData(email) {
  const confidence = getPrimarySuggestion(email)?.confidence_score;

  if (typeof confidence !== 'number') {
    return {
      label: 'Confianza no disponible',
      detail: 'Sin puntaje',
      tone: 'border-border/70 bg-muted/50 text-muted-foreground',
      rank: 1,
    };
  }

  const percent = Math.round(confidence * 100);
  if (confidence >= 0.9) {
    return {
      label: 'Alta confianza',
      detail: `${percent}%`,
      tone: 'border-emerald-200 bg-emerald-50 text-emerald-700',
      rank: 3,
    };
  }
  if (confidence >= 0.75) {
    return {
      label: 'Confianza media',
      detail: `${percent}%`,
      tone: 'border-amber-200 bg-amber-50 text-amber-700',
      rank: 2,
    };
  }
  return {
    label: 'Baja confianza',
    detail: `${percent}%`,
    tone: 'border-rose-200 bg-rose-50 text-rose-700',
    rank: 1,
  };
}

function getSensitivityData(email) {
  const action = getPrimarySuggestion(email)?.action;

  if (action === 'delete') {
    return {
      label: 'Alta sensibilidad',
      detail: 'Accion destructiva',
      tone: 'border-rose-200 bg-rose-50 text-rose-700',
      rank: 3,
    };
  }
  if (action === 'review') {
    return {
      label: 'Alta supervision',
      detail: 'Requiere contexto humano',
      tone: 'border-violet-200 bg-violet-50 text-violet-700',
      rank: 3,
    };
  }
  if (action === 'mark_unread') {
    return {
      label: 'Sensibilidad media',
      detail: 'Mantener visible',
      tone: 'border-amber-200 bg-amber-50 text-amber-700',
      rank: 2,
    };
  }
  return {
    label: 'Baja sensibilidad',
    detail: 'Limpieza reversible',
    tone: 'border-slate-200 bg-slate-50 text-slate-700',
    rank: 1,
  };
}

function getPriorityData(email) {
  const action = getPrimarySuggestion(email)?.action;
  const classification = getPrimarySuggestion(email)?.classification;

  if (classification === 'receipt_manual_review' || action === 'review') {
    return {
      label: 'Alta prioridad',
      detail: 'Necesita revision humana',
      tone: 'border-violet-200 bg-violet-50 text-violet-700',
      rank: 4,
    };
  }
  if (classification === 'needs_follow_up' || action === 'mark_unread') {
    return {
      label: 'Prioridad media',
      detail: 'Conviene mantenerlo visible',
      tone: 'border-amber-200 bg-amber-50 text-amber-700',
      rank: 3,
    };
  }
  if (action === 'delete') {
    return {
      label: 'Prioridad media',
      detail: 'Revisa antes de eliminar',
      tone: 'border-rose-200 bg-rose-50 text-rose-700',
      rank: 2,
    };
  }
  return {
    label: 'Baja prioridad',
    detail: 'Limpieza ligera',
    tone: 'border-slate-200 bg-slate-50 text-slate-700',
    rank: 1,
  };
}

function getReasonText(email) {
  const suggestion = getPrimarySuggestion(email);

  if (typeof suggestion === 'string' && suggestion.trim()) {
    return suggestion.trim();
  }

  if (suggestion?.reason) return suggestion.reason;
  if (suggestion?.summary) return suggestion.summary;
  if (email?.snippet) return email.snippet;

  return 'La sugerencia se genero a partir del patron detectado para este correo.';
}

function getConsequenceText(email) {
  const suggestion = getPrimarySuggestion(email);
  const action = suggestion?.action;

  if (action === 'archive') {
    return 'Si apruebas, este correo se archivara y quedara registrado.';
  }

  if (action === 'delete') {
    return 'Si apruebas, este correo se eliminara y quedara registrado.';
  }

  if (action === 'mark_unread') {
    return 'Si apruebas, este correo se marcara como no leido y quedara registrado.';
  }

  return 'Si apruebas, se aplicara la accion sugerida y quedara registrada.';
}

function sortEmailsForReview(emails) {
  return [...emails].sort((left, right) => {
    const priorityDiff = getPriorityData(right).rank - getPriorityData(left).rank;
    if (priorityDiff !== 0) return priorityDiff;

    const sensitivityDiff = getSensitivityData(right).rank - getSensitivityData(left).rank;
    if (sensitivityDiff !== 0) return sensitivityDiff;

    const confidenceDiff = getConfidenceData(right).rank - getConfidenceData(left).rank;
    if (confidenceDiff !== 0) return confidenceDiff;

    return 0;
  });
}

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
  const [expandedId, setExpandedId] = useState(null);
  const [ariaMessage, setAriaMessage] = useState('');
  const removalTimersRef = useRef(new Map());

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
    const pendingTimers = removalTimersRef.current;
    const existingTimer = pendingTimers.get(emailId);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }
    setFeedback(null);
    setFeedbackType(null);
    setAriaMessage(feedbackMessage);
    if (removedEmail) {
      toast(feedbackMessage, {
        duration: 3000,
        action: {
          label: 'Deshacer',
          onClick: () => {
            const activeTimer = pendingTimers.get(emailId);
            if (activeTimer) {
              clearTimeout(activeTimer);
            }
            pendingTimers.delete(emailId);
            setProcessingId((current) => (current === emailId ? null : current));
            setEmails((prev) => {
              if (prev.some((email) => email.id === emailId)) {
                return prev;
              }
              return [removedEmail, ...prev];
            });
          },
        },
      });
    }
    const removalTimer = setTimeout(() => {
      setEmails((prev) => prev.filter((email) => email.id !== emailId));
      setProcessingId((current) => (current === emailId ? null : current));
      pendingTimers.delete(emailId);
    }, 1200);
    pendingTimers.set(emailId, removalTimer);
  };

  const reviewedCount = Math.max(0, initialCount - emails.length);
  const progressPercent = initialCount ? Math.round((reviewedCount / initialCount) * 100) : 0;
  const orderedEmails = useMemo(() => sortEmailsForReview(emails), [emails]);

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
      <div className="rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm backdrop-blur sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/80">
              Decisiones guiadas
            </p>
            <p className="text-sm text-muted-foreground">
              Empieza aqui para limpiar mas rapido. Usa Inbox solo cuando necesites mas evidencia.
            </p>
          </div>
          <Button
            type="button"
            variant={compactView ? 'default' : 'ghost'}
            size="sm"
            className="rounded-full px-4"
            onClick={() => setCompactView((prev) => !prev)}
          >
            Vista compacta
          </Button>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span>{reviewedCount} de {initialCount} revisados</span>
            <span>{progressPercent}% completado</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        <div className="mt-4 rounded-2xl border border-border/70 bg-muted/35 px-4 py-3 text-sm text-muted-foreground">
          Si una tarjeta no te da suficiente confianza, abre el mismo correo en Inbox para ver
          el contexto completo antes de decidir.
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded-full bg-muted px-2.5 py-1">Ordenadas por prioridad de revision</span>
          <span className="rounded-full bg-muted px-2.5 py-1">Confianza y sensibilidad visibles</span>
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
        {orderedEmails.map((email) => (
          (() => {
            const sender = parseSender(email.from);
            const actionLabel = getSuggestedActionLabel(email);
            const reasonText = getReasonText(email);
            const consequenceText = getConsequenceText(email);
            const hasExtraContext = Boolean(email.snippet) || Boolean(getPrimarySuggestion(email));
            const isExpanded = expandedId === email.id;
            const suggestion = getPrimarySuggestion(email);
            const confidence = getConfidenceData(email);
            const sensitivity = getSensitivityData(email);
            const priority = getPriorityData(email);
            const classificationLabel = getClassificationLabel(suggestion?.classification);

            return (
            <Card
              key={email.id}
              className="overflow-hidden border-border/70 bg-card/95 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg"
            >
            <CardHeader className="p-4 pb-3 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/10 bg-primary/5 shadow-inner">
                    <Mail className="h-5 w-5 text-primary/80" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                      Decision guiada
                    </p>
                    <p className="font-medium leading-snug truncate" title={sender}>
                      {sender}
                    </p>
                    <p
                      className="text-sm text-muted-foreground line-clamp-2 break-words sm:truncate"
                      title={email.subject}
                    >
                      {email.subject || '(Sin asunto)'}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="shrink-0 self-start rounded-full border border-border/60 bg-muted/60 px-2.5 py-1 text-[11px] font-semibold sm:self-auto">
                  {priority.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 pb-4 sm:p-6 sm:pt-0">
              {!compactView && (
                <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  {formatDate(email.date) && (
                    <span className="rounded-full bg-muted px-2.5 py-1">{formatDate(email.date)}</span>
                  )}
                  <span className={`rounded-full border px-2.5 py-1 font-medium ${priority.tone}`}>
                    {priority.detail}
                  </span>
                  <span className={`rounded-full border px-2.5 py-1 font-medium ${confidence.tone}`}>
                    {confidence.label} · {confidence.detail}
                  </span>
                  <span className={`rounded-full border px-2.5 py-1 font-medium ${sensitivity.tone}`}>
                    {sensitivity.label}
                  </span>
                  {buildTags(email).length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      {buildTags(email).map((tag) => (
                        <Badge key={`${email.id}-${tag}`} variant="outline" className="rounded-full border-border/70">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <div className="space-y-3 text-sm">
                {!compactView && email.snippet && (
                  <div className="rounded-2xl border border-border/60 bg-background p-3.5">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Correo
                    </p>
                    <p className="mt-1 text-foreground/80 line-clamp-3">{email.snippet}</p>
                  </div>
                )}

                <div className="rounded-2xl border border-primary/15 bg-primary/[0.05] p-3.5">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Sugerencia
                  </p>
                  <p className="mt-1 text-base font-semibold text-foreground">{actionLabel}</p>
                </div>

                <div className="rounded-2xl border border-border/60 bg-background p-3.5">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Motivo
                  </p>
                  <p className="mt-1 text-foreground/80 line-clamp-2">{reasonText}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border/60 bg-background p-3.5">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Confianza
                    </p>
                    <p className="mt-1 font-medium text-foreground">{confidence.label}</p>
                    <p className="mt-1 text-muted-foreground">{confidence.detail}</p>
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-background p-3.5">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Sensibilidad
                    </p>
                    <p className="mt-1 font-medium text-foreground">{sensitivity.label}</p>
                    <p className="mt-1 text-muted-foreground">{sensitivity.detail}</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/60 bg-muted/[0.35] p-3.5">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Si apruebas
                  </p>
                  <p className="mt-1 text-muted-foreground">{consequenceText}</p>
                </div>

                {!compactView && hasExtraContext && (
                  <div className="space-y-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto rounded-full px-3 text-primary hover:bg-primary/5 hover:text-primary/80"
                      onClick={() => setExpandedId((current) => (current === email.id ? null : email.id))}
                    >
                      {isExpanded ? 'Ocultar contexto' : 'Ver contexto'}
                    </Button>
                    {isExpanded && (
                      <div className="rounded-2xl border border-border/70 bg-background p-3 text-sm text-muted-foreground shadow-inner">
                        <div className="space-y-3">
                          {email.snippet && (
                            <div>
                              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                Vista previa completa
                              </p>
                              <p className="mt-1 leading-relaxed">{email.snippet}</p>
                            </div>
                          )}
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                Tipo detectado
                              </p>
                              <p className="mt-1 leading-relaxed">{classificationLabel}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                Prioridad de revision
                              </p>
                              <p className="mt-1 leading-relaxed">{priority.label} · {priority.detail}</p>
                            </div>
                          </div>
                          {suggestion && (
                            <div>
                              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                Evidencia del sistema
                              </p>
                              <p className="mt-1 leading-relaxed">{formatSuggestion(suggestion)}</p>
                            </div>
                          )}
                        </div>
                        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                          Si todavia tienes dudas, continua en Inbox para leer este correo con mas detalle
                          antes de aprobar o descartar la sugerencia.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2 border-t border-border/60 bg-muted/[0.22] p-4 pt-4 sm:flex-row sm:p-6 sm:pt-4">
              <ConfirmButton
                emailId={email.id}
                action="accept"
                label={`Aprobar ${actionLabel.toLowerCase()}`}
                onSuccess={handleActionSuccess}
                onStart={() => setProcessingId(email.id)}
                onError={(err) => {
                  setFeedback(err.message || '❌ Error al aceptar la sugerencia.');
                  setFeedbackType('error');
                  setProcessingId((current) => (current === email.id ? null : current));
                }}
                disabled={processingId === email.id || rejectLoadingId === email.id}
                className="h-11 w-full flex-1 gap-2 rounded-xl sm:w-auto"
                icon={<Check className="h-4 w-4" aria-hidden="true" />}
              />
              <AlertDialog
                open={rejectOpenId === email.id}
                onOpenChange={(open) => setRejectOpenId(open ? email.id : null)}
              >
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-11 w-full flex-1 gap-2 rounded-xl border-border/70 bg-background text-muted-foreground hover:text-foreground sm:w-auto"
                    disabled={processingId === email.id || rejectLoadingId === email.id}
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                    No aplicar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                        <AlertTriangle className="h-5 w-5 text-destructive" aria-hidden="true" />
                      </div>
                      <AlertDialogTitle>
                        ¿Descartar esta sugerencia?
                      </AlertDialogTitle>
                    </div>
                  <AlertDialogDescription className="pt-2">
                    Vas a descartar la sugerencia para:
                    <span className="mt-2 block font-medium text-foreground">
                      "{email.subject || 'Sin asunto'}"
                    </span>
                    <span className="mt-2 block">
                      Este correo seguira disponible y esta sugerencia no se volvera a mostrar.
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
                          setProcessingId((current) => (current === email.id ? null : current));
                        }
                      }}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      disabled={rejectLoadingId === email.id}
                    >
                      {rejectLoadingId === email.id ? 'Descartando...' : 'Si, descartar'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
            );
          })()
        ))}
      </div>
    </div>
  );
}

export default SuggestionsList;
