// src/components/ConfirmButton.jsx
import React, { useState } from 'react';
import { confirmAction } from '../services/api.js';

export default function ConfirmButton({ emailId, action, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);

    try {
      await confirmAction([emailId], action);
      if (onSuccess) {
        onSuccess(emailId, action);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al confirmar la acción');
    } finally {
      setLoading(false);
    }
  };

  const isAccept = action === 'accept';
  const label = isAccept ? 'Aceptar' : 'Rechazar';

  return (
    <button
      onClick={handleClick}
      className={`px-3 py-1 rounded text-white text-sm ${
        isAccept ? 'bg-green-600' : 'bg-red-600'
      } hover:opacity-90 disabled:opacity-50`}
      disabled={loading}
    >
      {loading ? '...' : label}
      {error && (
        <span className="ml-2 text-xs text-yellow-300">{error}</span>
      )}
    </button>
  );
}

