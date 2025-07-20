import React, { useState } from 'react';
import { GameProvider } from './context/GameContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import Header from './components/Header';
import GameBoard from './components/GameBoard';
import AccessibilityPanel from './components/AccessibilityPanel';
import Instructions from './components/Instructions';
import GameStats from './components/GameStats';

function App() {
  const [showInstructions, setShowInstructions] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <AccessibilityProvider>
      <GameProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
          <Header 
            onShowInstructions={() => setShowInstructions(true)}
            onShowSettings={() => setShowSettings(true)}
          />
          
          <main className="container mx-auto px-4 py-6 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <GameBoard />
              </div>
              <div className="space-y-4">
                <GameStats />
                {showSettings && (
                  <AccessibilityPanel onClose={() => setShowSettings(false)} />
                )}
              </div>
            </div>
          </main>

          {showInstructions && (
            <Instructions onClose={() => setShowInstructions(false)} />
          )}
        </div>
      </GameProvider>
    </AccessibilityProvider>
  );
}

export default App;