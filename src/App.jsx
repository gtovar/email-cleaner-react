import { useCallback, useEffect, useState } from 'react';
import { Mail, Menu } from 'lucide-react';
import { Toaster } from 'sonner';
import './App.css';
import Navigation from './components/Navigation.jsx';
import SuggestionsPage from './pages/SuggestionsPage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import InboxPage from './pages/InboxPage.jsx';
import HomePage from './pages/HomePage.jsx';
import { API_ORIGIN, getAuthMe, logout, onAuthExpired } from './services/api.js';
import { Button } from './components/ui/button.jsx';
import ActivityPanel from './components/activity/ActivityPanel.jsx';

function App() {
  const [activeView, setActiveView] = useState('suggestions');
  const [authMessage, setAuthMessage] = useState(null);
  const [authStatus, setAuthStatus] = useState('checking');
  const [authEmail, setAuthEmail] = useState(null);
  const [activityOpen, setActivityOpen] = useState(false);
  const isAuthenticated = authStatus === 'authenticated';
  const isHomeView = activeView === 'home';

  const resolvePublicView = useCallback((pathname) => {
    if (pathname === '/') return 'home';
    if (pathname === '/login') return 'login';
    return null;
  }, []);

  const syncAuthStatus = useCallback(async () => {
    setAuthStatus('checking');
    setAuthMessage(null);
    try {
      const data = await getAuthMe();
      if (data?.authenticated) {
        setAuthStatus('authenticated');
        setAuthEmail(data.email || null);
        setActiveView('suggestions');
      } else {
        setAuthStatus('anonymous');
        const publicView = resolvePublicView(window.location.pathname);
        setActiveView(publicView || 'login');
      }
    } catch {
      setAuthStatus('anonymous');
      const publicView = resolvePublicView(window.location.pathname);
      setActiveView(publicView || 'login');
    }
  }, [resolvePublicView]);

  useEffect(() => {
    const { pathname, search } = window.location;
    if (pathname !== '/auth/callback') {
      return;
    }

    const params = new URLSearchParams(search);
    const error = params.get('error');

    if (error) {
      setAuthMessage({ type: 'error', text: 'Google sign-in failed. Please try again.' });
      setAuthStatus('anonymous');
      setActiveView('login');
      window.history.replaceState(null, '', '/');
      return;
    }

    setAuthMessage(null);
    syncAuthStatus();
    window.history.replaceState(null, '', '/');
  }, [syncAuthStatus, resolvePublicView]);

  useEffect(() => {
    const { pathname } = window.location;
    if (pathname === '/auth/callback') {
      return;
    }
    syncAuthStatus();
  }, [syncAuthStatus]);

  useEffect(() => {
    onAuthExpired(() => {
      setAuthStatus('anonymous');
      setAuthEmail(null);
      setAuthMessage({
        type: 'error',
        text: 'Sesión expirada. Inicia sesión de nuevo.',
      });
      setActiveView('login');
    });
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const { pathname } = window.location;
      if (pathname === '/auth/callback') return;

      const publicView = resolvePublicView(pathname);
      if (authStatus === 'anonymous') {
        setActiveView(publicView || 'login');
        return;
      }

      if (authStatus === 'authenticated' && publicView) {
        setActiveView('suggestions');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [authStatus, resolvePublicView]);

  const handleLogin = () => {
    setAuthMessage(null);
    window.location.href = `${API_ORIGIN}/auth/google`;
  };

  const handleGoToLogin = () => {
    setActiveView('login');
    window.history.pushState(null, '', '/login');
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    } finally {
      setAuthStatus('anonymous');
      setAuthEmail(null);
      setActiveView('login');
      setAuthMessage({
        type: 'error',
        text: 'Sesión cerrada. Inicia sesión de nuevo.',
      });
    }
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
        {authStatus === 'checking' && (
          <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
            <div className="w-full max-w-md space-y-6 text-center">
              <div className="mb-2 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Mail className="h-8 w-8 text-primary" aria-hidden="true" />
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Email Cleaner
              </h1>
              <p className="mx-auto max-w-xs text-base text-muted-foreground">
                Validando sesión...
              </p>
              <div role="status" aria-live="polite" className="text-sm text-muted-foreground">
                Espera un momento.
              </div>
            </div>
          </div>
        )}
        {authStatus !== 'checking' && isAuthenticated ? (
          <>
            {activeView === 'inbox' && <InboxPage />}
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
              authEmail={authEmail}
            />
          </>
        ) : authStatus !== 'checking' ? (
          <>
            {isHomeView ? (
              <HomePage onStart={handleGoToLogin} />
            ) : (
              <LoginPage
                onLogin={handleLogin}
                message={authMessage?.type === 'error' ? authMessage.text : null}
              />
            )}
          </>
        ) : null}
      </main>
    </div>
  );
}

export default App;
