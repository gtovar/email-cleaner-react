import { useEffect, useMemo, useRef, useState } from 'react';
import { Archive, Inbox, Mail, MoreHorizontal, Star, Trash2 } from 'lucide-react';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { getEmails } from '../services/api.js';
import { Input } from './ui/input.jsx';
import { Badge } from './ui/badge.jsx';
import { Card } from './ui/card.jsx';
import { Skeleton } from './ui/skeleton.jsx';
import { Button } from './ui/button.jsx';
import EmptyState from './State/EmptyState.jsx';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table.jsx';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip.jsx';

const formatDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('es-MX', {
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export default function InboxList() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(null);
  const [query, setQuery] = useState('');
  const [nextPageToken, setNextPageToken] = useState(null);
  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [mobileActionsId, setMobileActionsId] = useState(null);
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

      try {
        const data = await getEmails();
        if (cancelled) return;
        setEmails(data.emails);
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

  const handleLoadMore = async () => {
    if (!nextPageToken || loadingMore) return;
    setLoadingMore(true);
    try {
      const data = await getEmails({ pageToken: nextPageToken });
      setEmails((prev) => prev.concat(data.emails));
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

  const columns = useMemo(() => [
    {
      id: 'flag',
      header: ({ table }) => (
        <input
          type="checkbox"
          aria-label="Seleccionar todos"
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
          className="h-4 w-4 rounded border-input"
        />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-muted-foreground">
          <input
            type="checkbox"
            aria-label="Seleccionar correo"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            className="h-4 w-4 rounded border-input"
          />
          <Star className="h-4 w-4" aria-hidden="true" />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'from',
      header: 'Remitente',
      cell: ({ row, getValue }) => (
        <div className="min-w-0 max-w-[220px]">
          <p
            className={`truncate text-sm ${
              row.original.isRead ? 'text-muted-foreground' : 'font-semibold text-foreground'
            }`}
          >
            {getValue() || 'Sin remitente'}
          </p>
        </div>
      ),
    },
    {
      accessorKey: 'subject',
      header: 'Asunto',
      cell: ({ row, getValue }) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="min-w-0 w-full">
                <div className="truncate text-sm">
                  <span className={row.original.isRead ? 'text-muted-foreground' : 'font-medium text-foreground'}>
                    {getValue() || '(Sin asunto)'}
                  </span>
                  <span className="text-muted-foreground">
                    {row.original.snippet ? ` — ${row.original.snippet}` : ' — Sin vista previa disponible.'}
                  </span>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-sm">
              <div className="text-xs text-foreground">
                <div className="font-medium">{getValue() || '(Sin asunto)'}</div>
                <div className="mt-1 text-muted-foreground">
                  {row.original.snippet || 'Sin vista previa disponible.'}
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      id: 'status',
      header: 'Estado',
      cell: ({ row }) =>
        row.original.isRead ? null : <Badge variant="secondary">No leido</Badge>,
      enableSorting: false,
    },
    {
      accessorKey: 'date',
      header: 'Fecha',
      cell: ({ row, getValue }) => (
        <div className="flex items-center justify-end">
          <span className="text-xs text-muted-foreground group-hover:hidden">
            {formatDate(getValue())}
          </span>
          <div className="hidden items-center gap-2 group-hover:flex">
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
              onClick={() => {
                setMobileActionsId((current) => (current === row.id ? null : row.id));
              }}
            >
              <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
            </Button>
            {mobileActionsId === row.id && (
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
      ),
      enableSorting: false,
    },
  ], [mobileActionsId]);

  const table = useReactTable({
    data: filteredEmails,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    state: { sorting, rowSelection },
    enableRowSelection: true,
  });

  const selectedCount = table.getSelectedRowModel().rows.length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Inbox className="h-4 w-4" aria-hidden="true" />
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
          <div className="flex items-center gap-2">
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
              onClick={() => table.resetRowSelection()}
            >
              Limpiar
            </Button>
          </div>
        </div>
      )}

      {loading && emails.length === 0 && (
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
      )}

      {!loading && error && (
        <Card className="p-4 text-sm text-destructive">{error}</Card>
      )}

      {!loading && !error && emails.length === 0 && (
        <EmptyState type="inbox" />
      )}

      {filteredEmails.length > 0 && (
        <div className="overflow-hidden rounded-lg border bg-card">
          <Table className="w-full table-fixed text-sm">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={[
                        header.column.getCanSort() ? 'cursor-pointer select-none' : '',
                        header.column.id === 'flag' ? 'w-16' : '',
                        header.column.id === 'from' ? 'w-48' : '',
                        header.column.id === 'subject' ? 'w-auto' : '',
                        header.column.id === 'status' ? 'w-24' : '',
                        header.column.id === 'date' ? 'w-24' : '',
                      ].filter(Boolean).join(' ')}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() === 'asc' ? ' ↑' : null}
                      {header.column.getIsSorted() === 'desc' ? ' ↓' : null}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="group">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={[
                        'px-3 py-2',
                        cell.column.id === 'flag' ? 'w-16' : '',
                        cell.column.id === 'from' ? 'w-48' : '',
                        cell.column.id === 'subject' ? 'w-auto' : '',
                        cell.column.id === 'status' ? 'w-24' : '',
                        cell.column.id === 'date' ? 'w-24' : '',
                      ].filter(Boolean).join(' ')}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
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
