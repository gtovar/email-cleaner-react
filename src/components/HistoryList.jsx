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
      await confirmAction([emailId], action);
      setFeedback(`✅ Acción "${action}" repetida para ${emailId}`);
      setFeedbackType('success');
    } catch (err) {
      console.error(err);
      setFeedback(err.message || '❌ Error al repetir la acción.');
      setFeedbackType('error');
    }
  };

  const canGoPrev = page > 1;
  const canGoNext = history.length === perPage;
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
        <div className="grid gap-3 rounded-xl border bg-card p-4 shadow-sm md:grid-cols-2">
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
              <div className="overflow-hidden rounded-lg border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asunto</TableHead>
                      <TableHead>Accion</TableHead>
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
                                Aceptado
                              </Badge>
                            ) : (
                              <Badge variant="muted" className="gap-1">
                                <X className="h-3 w-3" aria-hidden="true" />
                                Rechazado
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {new Date(item.timestamp).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <button
                              type="button"
                              onClick={() => repeatAction(item.emailId, item.action)}
                              className="rounded border border-input px-3 py-1 text-xs text-foreground hover:bg-muted"
                            >
                              Repetir acción
                            </button>
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
                    <Card key={key} className="p-4">
                      <HistoryItem item={item} />
                      <button
                        type="button"
                        onClick={() => repeatAction(item.emailId, item.action)}
                        className="mt-3 rounded border border-input px-3 py-1 text-xs text-foreground hover:bg-muted"
                      >
                        Repetir acción
                      </button>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!canGoPrev || loading} 
          className="rounded border border-input px-3 py-1 text-sm text-foreground disabled:opacity-50"
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
          className="rounded border border-input px-3 py-1 text-sm text-foreground disabled:opacity-50"
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
