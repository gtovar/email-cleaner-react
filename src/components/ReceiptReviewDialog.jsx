import { forwardRef, useEffect, useId, useMemo, useRef, useState } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Button } from './ui/button.jsx';
import { Input } from './ui/input.jsx';
import { Label } from './ui/label.jsx';
import {
  getEmailContent,
  extractReceipt,
  getReceiptResponse,
  saveReceiptResponse,
  sendReceiptWhatsApp,
} from '../services/api.js';

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
        className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100vh-2rem)] w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border bg-card p-6 shadow-lg focus:outline-none"
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

const formatResponseUpdatedAt = (value) => {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

const getReceiptResponseLabel = (response) => {
  if (response === 'paid') {
    return 'Pagado';
  }

  if (response === 'ignore') {
    return 'Ignorado';
  }

  return 'Sin respuesta registrada';
};

const getReceiptResponseTone = (response) => {
  if (response === 'paid') {
    return 'border-emerald-300 bg-emerald-50 text-emerald-900';
  }

  if (response === 'ignore') {
    return 'border-amber-300 bg-amber-50 text-amber-900';
  }

  return 'border-border bg-muted/30 text-muted-foreground';
};

const hasNonEmptyValue = (value) =>
  value !== null &&
  value !== undefined &&
  String(value).trim() !== '';

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
  const activeResponseRequestIdRef = useRef(0);
  const activeResponseSaveRequestIdRef = useRef(0);
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
  const [receiptResponseLoading, setReceiptResponseLoading] = useState(false);
  const [receiptResponseError, setReceiptResponseError] = useState('');
  const [currentResponse, setCurrentResponse] = useState(null);
  const [receiptResponseSaving, setReceiptResponseSaving] = useState(false);
  const [savingResponseValue, setSavingResponseValue] = useState(null);
  const [receiptResponseFeedback, setReceiptResponseFeedback] = useState(null);

  const hasExtractionData = useMemo(
    () =>
      hasNonEmptyValue(extractionResult?.amount) &&
      hasNonEmptyValue(extractionResult?.due_date),
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
  const currentResponseValue = currentResponse?.response ?? null;
  const receiptResponseUpdatedAt = currentResponse?.updatedAt ?? null;
  const canSaveReceiptResponse =
    open &&
    Boolean(emailId) &&
    !contentLoading &&
    !extractionLoading &&
    !receiptResponseLoading &&
    !receiptResponseSaving &&
    !contentError &&
    !extractionError &&
    !receiptResponseError;

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
    setReceiptResponseLoading(false);
    setReceiptResponseError('');
    setCurrentResponse(null);
    setReceiptResponseSaving(false);
    setSavingResponseValue(null);
    setReceiptResponseFeedback(null);
  };

  const isActiveRequest = (requestId, targetEmailId) =>
    activeRequestIdRef.current === requestId &&
    latestOpenRef.current &&
    latestEmailIdRef.current === targetEmailId;

  const isActiveSendRequest = (requestId, targetEmailId) =>
    activeSendRequestIdRef.current === requestId &&
    latestOpenRef.current &&
    latestEmailIdRef.current === targetEmailId;

  const isActiveResponseRequest = (requestId, targetEmailId) =>
    activeResponseRequestIdRef.current === requestId &&
    latestOpenRef.current &&
    latestEmailIdRef.current === targetEmailId;

  const isActiveResponseSaveRequest = (requestId, targetEmailId) =>
    activeResponseSaveRequestIdRef.current === requestId &&
    latestOpenRef.current &&
    latestEmailIdRef.current === targetEmailId;

  useEffect(() => {
    latestOpenRef.current = open;
    latestEmailIdRef.current = emailId;
    activeSendRequestIdRef.current += 1;
    activeResponseSaveRequestIdRef.current += 1;

    if (!open || !emailId) {
      activeRequestIdRef.current += 1;
      activeResponseRequestIdRef.current += 1;
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

  useEffect(() => {
    if (!open || !emailId) {
      setReceiptResponseLoading(false);
      setReceiptResponseError('');
      setCurrentResponse(null);
      setReceiptResponseSaving(false);
      setSavingResponseValue(null);
      setReceiptResponseFeedback(null);
      return;
    }

    const requestId = ++activeResponseRequestIdRef.current;
    const targetEmailId = emailId;

    const loadReceiptResponse = async () => {
      setReceiptResponseLoading(true);
      setReceiptResponseError('');
      setCurrentResponse(null);
      setReceiptResponseFeedback(null);

      try {
        const response = await getReceiptResponse(targetEmailId);
        if (!isActiveResponseRequest(requestId, targetEmailId)) return;

        setCurrentResponse(response);
      } catch (error) {
        if (!isActiveResponseRequest(requestId, targetEmailId)) return;

        setReceiptResponseError(error.message || 'No se pudo cargar el estado del recibo.');
      } finally {
        if (isActiveResponseRequest(requestId, targetEmailId)) {
          setReceiptResponseLoading(false);
        }
      }
    };

    void loadReceiptResponse();
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
        emailId: targetEmailId,
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

  const handleSaveReceiptResponse = async (response) => {
    if (!canSaveReceiptResponse) return;

    const requestId = ++activeResponseSaveRequestIdRef.current;
    const targetEmailId = emailId;

    setReceiptResponseSaving(true);
    setSavingResponseValue(response);
    setReceiptResponseError('');
    setReceiptResponseFeedback(null);

    try {
      const savedResponse = await saveReceiptResponse({
        targetId: targetEmailId,
        response,
      });

      if (!isActiveResponseSaveRequest(requestId, targetEmailId)) return;

      setCurrentResponse(savedResponse);
      setReceiptResponseFeedback({
        tone: 'success',
        message:
          response === 'paid'
            ? 'Recibo marcado como pagado.'
            : 'Recibo marcado como ignorado.',
      });
    } catch (error) {
      if (!isActiveResponseSaveRequest(requestId, targetEmailId)) return;

      setReceiptResponseFeedback({
        tone: 'error',
        message: error.message || 'No se pudo guardar la respuesta del recibo.',
      });
    } finally {
      if (isActiveResponseSaveRequest(requestId, targetEmailId)) {
        setReceiptResponseSaving(false);
        setSavingResponseValue(null);
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
  const receiptResponseFeedbackError = receiptResponseFeedback?.tone === 'error' ? receiptResponseFeedback : null;
  const receiptResponseFeedbackSuccess =
    receiptResponseFeedback?.tone === 'success' ? receiptResponseFeedback : null;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleClose}>
      <DialogContent data-testid="receipt-review-dialog">
        <div className="space-y-5">
          <div className="space-y-1">
            <DialogPrimitive.Title className="text-lg font-semibold text-foreground">
              Revisar recibo
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="text-sm text-muted-foreground">
              Sigue esta secuencia: revisa el contexto del correo, valida los datos extraidos,
              registra el estado si hace falta y envia WhatsApp solo cuando estes seguro.
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

          <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-4">
              <section className="space-y-3 rounded-xl border p-4">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">
                    Paso 1
                  </p>
                  <h3 className="text-base font-semibold text-foreground">
                    Revisa el contexto del correo
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Verifica que este correo realmente corresponda al recibo que vas a tratar.
                  </p>
                </div>

                {emailContent ? (
                  <div className="space-y-3 rounded-lg border bg-background p-4">
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
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Vista previa del correo
                      </p>
                      <div className="rounded-lg border border-border/60 bg-muted/[0.24] p-3 text-sm leading-relaxed text-foreground/85">
                        {emailContent.body || 'Sin vista previa disponible.'}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-border/70 bg-muted/[0.2] p-4 text-sm text-muted-foreground">
                    Carga el correo para revisar su contexto antes de continuar.
                  </div>
                )}
              </section>

              <section className="space-y-3 rounded-xl border p-4">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">
                    Paso 2
                  </p>
                  <h3 className="text-base font-semibold text-foreground">
                    Confirma los datos extraidos
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Usa estos datos como evidencia antes de registrar estado o enviar la notificacion.
                  </p>
                </div>

                {extractionResult ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border bg-background p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Monto</p>
                      <p className="text-base font-semibold text-foreground">
                        {formatAmount(extractionResult.amount)}
                      </p>
                    </div>
                    <div className="rounded-lg border bg-background p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Fecha limite</p>
                      <p className="text-base font-semibold text-foreground">
                        {extractionResult.due_date || 'No disponible'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-border/70 bg-muted/[0.2] p-4 text-sm text-muted-foreground">
                    Todavia no hay datos extraidos para revisar.
                  </div>
                )}

                {extractionResult && !hasExtractionData ? (
                  <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
                    El recibo no esta listo para envio porque falta monto o fecha limite.
                  </div>
                ) : null}

                {showLoadRetry ? (
                  <div className="flex justify-end">
                    <Button type="button" onClick={handleRetryLoad} disabled={contentLoading || extractionLoading}>
                      Reintentar carga
                    </Button>
                  </div>
                ) : null}
              </section>
            </div>

            <div className="space-y-4">
              <section className="space-y-3 rounded-xl border p-4">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">
                    Paso 3
                  </p>
                  <h3 className="text-base font-semibold text-foreground">
                    Registra el estado del recibo
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Este registro no envia WhatsApp. Solo guarda el estado manual del caso.
                  </p>
                </div>

                <div className="space-y-3 rounded-lg border bg-background p-4">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Estado del recibo</p>
                    {receiptResponseLoading ? (
                      <p className="text-sm text-muted-foreground">Cargando estado del recibo...</p>
                    ) : receiptResponseError ? (
                      <p className="text-sm text-destructive">{receiptResponseError}</p>
                    ) : (
                      <>
                        <span
                          data-testid="receipt-response-status"
                          className={`inline-flex rounded-full border px-2.5 py-1 text-sm font-medium ${getReceiptResponseTone(currentResponseValue)}`}
                        >
                          {getReceiptResponseLabel(currentResponseValue)}
                        </span>
                        {receiptResponseUpdatedAt ? (
                          <p className="text-xs text-muted-foreground">
                            Actualizado: {formatResponseUpdatedAt(receiptResponseUpdatedAt)}
                          </p>
                        ) : null}
                      </>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant={currentResponseValue === 'paid' ? 'default' : 'outline'}
                      disabled={!canSaveReceiptResponse}
                      onClick={() => handleSaveReceiptResponse('paid')}
                    >
                      {receiptResponseSaving && savingResponseValue === 'paid'
                        ? 'Guardando respuesta...'
                        : 'Marcar como pagado'}
                    </Button>
                    <Button
                      type="button"
                      variant={currentResponseValue === 'ignore' ? 'default' : 'outline'}
                      disabled={!canSaveReceiptResponse}
                      onClick={() => handleSaveReceiptResponse('ignore')}
                    >
                      {receiptResponseSaving && savingResponseValue === 'ignore'
                        ? 'Guardando respuesta...'
                        : 'Marcar como ignorado'}
                    </Button>
                  </div>

                  {receiptResponseFeedbackError ? (
                    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                      {receiptResponseFeedbackError.message}
                    </div>
                  ) : null}

                  {receiptResponseFeedbackSuccess ? (
                    <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-900">
                      {receiptResponseFeedbackSuccess.message}
                    </div>
                  ) : null}
                </div>
              </section>

              <section className="space-y-3 rounded-xl border p-4">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">
                    Paso 4
                  </p>
                  <h3 className="text-base font-semibold text-foreground">
                    Envia WhatsApp manualmente
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Enviar WhatsApp no cambia el estado del recibo. Es una accion separada.
                  </p>
                </div>

                <div className="space-y-3 rounded-lg border bg-background p-4">
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

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={handleSend}
                      disabled={!canSend || showLoadRetry}
                      data-testid="receipt-review-send-button"
                    >
                      {sendLoading ? 'Enviando...' : sendError ? 'Reintentar envio' : 'Enviar por WhatsApp'}
                    </Button>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-2 border-t pt-4">
            <Button type="button" variant="outline" onClick={() => handleClose(false)}>
              {sendSuccess ? 'Cerrar' : 'Cancelar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </DialogPrimitive.Root>
  );
}
