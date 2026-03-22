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

const getSendFeedbackFromResult = (result, phone) => {
  if (result?.sent) {
    return {
      tone: 'success',
      title: 'WhatsApp enviado',
      message: `La notificacion se envio correctamente a ${phone.trim()}. Puedes cerrar este dialogo.`,
    };
  }

  if (result?.reason === 'missing_extracted_fields') {
    return {
      tone: 'error',
      title: 'Error de validacion',
      message: 'Faltan datos extraidos para enviar la notificacion. Revisa monto y fecha limite antes de reintentar.',
    };
  }

  if (result?.reason === 'provider_error') {
    return {
      tone: 'error',
      title: 'Error del backend',
      message: 'El backend no pudo completar el envio de WhatsApp con el proveedor. Intenta de nuevo.',
    };
  }

  return {
    tone: 'error',
    title: 'Error del backend',
    message: 'No se pudo enviar la notificacion de WhatsApp.',
  };
};

const getSendFeedbackFromError = (error) => {
  const message = error?.message || '';

  if (message === 'Network error' || message === 'Timeout') {
    return {
      tone: 'error',
      title: 'Error de red',
      message: 'No hubo respuesta de la red durante el envio. Verifica la conexion e intenta de nuevo.',
    };
  }

  if (message.startsWith('Request failed 4')) {
    return {
      tone: 'error',
      title: 'Error de validacion',
      message: 'El backend rechazo la solicitud. Revisa el telefono y los datos del recibo antes de reintentar.',
    };
  }

  return {
    tone: 'error',
    title: 'Error del backend',
    message: 'El backend no pudo completar el envio de WhatsApp. Intenta de nuevo.',
  };
};

export default function ReceiptReviewDialog({ open, emailId, onOpenChange }) {
  const phoneInputId = useId();
  const activeRequestIdRef = useRef(0);
  const activeSendRequestIdRef = useRef(0);
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
  const [sendFeedback, setSendFeedback] = useState(null);

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
    sendFeedback?.tone !== 'success' &&
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
    setSendFeedback(null);
  };

  const isActiveRequest = (requestId, targetEmailId) =>
    activeRequestIdRef.current === requestId &&
    latestOpenRef.current &&
    latestEmailIdRef.current === targetEmailId;

  const isActiveSendRequest = (requestId, targetEmailId) =>
    activeSendRequestIdRef.current === requestId &&
    latestOpenRef.current &&
    latestEmailIdRef.current === targetEmailId;

  useEffect(() => {
    latestOpenRef.current = open;
    latestEmailIdRef.current = emailId;
    activeSendRequestIdRef.current += 1;

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
      setSendFeedback(null);

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
    setSendFeedback(null);
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

    const requestId = ++activeSendRequestIdRef.current;
    const targetEmailId = emailId;

    setSendLoading(true);
    setSendFeedback(null);

    try {
      const result = await sendReceiptWhatsApp({
        emailId: emailContent.id,
        sender: emailContent.from,
        subject: emailContent.subject,
        amount: extractionResult.amount,
        due_date: extractionResult.due_date,
        phone: phone.trim(),
      });

      if (!isActiveSendRequest(requestId, targetEmailId)) return;

      setSendFeedback(getSendFeedbackFromResult(result, phone));
    } catch (error) {
      if (!isActiveSendRequest(requestId, targetEmailId)) return;

      setSendFeedback(getSendFeedbackFromError(error));
    } finally {
      if (isActiveSendRequest(requestId, targetEmailId)) {
        setSendLoading(false);
      }
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
  const sendError = sendFeedback?.tone === 'error' ? sendFeedback : null;
  const sendSuccess = sendFeedback?.tone === 'success' ? sendFeedback : null;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleClose}>
      <DialogContent data-testid="receipt-review-dialog">
        <div className="space-y-5">
          <div className="space-y-1">
            <DialogPrimitive.Title className="text-lg font-semibold text-foreground">
              Revisar recibo
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="text-sm text-muted-foreground">
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
            <div
              data-testid="receipt-review-feedback"
              className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
            >
              <p className="font-medium">{sendError.title}</p>
              <p className="mt-1">{sendError.message}</p>
            </div>
          ) : null}

          {sendSuccess ? (
            <div
              data-testid="receipt-review-feedback"
              className="rounded-lg border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-900"
            >
              <p className="font-medium">{sendSuccess.title}</p>
              <p className="mt-1">{sendSuccess.message}</p>
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
              <Button
                type="button"
                onClick={handleSend}
                disabled={!canSend}
                data-testid="receipt-review-send-button"
              >
                {sendLoading ? 'Enviando...' : sendError ? 'Reintentar envio' : 'Enviar por WhatsApp'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </DialogPrimitive.Root>
  );
}
