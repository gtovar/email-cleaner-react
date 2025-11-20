import { useState } from 'react';
import SuggestionsList from './components/SuggestionsList.jsx';
import HistoryList from './components/HistoryList.jsx';
import Navigation from './components/Navigation.jsx';

function App() {
  const [activeView, setActiveView] = useState('summary');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Email Cleaner</h1>
        <div className="space-x-2">
          <button
            className={`px-3 py-1 rounded ${activeView === 'summary' ? 'bg-white text-blue-600' : 'bg-blue-500'}`}
            onClick={() => setActiveView('summary')}
          >
            Sugerencias
          </button>
          <button
            className={`px-3 py-1 rounded ${activeView === 'history' ? 'bg-white text-blue-600' : 'bg-blue-500'}`}
            onClick={() => setActiveView('history')}
          >
            Historial
          </button>
        </div>
      </header>
        {activeView === 'summary' && <Navigation />}

      <main>
        {activeView === 'summary' && <SuggestionsList />}
        {activeView === 'history' && <HistoryList />}
      </main>
    </div>
  );
}

export default App;

