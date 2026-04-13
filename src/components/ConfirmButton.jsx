// src/components/ConfirmButton.jsx
import React, { useState } from 'react';
import { confirmAction } from '../services/api.js';
import { Button } from './ui/button.jsx';

export default function ConfirmButton({
  emailId,
  action,
  onSuccess,
  onError,
  onStart,
  onFinish,
  disabled = false,
  className = '',
  icon = null,
}) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading || disabled) return;

    setLoading(true);
    if (onStart) onStart();

    try {
      await confirmAction([emailId], action);
      if (onSuccess) {
        onSuccess(emailId, action);
      }
    } catch (err) {
      console.error(err);
      if (onError) {
        onError(err);
      }
    } finally {
      setLoading(false);
      if (onFinish) onFinish();
    }
  };

  const isAccept = action === 'accept';
  const label = isAccept ? 'Aceptar' : 'Rechazar';

  return (
    <Button
      onClick={handleClick}
      className={className}
      variant={isAccept ? 'default' : 'ghost'}
      disabled={loading || disabled}
      aria-busy={loading}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        icon
      )}
      {label}
    </Button>
  );
}
