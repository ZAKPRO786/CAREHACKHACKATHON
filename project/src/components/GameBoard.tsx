import React, { useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { useAccessibility } from '../context/AccessibilityContext';
import GameCard from './GameCard';
import GameControls from './GameControls';

export default function GameBoard() {
  const { state, dispatch } = useGame();
  const { settings, announceText } = useAccessibility();

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (settings.oneSwitchMode) {
        if (e.code === 'Space' || e.code === 'Enter') {
          e.preventDefault();
          if (!state.isScanning) {
            dispatch({ type: 'TOGGLE_SCANNING' });
            announceText('Scanning started. Press space to select a card.');
          } else {
            // Select the currently scanned card
            const currentCard = state.cards[state.currentScanIndex];
            if (currentCard && !currentCard.isFlipped && !currentCard.isMatched) {
              dispatch({ type: 'FLIP_CARD', payload: state.currentScanIndex });
            }
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [settings.oneSwitchMode, state.isScanning, state.currentScanIndex, state.cards, dispatch, announceText]);

  if (state.cards.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading game...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <GameControls />
      
      <div 
        className={`grid gap-4 ${
          settings.simpleMode 
            ? 'grid-cols-2 sm:grid-cols-4' 
            : 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-4'
        }`}
        role="grid"
        aria-label="Memory game board"
      >
        {state.cards.map((card, index) => (
          <GameCard
            key={card.id}
            card={card}
            index={index}
            isScanned={settings.oneSwitchMode && state.currentScanIndex === index}
            onClick={() => {
              if (!settings.oneSwitchMode) {
                dispatch({ type: 'FLIP_CARD', payload: index });
              }
            }}
          />
        ))}
      </div>

      {state.gameCompleted && (
        <div 
          className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg text-center"
          role="alert"
          aria-live="polite"
        >
          <h2 className="text-2xl font-bold mb-2">🎉 Congratulations!</h2>
          <p className="text-lg">You completed the game in {state.attempts} attempts!</p>
          <p className="text-sm mt-2">Score: {state.score} points</p>
        </div>
      )}

      {settings.oneSwitchMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">One-Switch Mode Instructions</h3>
          <p className="text-blue-700 text-sm">
            Press <kbd className="bg-blue-200 px-2 py-1 rounded">Space</kbd> to start/stop scanning. 
            Press <kbd className="bg-blue-200 px-2 py-1 rounded">Space</kbd> again when the card you want is highlighted.
          </p>
        </div>
      )}
    </div>
  );
}