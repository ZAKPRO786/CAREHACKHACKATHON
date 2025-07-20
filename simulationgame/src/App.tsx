import React, { useState, useEffect } from 'react';
import GameCanvas from './components/GameCanvas';
import AccessibilityMenu from './components/AccessibilityMenu';
import GameUI from './components/GameUI';
import AudioManager from './components/AudioManager';
import TouchControls from './components/TouchControls';
import { GameProvider } from './context/GameContext';
import { AccessibilityProvider } from './context/AccessibilityContext';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [showAccessibilityMenu, setShowAccessibilityMenu] = useState(false);

  useEffect(() => {
    // Set up global keyboard shortcuts for accessibility
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'F1') {
        e.preventDefault();
        setShowAccessibilityMenu(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <AccessibilityProvider>
      <GameProvider>
        <div className="min-h-screen bg-gradient-to-b from-blue-400 via-purple-300 to-green-300">
          <AudioManager />
          
          {!gameStarted ? (
            <div className="min-h-screen flex items-center justify-center p-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 max-w-2xl w-full text-center shadow-2xl">
                <h1 className="text-4xl md:text-6xl font-bold text-purple-800 mb-6 font-fantasy">
                  🌟 Magical Forest Adventure 🌟
                </h1>
                
                <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
                  Welcome to an inclusive learning adventure! Explore the enchanted forest, 
                  meet friendly animals, and discover hidden letters with your angel guides.
                </p>
                
                <div className="space-y-4">
                  <button
                    onClick={() => setGameStarted(true)}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold py-4 px-8 rounded-2xl hover:scale-105 transform transition-all duration-300 shadow-lg"
                    aria-label="Start the magical forest adventure game"
                  >
                    🎮 Start Adventure
                  </button>
                  
                  <button
                    onClick={() => setShowAccessibilityMenu(true)}
                    className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white text-lg font-bold py-3 px-6 rounded-2xl hover:scale-105 transform transition-all duration-300 shadow-lg"
                    aria-label="Open accessibility settings menu"
                  >
                    ♿ Accessibility Settings
                  </button>
                </div>
                
                <div className="mt-6 text-sm text-gray-600">
                  <p>Press F1 at any time for accessibility options</p>
                  <p>Use arrow keys, WASD, or click to explore</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative h-screen">
              <GameCanvas />
              <GameUI />
              <TouchControls />
            </div>
          )}
          
          {showAccessibilityMenu && (
            <AccessibilityMenu onClose={() => setShowAccessibilityMenu(false)} />
          )}
        </div>
      </GameProvider>
    </AccessibilityProvider>
  );
}

export default App;