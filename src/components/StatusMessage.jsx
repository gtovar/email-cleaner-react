// src/components/StatusMessage.jsx
import React from 'react';

/**
 * StatusMessage
 * Un componente unificado para mostrar mensajes de:
 * - success
 * - error
 * - warning
 * - info
 *
 * Props:
 * - message: string | null
 * - type: "success" | "error" | "warning" | "info"
 * - onRetry?: () => void
 *
 * Si message es null, no renderiza nada.
 */

const STYLES = {
  success: {
    container: "border-green-300 bg-green-50 text-green-800",
    button: "border-green-400 text-green-700 hover:bg-green-100",
    title: "Success",
  },
  error: {
    container: "border-red-300 bg-red-50 text-red-700",
    button: "border-red-400 text-red-700 hover:bg-red-100",
    title: "Error",
  },
  warning: {
    container: "border-yellow-300 bg-yellow-50 text-yellow-800",
    button: "border-yellow-400 text-yellow-700 hover:bg-yellow-100",
    title: "Warning",
  },
  info: {
    container: "border-blue-300 bg-blue-50 text-blue-700",
    button: "border-blue-400 text-blue-700 hover:bg-blue-100",
    title: "Info",
  },
};

export default function StatusMessage({ message, type = "info", onRetry }) {
  if (!message) return null;

  const style = STYLES[type] || STYLES.info;
  const hasRetry = typeof onRetry === "function";

  return (
    <div className={`mb-4 rounded border px-3 py-2 text-sm ${style.container}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold">{style.title}</p>
          <p className="mt-1">{message}</p>
        </div>

        {hasRetry && (
          <button
            type="button"
            onClick={onRetry}
            className={`shrink-0 rounded border px-2 py-1 text-xs font-medium ${style.button}`}
          >
            Reintentar
          </button>
        )}
      </div>
    </div>
  );
}

