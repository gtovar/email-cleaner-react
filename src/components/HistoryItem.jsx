// src/components/HistoryItem.jsx
import React from 'react';

export default function HistoryItem({ item }) {
  const {id, emailId, action, timestamp } = item;

  return (
    <div className="border border-gray-200 rounded p-4 mb-3 shadow-sm bg-white">
      <div className="font-medium text-sm text-gray-700">1 Correo: <span className="text-black">{emailId}</span></div>
      <div className="text-sm text-gray-600">Acción: <span className="uppercase">{action}</span></div>
      <div className="text-xs text-gray-400">Fecha: {new Date(timestamp).toLocaleString()}</div>
    </div>
  );
}
