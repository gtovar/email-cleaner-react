import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Archive, Mail, MoreHorizontal, Trash2, Circle, X } from 'lucide-react';
import { getEmails } from '../services/api.js';
import { Input } from './ui/input.jsx';
import { Badge } from './ui/badge.jsx';
import { Card } from './ui/card.jsx';
import { Skeleton } from './ui/skeleton.jsx';
import { Button } from './ui/button.jsx';
import EmptyState from './State/EmptyState.jsx';
import { ScrollArea } from './ui/scroll-area.jsx';
import { Separator } from './ui/separator.jsx';
import { Sheet, SheetClose, SheetContent } from './ui/sheet.jsx';
import * as DialogPrimitive from '@radix-ui/react-dialog';

const formatDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('es-MX', {
    month: 'short',
    day: 'numeric',
  }).format(date);
};

const formatFullDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
};

const parseFrom = (value) => {
  if (!value) return { name: 'Sin remitente', email: '' };
  const match = value.match(/^(.*)<([^>]+)>/);
  if (match) {
    return {
      name: match[1].trim() || match[2].trim(),
      email: match[2].trim(),
    };
  }
  return { name: value.trim(), email: '' };
};

export default function InboxList() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(null);
  const [query, setQuery] = useState('');
  const [nextPageToken, setNextPageToken] = useState(null);
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [selectedEmailId, setSelectedEmailId] = useState(null);
  const [mobileActionsId, setMobileActionsId] = useState(null);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(max-width: 1023px)').matches
      : false
  );
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const mobileButtonRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const loadAll = async () => {
      setLoading(true);
      setError(null);
      setEmails([]);
      setTotal(null);
      setNextPageToken(null);
      setSelectedIds(new Set());
      setSelectedEmailId(null);

      try {
        const data = await getEmails();
        if (cancelled) return;
        setEmails(data.emails || []);
        if (typeof data.total === 'number') {
          setTotal(data.total);
        }
        setNextPageToken(data.nextPageToken);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Error al cargar los correos.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadAll();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!mobileActionsId) return;
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        mobileButtonRef.current &&
        !mobileButtonRef.current.contains(event.target)
      ) {
        setMobileActionsId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileActionsId]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const media = window.matchMedia('(max-width: 1023px)');
    const handleChange = (event) => setIsMobile(event.matches);
    setIsMobile(media.matches);
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

  const handleLoadMore = async () => {
    if (!nextPageToken || loadingMore) return;
    setLoadingMore(true);
    try {
      const data = await getEmails({ pageToken: nextPageToken });
      setEmails((prev) => prev.concat(data.emails || []));
      if (typeof data.total === 'number') {
        setTotal(data.total);
      }
      setNextPageToken(data.nextPageToken);
    } catch (err) {
      setError(err.message || 'Error al cargar más correos.');
    } finally {
      setLoadingMore(false);
    }
  };

  const filteredEmails = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return emails;
    return emails.filter((email) => {
      const target = `${email.from || ''} ${email.subject || ''} ${email.snippet || ''}`.toLowerCase();
      return target.includes(needle);
    });
  }, [emails, query]);

  const selectedCount = selectedIds.size;

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredEmails.length) {
      setSelectedIds(new Set());
      return;
    }
    setSelectedIds(new Set(filteredEmails.map((email) => email.id)));
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectEmail = (email) => {
    setEmails((prev) =>
      prev.map((item) => (item.id === email.id ? { ...item, isRead: true } : item))
    );
    setSelectedEmailId(email.id);
    if (isMobile) {
      setIsMobileOpen(true);
    }
  };

  const selectedEmail = useMemo(
    () => emails.find((email) => email.id === selectedEmailId) || null,
    [emails, selectedEmailId]
  );
  const panelKey = selectedEmailId || 'empty';

  if (loading && emails.length === 0) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={`inbox-loading-${index}`} className="p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-4 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-3 w-14" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!loading && error) {
    return <Card className="p-4 text-sm text-destructive">{error}</Card>;
  }

  if (!loading && !error && emails.length === 0) {
    return <EmptyState type="inbox" />;
  }

  const readingPanel = selectedEmail ? (
    <>
      <div className="border-b p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="mb-3 text-xl font-semibold">
              {selectedEmail.subject || '(Sin asunto)'}
            </h2>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <span className="text-sm font-medium text-primary">
                  {parseFrom(selectedEmail.from).name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium">{parseFrom(selectedEmail.from).name}</p>
                {parseFrom(selectedEmail.from).email ? (
                  <p className="text-sm text-muted-foreground">
                    {parseFrom(selectedEmail.from).email}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">
              {formatFullDate(selectedEmail.date)}
            </p>
            <Badge variant="secondary" className="mt-2 text-xs">
              Read-only
            </Badge>
            {selectedEmail.hasSuggestion && !selectedEmail.reviewStatus ? (
              <Badge variant="secondary" className="mt-2 text-xs">
                Pending review in Suggestions
              </Badge>
            ) : null}
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6">
          <div className="text-sm leading-relaxed text-foreground">
            {selectedEmail.snippet || 'Sin vista previa disponible.'}
          </div>
        </div>
      </ScrollArea>

      <Separator />
      <div className="bg-muted/30 p-4 text-center">
        <p className="text-sm text-muted-foreground">
          This is a read-only view.{' '}
          <a className="text-primary hover:underline font-medium" href="#">
            Go to Suggestions
          </a>{' '}
          to take action on emails.
        </p>
      </div>
    </>
  ) : (
    <div className="flex flex-1 items-center justify-center p-6 text-center">
      <div className="max-w-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <ArrowLeft className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mb-2 font-medium">Select an email to read</h3>
        <p className="text-sm text-muted-foreground">
          Choose an email from the list to view its full content.
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            aria-label="Seleccionar todos"
            checked={filteredEmails.length > 0 && selectedIds.size === filteredEmails.length}
            onChange={toggleSelectAll}
            className="h-4 w-4 rounded border-input"
          />
          <span>
            {total ? `${filteredEmails.length} de ${total}` : `${filteredEmails.length}`} correos
          </span>
        </div>
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar por remitente o asunto"
          className="w-full sm:max-w-xs"
        />
      </div>

      {selectedCount > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-3 py-2 text-sm">
          <span className="text-muted-foreground">
            {selectedCount} seleccionado{selectedCount > 1 ? 's' : ''}
          </span>
          <div className="hidden items-center gap-2 sm:flex">
            <Button type="button" variant="outline" size="sm">
              Archivar
            </Button>
            <Button type="button" variant="outline" size="sm">
              Marcar no leído
            </Button>
            <Button type="button" variant="destructive" size="sm">
              Eliminar
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setSelectedIds(new Set())}
            >
              Limpiar
            </Button>
          </div>
          <div className="flex items-center gap-2 sm:hidden">
            <Button type="button" variant="outline" size="icon" aria-label="Archivar">
              <Archive className="h-4 w-4" />
            </Button>
            <Button type="button" variant="outline" size="icon" aria-label="Marcar no leído">
              <Mail className="h-4 w-4" />
            </Button>
            <Button type="button" variant="destructive" size="icon" aria-label="Eliminar">
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Limpiar selección"
              onClick={() => setSelectedIds(new Set())}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 lg:h-[calc(100vh-14rem)] lg:flex-row">
        <Card className="flex h-full flex-col overflow-hidden lg:w-[40%]">
          <div className="border-b bg-muted/30 p-3">
            <span className="text-sm text-muted-foreground">
              Vista de lectura (sin acciones directas)
            </span>
          </div>
          <ScrollArea className="flex-1">
            <div className="divide-y">
              {filteredEmails.map((email) => {
                const from = parseFrom(email.from);
                const preview = email.snippet || 'Sin vista previa disponible.';
                const isSelected = selectedEmailId === email.id;
                const isChecked = selectedIds.has(email.id);

                return (
                  <div
                    key={email.id}
                    onClick={() => handleSelectEmail(email)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        handleSelectEmail(email);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    className={[
                      'group w-full text-left transition-colors focus:outline-none',
                      'hover:bg-muted/50 focus:bg-muted/50',
                      isSelected ? 'bg-primary/5 border-l-2 border-l-primary' : '',
                      !email.isRead ? 'bg-muted/20' : '',
                    ].join(' ')}
                  >
                    <div className="flex items-start gap-3 p-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          aria-label="Seleccionar correo"
                          checked={isChecked}
                          onChange={(event) => {
                            event.stopPropagation();
                            toggleSelectOne(email.id);
                          }}
                          onClick={(event) => event.stopPropagation()}
                          className="h-4 w-4 rounded border-input"
                        />
                        <div className="mt-1.5 flex-shrink-0">
                          {!email.isRead ? (
                            <Circle className="h-2 w-2 fill-primary text-primary" />
                          ) : (
                            <div className="h-2 w-2" />
                          )}
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center justify-between gap-2">
                          <span
                            className={`truncate text-sm ${
                              !email.isRead ? 'font-semibold text-foreground' : 'font-medium'
                            }`}
                          >
                            {from.name}
                          </span>
                          <span className="flex-shrink-0 text-xs text-muted-foreground">
                            {formatDate(email.date)}
                          </span>
                        </div>
                        <p
                          className={`truncate text-sm ${
                            !email.isRead ? 'font-medium' : 'text-foreground'
                          }`}
                        >
                          {email.subject || '(Sin asunto)'}
                        </p>
                        <p className="mt-1 truncate text-xs text-muted-foreground">{preview}</p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {email.hasSuggestion && !email.reviewStatus && (
                            <Badge variant="secondary" className="text-[10px]">
                              Has suggestion
                            </Badge>
                          )}
                          {email.reviewStatus === 'accepted' && (
                            <Badge variant="outline" className="text-[10px]">
                              Accepted
                            </Badge>
                          )}
                          {email.reviewStatus === 'rejected' && (
                            <Badge variant="outline" className="text-[10px]">
                              Kept
                            </Badge>
                          )}
                          {email.labels?.slice(0, 2).map((label) => (
                            <Badge key={label} variant="secondary" className="text-[10px]">
                              {label}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="hidden items-center gap-2 text-muted-foreground sm:flex">
                        <Button type="button" variant="ghost" size="icon" aria-label="Archivar">
                          <Archive className="h-4 w-4" aria-hidden="true" />
                        </Button>
                        <Button type="button" variant="ghost" size="icon" aria-label="Marcar no leído">
                          <Mail className="h-4 w-4" aria-hidden="true" />
                        </Button>
                        <Button type="button" variant="ghost" size="icon" aria-label="Eliminar">
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </div>

                      <div className="relative sm:hidden">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label="Mostrar acciones"
                          ref={mobileButtonRef}
                          onClick={(event) => {
                            event.stopPropagation();
                            setMobileActionsId((current) => (current === email.id ? null : email.id));
                          }}
                        >
                          <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                        </Button>
                        {mobileActionsId === email.id && (
                          <div
                            ref={mobileMenuRef}
                            className="absolute right-0 top-9 z-10 w-40 rounded-md border bg-card p-2 shadow-lg"
                          >
                            <button
                              type="button"
                              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                              onClick={() => setMobileActionsId(null)}
                            >
                              <Archive className="h-4 w-4" aria-hidden="true" />
                              Archivar
                            </button>
                            <button
                              type="button"
                              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                              onClick={() => setMobileActionsId(null)}
                            >
                              <Mail className="h-4 w-4" aria-hidden="true" />
                              Marcar no leído
                            </button>
                            <button
                              type="button"
                              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-destructive hover:bg-muted"
                              onClick={() => setMobileActionsId(null)}
                            >
                              <Trash2 className="h-4 w-4" aria-hidden="true" />
                              Eliminar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </Card>

        <Card className="hidden h-full flex-col overflow-hidden lg:flex lg:flex-1">
          <div key={panelKey} className="inbox-panel-enter flex h-full flex-col">
            {readingPanel}
          </div>
        </Card>
      </div>

      {isMobile && (
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetContent className="w-full max-w-full">
            <DialogPrimitive.Title className="sr-only">
              Email preview
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="sr-only">
              Read-only email view
            </DialogPrimitive.Description>
            <div className="flex items-center justify-between border-b px-4 py-3">
              <SheetClose asChild>
                <Button type="button" variant="ghost" size="sm">
                  Back
                </Button>
              </SheetClose>
              <span className="text-sm font-medium">Inbox</span>
              <div className="w-12" />
            </div>
            <div className="flex h-full flex-col">
              <div key={panelKey} className="inbox-panel-enter flex h-full flex-col">
                {readingPanel}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}

      {!loading && !error && nextPageToken && (
        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={handleLoadMore}
            disabled={loadingMore}
          >
            {loadingMore
              ? 'Cargando...'
              : `Cargar más${typeof total === 'number' ? ` (${Math.max(total - emails.length, 0)})` : ''}`}
          </Button>
        </div>
      )}
    </div>
  );
}
