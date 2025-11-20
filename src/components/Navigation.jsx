// src/components/Navigation.jsx
import React from 'react';

export default function Navigation({ currentView, setView }) {
  return (
    <nav className="flex gap-4 mb-4 px-4 py-2 bg-white shadow rounded">
      <button
        className={`px-4 py-2 rounded ${currentView === 'summary' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        onClick={() => setView('summary')}
      >
        Sugerencias
      </button>
      <button
        className={`px-4 py-2 rounded ${currentView === 'history' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        onClick={() => setView('history')}
      >
        Historial
      </button>
    </nav>
  );
}
