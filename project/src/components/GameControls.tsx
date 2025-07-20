import React from 'react';
import { RotateCcw, Play, Pause } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useAccessibility } from '../context/AccessibilityContext';

export default function GameControls() {
  const { state, createNewGame, dispatch } = useGame();
  const { settings, announceText } = useAccessibility();

  const handleNewGame = () => {
    createNewGame();
    announceText('New game started!');
  };

  const handleToggleScanning = () => {
    dispatch({ type: 'TOGGLE_SCANNING' });
    announceText(state.isScanning ? 'Scanning stopped' : 'Scanning started');
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-lg shadow-sm border">
      <div className="flex items-center space-x-4">
        <button
          onClick={handleNewGame}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg
                   hover:bg-blue-600 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
          aria-label="Start new game"
        >
          <RotateCcw className="w-4 h-4" />
          <span>New Game</span>
        </button>

        {settings.oneSwitchMode && (
          <button
            onClick={handleToggleScanning}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors
                       focus:ring-2 focus:ring-blue-500 focus:outline-none ${
              state.isScanning 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
            aria-label={state.isScanning ? 'Stop scanning' : 'Start scanning'}
          >
            {state.isScanning ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Stop Scanning</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Start Scanning</span>
              </>
            )}
          </button>
        )}
      </div>

      <div className="flex items-center space-x-6 text-sm">
        <div className="text-center">
          <div className="font-semibold text-lg text-blue-600">{state.matches}</div>
          <div className="text-gray-600">Matches</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-lg text-purple-600">{state.attempts}</div>
          <div className="text-gray-600">Attempts</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-lg text-green-600">{state.score}</div>
          <div className="text-gray-600">Score</div>
        </div>
      </div>
    </div>
  );
}