import { useState } from 'react';
import SummaryPanel from './components/SummaryPanel.jsx';
import SuggestionsList from './components/SuggestionsList.jsx';
import HistoryList from './components/HistoryList.jsx';
import Navigation from './components/Navigation.jsx';

function App() {
  const [activeView, setActiveView] = useState('summary');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
         <h1 className="text-xl font-bold">Email Cleaner</h1>
         <Navigation currentView={activeView} setView={setActiveView} />
      </header>

      <main>
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
