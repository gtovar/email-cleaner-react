// src/components/ConfirmButton.jsx
import React, { useState } from 'react';
import { confirmAction } from '../services/api.js';
import StatusMessage from './StatusMessage.jsx';

export default function ConfirmButton({ emailId, action, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [feedbackType, setFeedbackType] = useState(null);


  const handleClick = async () => {
    if (loading) return;

    setLoading(true);
    setFeedback(null);
    setFeedbackType(null);


    try {
      await confirmAction([emailId], action);
      if (onSuccess) {
        onSuccess(emailId, action);
      }
    } catch (err) {
      console.error(err);
      setFeedback(err.message || 'Error al confirmar la acción');
      setFeedbackType('error');
    } finally {
      setLoading(false);
    }
  };

  const isAccept = action === 'accept';
  const label = isAccept ? 'Aceptar' : 'Rechazar';

  return (
      <div className="flex flex-col gap-2">
      <button
      onClick={handleClick}
      className={`px-3 py-1 rounded text-white text-sm ${
        isAccept ? 'bg-green-600' : 'bg-red-600'
      } hover:opacity-90 disabled:opacity-50`}
      disabled={loading}
      >
      {loading ? '...' : label}
      </button>
      <StatusMessage
      message={feedback}
      type={feedbackType || 'info'}
      />
      </div>
  );
}

