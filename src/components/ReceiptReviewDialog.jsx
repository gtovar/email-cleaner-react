import { forwardRef, useEffect, useId, useMemo, useRef, useState } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Button } from './ui/button.jsx';
import { Input } from './ui/input.jsx';
import { Label } from './ui/label.jsx';
import { getEmailContent, extractReceipt, sendReceiptWhatsApp } from '../services/api.js';

function DialogOverlay(props) {
  return (
    <DialogPrimitive.Overlay
      className="fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out"
      {...props}
    />
  );
}

const DialogContent = forwardRef(function DialogContent({ children, ...props }, ref) {
  return (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-card p-6 shadow-lg focus:outline-none"
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
});

const formatAmount = (amount) => {
  if (amount == null || amount === '') return 'No disponible';

  const value = typeof amount === 'number' ? amount : Number(amount);
  if (!Number.isFinite(value)) return 'No disponible';

  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(value);
};

export default function ReceiptReviewDialog({ open, emailId, onOpenChange }) {
  const phoneInputId = useId();
  const descriptionId = useId();
  const activeRequestIdRef = useRef(0);
  const latestOpenRef = useRef(open);
  const latestEmailIdRef = useRef(emailId);
  const [contentLoading, setContentLoading] = useState(false);
  const [contentError, setContentError] = useState('');
  const [emailContent, setEmailContent] = useState(null);
  const [extractionLoading, setExtractionLoading] = useState(false);
  const [extractionError, setExtractionError] = useState('');
  const [extractionResult, setExtractionResult] = useState(null);
  const [phone, setPhone] = useState('');
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const [sendError, setSendError] = useState('');
  const [sendSuccess, setSendSuccess] = useState('');

  const hasExtractionData = useMemo(
    () =>
      extractionResult?.amount !== null &&
      extractionResult?.amount !== undefined &&
      extractionResult?.due_date !== null &&
      extractionResult?.due_date !== undefined,
    [extractionResult]
  );

  const hasPhone = phone.trim().length > 0;
  const canSend =
    open &&
    !contentLoading &&
    !extractionLoading &&
    !sendLoading &&
    !contentError &&
    !extractionError &&
    !sendSuccess &&
    hasExtractionData &&
    hasPhone;

  const resetDialogState = () => {
    setContentLoading(false);
    setContentError('');
    setEmailContent(null);
    setExtractionLoading(false);
    setExtractionError('');
    setExtractionResult(null);
    setPhone('');
    setPhoneTouched(false);
    setSendLoading(false);
    setSendError('');
    setSendSuccess('');
  };

  const isActiveRequest = (requestId, targetEmailId) =>
    activeRequestIdRef.current === requestId &&
    latestOpenRef.current &&
    latestEmailIdRef.current === targetEmailId;

  useEffect(() => {
    latestOpenRef.current = open;
    latestEmailIdRef.current = emailId;

    if (!open || !emailId) {
      activeRequestIdRef.current += 1;
    }
  }, [open, emailId]);

  useEffect(() => {
    if (!open || !emailId) {
      resetDialogState();
      return;
    }

    const requestId = ++activeRequestIdRef.current;
    const targetEmailId = emailId;

    const loadReceiptData = async () => {
      let phase = 'content';

      setContentLoading(true);
      setContentError('');
      setEmailContent(null);
      setExtractionLoading(false);
      setExtractionError('');
      setExtractionResult(null);
      setSendError('');
      setSendSuccess('');

      try {
        const content = await getEmailContent(targetEmailId);
        if (!isActiveRequest(requestId, targetEmailId)) return;

        setEmailContent(content);
        setContentLoading(false);

        setExtractionLoading(true);
        phase = 'extraction';
        const extraction = await extractReceipt({
          subject: content.subject,
          body: content.body,
          html: content.html,
        });
        if (!isActiveRequest(requestId, targetEmailId)) return;

        setExtractionResult(extraction);
      } catch (error) {
        if (!isActiveRequest(requestId, targetEmailId)) return;

        if (phase === 'content') {
          setContentError(error.message || 'No se pudo cargar el contenido del correo.');
        } else {
          setExtractionError(error.message || 'No se pudo extraer la informacion del recibo.');
        }
      } finally {
        if (isActiveRequest(requestId, targetEmailId)) {
          setContentLoading(false);
          setExtractionLoading(false);
        }
      }
    };

    void loadReceiptData();

  }, [open, emailId]);

  const handleRetryLoad = async () => {
    if (!emailId) return;

    const requestId = ++activeRequestIdRef.current;
    const targetEmailId = emailId;
    let phase = 'content';

    setContentError('');
    setExtractionError('');
    setSendError('');
    setSendSuccess('');
    setContentLoading(true);
    setEmailContent(null);
    setExtractionResult(null);

    try {
      const content = await getEmailContent(targetEmailId);
      if (!isActiveRequest(requestId, targetEmailId)) return;

      setEmailContent(content);
      setContentLoading(false);

      setExtractionLoading(true);
      phase = 'extraction';
      const extraction = await extractReceipt({
        subject: content.subject,
        body: content.body,
        html: content.html,
      });
      if (!isActiveRequest(requestId, targetEmailId)) return;

      setExtractionResult(extraction);
    } catch (error) {
      if (!isActiveRequest(requestId, targetEmailId)) return;

      if (phase === 'content') {
        setContentError(error.message || 'No se pudo cargar el contenido del correo.');
      } else {
        setExtractionError(error.message || 'No se pudo extraer la informacion del recibo.');
      }
    } finally {
      if (isActiveRequest(requestId, targetEmailId)) {
        setContentLoading(false);
        setExtractionLoading(false);
      }
    }
  };

  const handleSend = async () => {
    setPhoneTouched(true);
    if (!canSend || !emailContent || !extractionResult) return;

    setSendLoading(true);
    setSendError('');
    setSendSuccess('');

    try {
      const result = await sendReceiptWhatsApp({
        emailId: emailContent.id,
        sender: emailContent.from,
        subject: emailContent.subject,
        amount: extractionResult.amount,
        due_date: extractionResult.due_date,
        phone: phone.trim(),
      });

      if (result?.sent) {
        setSendSuccess('Notificacion enviada por WhatsApp.');
        return;
      }

      if (result?.reason === 'provider_error') {
        setSendError('No se pudo enviar la notificacion de WhatsApp. Intenta de nuevo.');
        return;
      }

      if (result?.reason === 'missing_extracted_fields') {
        setSendError('Faltan datos extraidos para enviar la notificacion.');
        return;
      }

      setSendError('No se pudo enviar la notificacion de WhatsApp.');
    } catch (error) {
      setSendError(error.message || 'No se pudo enviar la notificacion de WhatsApp.');
    } finally {
      setSendLoading(false);
    }
  };

  const handleClose = (nextOpen) => {
    if (!nextOpen) {
      resetDialogState();
    }
    onOpenChange(nextOpen);
  };

  const showLoadRetry = Boolean(contentError || extractionError);
  const phoneError = phoneTouched && !hasPhone ? 'El telefono es obligatorio para enviar WhatsApp.' : '';

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleClose}>
      <DialogContent aria-describedby={descriptionId}>
        <div className="space-y-5">
          <div className="space-y-1">
            <DialogPrimitive.Title className="text-lg font-semibold text-foreground">
              Revisar recibo
            </DialogPrimitive.Title>
            <DialogPrimitive.Description id={descriptionId} className="text-sm text-muted-foreground">
              Revisa los datos extraidos, captura el telefono y dispara el WhatsApp manualmente.
            </DialogPrimitive.Description>
          </div>

          {contentLoading || extractionLoading ? (
            <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
              {contentLoading
                ? 'Cargando el contenido completo del correo...'
                : 'Extrayendo monto y fecha limite...'}
            </div>
          ) : null}

          {contentError ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              {contentError}
            </div>
          ) : null}

          {extractionError ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              {extractionError}
            </div>
          ) : null}

          {emailContent ? (
            <div className="space-y-3 rounded-lg border p-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Asunto</p>
                <p className="text-sm font-medium text-foreground">
                  {emailContent.subject || '(Sin asunto)'}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Remitente</p>
                <p className="text-sm text-foreground">{emailContent.from || 'Sin remitente'}</p>
              </div>
            </div>
          ) : null}

          {extractionResult ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Monto</p>
                <p className="text-base font-semibold text-foreground">
                  {formatAmount(extractionResult.amount)}
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Fecha limite</p>
                <p className="text-base font-semibold text-foreground">
                  {extractionResult.due_date || 'No disponible'}
                </p>
              </div>
            </div>
          ) : null}

          {extractionResult && !hasExtractionData ? (
            <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
              El recibo no esta listo para envio porque falta monto o fecha limite.
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor={phoneInputId}>Telefono WhatsApp</Label>
            <Input
              id={phoneInputId}
              type="tel"
              value={phone}
              placeholder="+52 81 1234 5678"
              onChange={(event) => setPhone(event.target.value)}
              onBlur={() => setPhoneTouched(true)}
              disabled={contentLoading || extractionLoading || sendLoading || Boolean(sendSuccess)}
            />
            {phoneError ? (
              <p className="text-sm text-destructive">{phoneError}</p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Captura manualmente el telefono para este envio.
              </p>
            )}
          </div>

          {sendError ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              {sendError}
            </div>
          ) : null}

          {sendSuccess ? (
            <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-900">
              {sendSuccess}
            </div>
          ) : null}

          <div className="flex flex-wrap justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => handleClose(false)}>
              {sendSuccess ? 'Cerrar' : 'Cancelar'}
            </Button>

            {showLoadRetry ? (
              <Button type="button" onClick={handleRetryLoad} disabled={contentLoading || extractionLoading}>
                Reintentar carga
              </Button>
            ) : (
              <Button type="button" onClick={handleSend} disabled={!canSend}>
                {sendLoading ? 'Enviando...' : sendError ? 'Reintentar envio' : 'Enviar por WhatsApp'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </DialogPrimitive.Root>
  );
}
