// src/components/HistoryList.jsx
import { useEffect, useMemo, useState } from 'react';
import { Check, Mail, X } from 'lucide-react';
import { getHistory, confirmAction } from '../services/api.js';
import HistoryItem from './HistoryItem.jsx';
import StatusMessage from './StatusMessage.jsx';
import EmptyState from './State/EmptyState.jsx';
import { Badge } from './ui/badge.jsx';
import { Card } from './ui/card.jsx';
import { Input } from './ui/input.jsx';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select.jsx';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table.jsx';

function HistoryList() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [feedbackType, setFeedbackType] = useState(null);
  const [page, setPage] = useState(1);
  const perPage = 20;
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [repeatDialog, setRepeatDialog] = useState({ open: false, emailId: null, action: null, subject: null });
  const [repeatLoading, setRepeatLoading] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return true;
    }
    return window.matchMedia('(min-width: 768px)').matches;
  });

  useEffect(() => {
    async function loadHistory() {
      setLoading(true);
      setFeedback(null);

      try {
        const data = await getHistory(page, perPage);
        setHistory(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setFeedback(err.message || '❌ Error al cargar el historial desde el backend.');
        setFeedbackType('error');
        setHistory([]);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, [page]);

  useEffect(() => {
    if (!window.matchMedia) return;
    const media = window.matchMedia('(min-width: 768px)');
    const handleChange = (event) => setIsDesktop(event.matches);
    if (media.addEventListener) {
      media.addEventListener('change', handleChange);
    } else {
      media.addListener(handleChange);
    }
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', handleChange);
      } else {
        media.removeListener(handleChange);
      }
    };
  }, []);

  const repeatAction = async (emailId, action) => {
    try {
      setFeedback(null);
      setRepeatLoading(true);
      await confirmAction([emailId], action);
      const actionLabel =
        action === 'accept' ? 'Aceptar sugerencia' : action === 'reject' ? 'Descartar sugerencia' : action;
      setFeedback(`✅ Se volvió a aplicar "${actionLabel}" para ${emailId}.`);
      setFeedbackType('success');
    } catch (err) {
      console.error(err);
      setFeedback(err.message || '❌ Error al repetir la acción.');
      setFeedbackType('error');
    } finally {
      setRepeatLoading(false);
      setRepeatDialog({ open: false, emailId: null, action: null, subject: null });
    }
  };

  const getActionLabel = (action) => {
    if (action === 'accept') return 'Aceptada';
    if (action === 'reject') return 'Descartada';
    if (action === 'archive') return 'Archivada manualmente';
    if (action === 'delete') return 'Eliminada manualmente';
    if (action === 'mark_unread') return 'Marcada para revisar';
    if (action === 'review') return 'Enviada a revision especializada';
    return action;
  };

  const getRepeatActionLabel = (action) => {
    if (action === 'accept') return 'Volver a aplicar aceptación';
    if (action === 'reject') return 'Volver a aplicar descarte';
    return 'Volver a aplicar';
  };

  const isRepeatableAction = (action) => action === 'accept' || action === 'reject';

  const canGoPrev = page > 1;
  const canGoNext = history.length === perPage;
  const acceptedCount = history.filter((item) => item.action === 'accept').length;
  const rejectedCount = history.filter((item) => item.action === 'reject').length;
  const filteredHistory = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return history.filter((item) => {
      const matchesStatus =
        statusFilter === 'all' || item.action === statusFilter;
      const target = `${item.emailId || ''} ${item.subject || ''}`.toLowerCase();
      const matchesSearch = query.length === 0 || target.includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [history, searchQuery, statusFilter]);

  return (
    <div className="space-y-4">

      <StatusMessage
      message={feedback}
      type={feedbackType || 'info'}
      />


      {loading && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <Card key={`history-loading-${index}`} className="p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-8 w-28 rounded-md" />
                </div>
              </Card>
            ))}
          </div>
      )}

      {!loading && history.length > 0 && (
        <>
        <div className="grid gap-3 md:grid-cols-3">
          <Card className="border-border/70 bg-card/90 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Registros visibles
            </p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{history.length}</p>
          </Card>
          <Card className="border-border/70 bg-emerald-500/[0.06] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Guiadas aceptadas
            </p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{acceptedCount}</p>
          </Card>
          <Card className="border-border/70 bg-amber-500/[0.07] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Guiadas descartadas
            </p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{rejectedCount}</p>
          </Card>
        </div>
        <div className="rounded-xl border border-border/70 bg-muted/25 p-3 text-sm text-muted-foreground">
          Este historial muestra decisiones guiadas recientes. Las tarjetas de aceptadas y descartadas solo cuentan respuestas sobre sugerencias.
        </div>
        <div className="grid gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-sm md:grid-cols-2">
          <label className="text-sm font-medium text-foreground">
            Buscar
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Buscar por email o asunto"
              className="mt-2"
            />
          </label>
          <div className="text-sm font-medium text-foreground">
            Estado
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Selecciona estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="accept">Aceptados</SelectItem>
                <SelectItem value="reject">Rechazados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        </>
      )}

      {!loading && history.length === 0 && (
        <EmptyState type="history" />
      )}

      {!loading && history.length > 0 && filteredHistory.length === 0 && (
        <div className="rounded-xl border bg-card p-4 text-sm text-muted-foreground">
          No hay resultados para los filtros actuales.
        </div>
      )}

      {filteredHistory.length > 0 && (
          <>
          <div className="space-y-3">
            {isDesktop && (
              <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
                <Table>
                  <TableHeader className="bg-muted/[0.3]">
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Asunto</TableHead>
                      <TableHead>Acción</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead className="text-right">Repetir</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredHistory.map((item) => {
                      const key = `${item.emailId}-${item.timestamp}`;
                      return (
                        <TableRow key={key}>
                          <TableCell>
                            <div className="flex items-center gap-3 min-w-0">
                              <Mail className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden="true" />
                              <div className="min-w-0">
                                <div className="truncate text-sm font-medium text-foreground">
                                  {item.subject || item.emailId}
                                </div>
                                {item.subject && (
                                  <div className="text-xs text-muted-foreground truncate">
                                    {item.emailId}
                                  </div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {item.action === 'accept' ? (
                              <Badge variant="success" className="gap-1">
                                <Check className="h-3 w-3" aria-hidden="true" />
                                {getActionLabel(item.action)}
                              </Badge>
                            ) : (
                              <Badge variant="muted" className="gap-1">
                                <X className="h-3 w-3" aria-hidden="true" />
                                {getActionLabel(item.action)}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {new Date(item.timestamp).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            {isRepeatableAction(item.action) ? (
                              <AlertDialog
                                open={repeatDialog.open && repeatDialog.emailId === item.emailId}
                                onOpenChange={(open) => {
                                  if (!repeatLoading) {
                                    setRepeatDialog(
                                      open
                                        ? {
                                            open: true,
                                            emailId: item.emailId,
                                            action: item.action,
                                            subject: item.subject || item.emailId,
                                          }
                                        : { open: false, emailId: null, action: null, subject: null }
                                    );
                                  }
                                }}
                              >
                                <AlertDialogTrigger asChild>
                                  <button
                                    type="button"
                                    className="rounded-full border border-border/70 bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                                  >
                                    {getRepeatActionLabel(item.action)}
                                  </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>¿Volver a aplicar esta decisión?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Vas a repetir la decisión registrada para:
                                      <span className="mt-2 block font-medium text-foreground">
                                        "{item.subject || item.emailId}"
                                      </span>
                                      <span className="mt-2 block">
                                        Esto volverá a enviar la acción "{getActionLabel(item.action).toLowerCase()}" sobre este correo.
                                      </span>
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel disabled={repeatLoading}>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      disabled={repeatLoading}
                                      onClick={(event) => {
                                        event.preventDefault();
                                        void repeatAction(item.emailId, item.action);
                                      }}
                                    >
                                      {repeatLoading ? 'Aplicando...' : getRepeatActionLabel(item.action)}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                Solo referencia
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}

            {!isDesktop && (
              <div className="space-y-3">
                {filteredHistory.map((item) => {
                  const key = `${item.emailId}-${item.timestamp}`;
                  return (
                    <Card key={key} className="border-border/70 p-4 shadow-sm">
                      <HistoryItem item={item} />
                      {isRepeatableAction(item.action) ? (
                        <AlertDialog
                          open={repeatDialog.open && repeatDialog.emailId === item.emailId}
                          onOpenChange={(open) => {
                            if (!repeatLoading) {
                              setRepeatDialog(
                                open
                                  ? {
                                      open: true,
                                      emailId: item.emailId,
                                      action: item.action,
                                      subject: item.subject || item.emailId,
                                    }
                                  : { open: false, emailId: null, action: null, subject: null }
                              );
                            }
                          }}
                        >
                          <AlertDialogTrigger asChild>
                            <button
                              type="button"
                              className="mt-3 rounded-full border border-border/70 bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                            >
                              {getRepeatActionLabel(item.action)}
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Volver a aplicar esta decisión?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Vas a repetir la decisión registrada para:
                                <span className="mt-2 block font-medium text-foreground">
                                  "{item.subject || item.emailId}"
                                </span>
                                <span className="mt-2 block">
                                  Esto volverá a enviar la acción "{getActionLabel(item.action).toLowerCase()}" sobre este correo.
                                </span>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel disabled={repeatLoading}>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                disabled={repeatLoading}
                                onClick={(event) => {
                                  event.preventDefault();
                                  void repeatAction(item.emailId, item.action);
                                }}
                              >
                                {repeatLoading ? 'Aplicando...' : getRepeatActionLabel(item.action)}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      ) : (
                        <p className="mt-3 text-xs text-muted-foreground">Solo referencia</p>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between rounded-2xl border border-border/70 bg-card px-4 py-3">
            <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!canGoPrev || loading} 
          className="rounded-full border border-border/70 px-3 py-1.5 text-sm font-medium text-foreground disabled:opacity-50"
          >
          Página anterior
          </button>

          <span className="text-sm text-muted-foreground">Página {page}</span>

          <button
          type="button"
          onClick={() => {
              if (canGoNext) { 
                  setPage((p) => p + 1);
              }
          }}
          disabled={!canGoNext || loading}
          className="rounded-full border border-border/70 px-3 py-1.5 text-sm font-medium text-foreground disabled:opacity-50"
          >
          Página siguiente
          </button>
          </div>
          </>
      )}
    </div>
  );
}

export default HistoryList;
