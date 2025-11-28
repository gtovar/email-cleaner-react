// src/components/SuggestionsList.jsx
import { useEffect, useState } from 'react';
import { getSuggestions } from '../services/api.js';
import ConfirmButton from './ConfirmButton.jsx';
import StatusMessage from './StatusMessage.jsx';

function SuggestionsList() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [feedbackType, setFeedbackType] = useState(null);

  useEffect(() => {
    async function loadSuggestions() {
      setLoading(true);
      setFeedback(null);
      setFeedbackType(null);

      try {
        const data = await getSuggestions('daily');
        // data debería ser un array de correos con { id, subject, from, date, suggestions }
        setEmails(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setFeedback( err.message || '❌ Error al cargar sugerencias desde el backend.');
          setFeedbackType('error');
      } finally {
        setLoading(false);
      }
    }

    loadSuggestions();
  }, []);

  const handleActionSuccess = (emailId, action) => {
    // Remueve el email de la lista local (idempotente)
    setEmails((prev) => prev.filter((email) => email.id !== emailId));
    setFeedback(`✅ Acción "${action}" confirmada para el correo ${emailId}`);
    setFeedbackType('success');
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Sugerencias de limpieza</h2>

      <StatusMessage
      message={feedback}
      type={feedbackType || 'info'}
      />

      {loading && <p className="mb-4 text-sm text-gray-500">Cargando...</p>}

      {!loading && emails.length === 0 && (
        <p className="text-sm text-gray-500">
          No hay sugerencias disponibles por el momento.
        </p>
      )}

      <div className="space-y-4">
        {emails.map((email) => (
          <div
            key={email.id}
            className="border p-4 rounded-xl shadow-sm bg-white"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-semibold text-gray-800">
                  {email.subject || '(Sin asunto)'}
                </div>
                <div className="text-sm text-gray-500">
                  {email.from || 'Remitente desconocido'}
                </div>
                {email.date && (
                  <div className="text-xs text-gray-400">
                    Fecha: {new Date(email.date).toLocaleString()}
                  </div>
                )}
              </div>
            </div>

            {Array.isArray(email.suggestions) && email.suggestions.length > 0 && (
              <div className="mt-2 mb-3">
                <div className="text-xs text-gray-500 mb-1">
                  Sugerencias del sistema:
                </div>
                <div className="flex flex-wrap gap-2">
                  {email.suggestions.map((sug, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700"
                    >
                      {typeof sug === 'string'
                        ? sug
                        : JSON.stringify(sug)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 mt-2">
              <ConfirmButton
                emailId={email.id}
                action="accept"
                onSuccess={handleActionSuccess}
              />
              <ConfirmButton
                emailId={email.id}
                action="reject"
                onSuccess={handleActionSuccess}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SuggestionsList;

