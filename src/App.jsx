import { useEffect, useState } from 'react';
import SummaryPanel from './components/SummaryPanel.jsx';
import SuggestionsList from './components/SuggestionsList.jsx';
import HistoryList from './components/HistoryList.jsx';
import Navigation from './components/Navigation.jsx';
import { API_ORIGIN } from './services/api.js';

function App() {
  const [activeView, setActiveView] = useState('summary');
  const [authMessage, setAuthMessage] = useState(null);

  useEffect(() => {
    const { pathname, search } = window.location;
    if (pathname !== '/auth/callback') {
      return;
    }

    const params = new URLSearchParams(search);
    const error = params.get('error');

    if (error) {
      setAuthMessage({ type: 'error', text: 'Google sign-in failed. Please try again.' });
    } else {
      setAuthMessage({ type: 'success', text: 'Google sign-in complete. Redirecting...' });
    }

    setActiveView('summary');
    window.history.replaceState(null, '', '/');
  }, []);

  const handleLogin = () => {
    window.location.href = `${API_ORIGIN}/auth/google`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
         <h1 className="text-xl font-bold">Email Cleaner</h1>
         <div className="flex items-center gap-4">
           <Navigation currentView={activeView} setView={setActiveView} />
           <button
             type="button"
             onClick={handleLogin}
             className="bg-white text-blue-700 px-3 py-1.5 rounded text-sm font-medium"
           >
             Sign in with Google
           </button>
         </div>
      </header>

      <main>
        {authMessage && (
          <div
            className={`p-4 text-sm ${
              authMessage.type === 'error' ? 'text-red-700' : 'text-green-700'
            }`}
          >
            {authMessage.text}
          </div>
        )}
        {activeView === 'summary' && (
          <div className="p-4">
            <SummaryPanel />
            <SuggestionsList />
          </div>
        )}
        {activeView === 'history' && <HistoryList />}
      </main>
    </div>
  );
}

export default App;
