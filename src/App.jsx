import { useEffect, useState } from 'react';
import { Mail, Menu } from 'lucide-react';
import { Toaster } from 'sonner';
import './App.css';
import Navigation from './components/Navigation.jsx';
import SuggestionsPage from './pages/SuggestionsPage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import { API_ORIGIN, onAuthExpired } from './services/api.js';
import { Button } from './components/ui/button.jsx';
import ActivityPanel from './components/activity/ActivityPanel.jsx';

function App() {
  const [activeView, setActiveView] = useState('suggestions');
  const [authMessage, setAuthMessage] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [activityOpen, setActivityOpen] = useState(false);

  useEffect(() => {
    const { pathname, search } = window.location;
    if (pathname !== '/auth/callback') {
      return;
    }

    const params = new URLSearchParams(search);
    const error = params.get('error');

    if (error) {
      setAuthMessage({ type: 'error', text: 'Google sign-in failed. Please try again.' });
      setIsAuthenticated(false);
      setActiveView('login');
    } else {
      setAuthMessage({ type: 'success', text: 'Google sign-in complete. Redirecting...' });
      setIsAuthenticated(true);
      setActiveView('suggestions');
    }

    setActiveView('suggestions');
    window.history.replaceState(null, '', '/');
  }, []);

  useEffect(() => {
    onAuthExpired(() => {
      setIsAuthenticated(false);
      setAuthMessage({
        type: 'error',
        text: 'Sesión expirada. Inicia sesión de nuevo.',
      });
      setActiveView('login');
    });
  }, []);

  const handleLogin = () => {
    window.location.href = `${API_ORIGIN}/auth/google`;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveView('login');
    setAuthMessage({
      type: 'error',
      text: 'Sesión cerrada. Inicia sesión de nuevo.',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="bottom-center" richColors />
      {isAuthenticated && (
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
          <div className="container flex flex-wrap items-center justify-between gap-3 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Mail className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-tight text-foreground">
                  Email Cleaner
                </h1>
                <p className="text-xs text-muted-foreground">
                  Mantén tu inbox limpio sin perder correos importantes.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Navigation currentView={activeView} setView={setActiveView} />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActivityOpen((prev) => !prev)}
                aria-expanded={activityOpen}
                aria-controls="activity-panel"
              >
                <Menu className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </header>
      )}

      <main>
        {authMessage && isAuthenticated && (
          <div
            className={`p-4 text-sm ${
              authMessage.type === 'error' ? 'text-red-700' : 'text-green-700'
            }`}
          >
            {authMessage.text}
          </div>
        )}
        {isAuthenticated ? (
          <>
            {activeView === 'suggestions' && <SuggestionsPage />}
            {activeView === 'history' && <HistoryPage />}
            {activeView === 'settings' && <SettingsPage />}
            <ActivityPanel
              open={activityOpen}
              onOpenChange={setActivityOpen}
              onNavigate={(view) => {
                setActiveView(view);
                setActivityOpen(false);
              }}
              onLogout={handleLogout}
            />
          </>
        ) : (
          <LoginPage
            onLogin={handleLogin}
            message={authMessage?.type === 'error' ? authMessage.text : null}
          />
        )}
      </main>
    </div>
  );
}

export default App;
