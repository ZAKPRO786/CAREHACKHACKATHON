import React from 'react';
import { useGame } from '../context/GameContext';
import { Heart, Star, Volume2, VolumeX, Smartphone } from 'lucide-react';

const GameUI: React.FC = () => {
  const { gameState, toggleAudio, toggleNarration } = useGame();

  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      {/* Top HUD */}
      <div className="absolute top-2 md:top-4 left-2 md:left-4 right-2 md:right-4 flex justify-between items-start pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 md:p-4 shadow-xl border border-white/20">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex items-center gap-2">
              <Star className="text-yellow-500" size={20} />
              <span className="text-lg md:text-xl font-bold text-purple-800">{gameState.score}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm md:text-lg font-semibold text-gray-700">Letters:</span>
              <span className="text-lg md:text-xl font-bold text-green-600">
                {gameState.lettersFound.length}/26
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={toggleAudio}
            className="bg-white/95 backdrop-blur-md rounded-xl p-2 md:p-3 shadow-xl border border-white/20 hover:scale-110 transition-all duration-200 active:scale-95"
            aria-label={gameState.audioEnabled ? 'Mute audio' : 'Enable audio'}
          >
            {gameState.audioEnabled ? (
              <Volume2 className="text-blue-600" size={20} />
            ) : (
              <VolumeX className="text-gray-400" size={20} />
            )}
          </button>
          
          <button
            onClick={toggleNarration}
            className="bg-white/95 backdrop-blur-md rounded-xl p-2 md:p-3 shadow-xl border border-white/20 hover:scale-110 transition-all duration-200 active:scale-95"
            aria-label={gameState.narrationEnabled ? 'Disable narration' : 'Enable narration'}
          >
            <span className={`text-base md:text-lg font-bold ${gameState.narrationEnabled ? 'text-green-600' : 'text-gray-400'}`}>
              🗣️
            </span>
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 md:p-4 shadow-xl border border-white/20 pointer-events-auto max-w-xs md:max-w-md hidden md:block">
        <h3 className="text-base md:text-lg font-bold text-purple-800 mb-2">How to Play:</h3>
        <ul className="text-xs md:text-sm text-gray-700 space-y-1">
          <li className="flex items-center gap-2">
            <Smartphone size={14} className="md:hidden" />
            🎮 Touch controls or arrow keys to move
          </li>
          <li>🔍 Click on glowing objects to interact</li>
          <li>🅰️ Find hidden letters in the forest</li>
          <li>👼 Meet friendly angels and animals</li>
          <li>⭐ Collect stars for each letter found</li>
        </ul>
      </div>

      {/* Found Letters Display */}
      {gameState.lettersFound.length > 0 && (
        <div className="absolute top-20 md:top-32 right-2 md:right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 md:p-4 shadow-xl border border-white/20 pointer-events-auto">
          <h3 className="text-sm md:text-lg font-bold text-purple-800 mb-2">Found Letters:</h3>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-1 md:gap-2 max-w-32 md:max-w-48">
            {gameState.lettersFound.map((letter, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white font-bold text-sm md:text-lg rounded-lg p-1 md:p-2 text-center shadow-lg animate-bounce border-2 border-white/30"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {letter.toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Game Mode Indicator */}
      <div className="absolute top-2 md:top-4 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-md rounded-2xl px-3 md:px-6 py-2 md:py-3 shadow-xl border border-white/20 pointer-events-auto">
        <div className="flex items-center gap-2">
          <div className="w-2 md:w-3 h-2 md:h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm md:text-lg font-semibold text-gray-700 capitalize">
            {gameState.gameMode} Mode
          </span>
        </div>
      </div>
      
      {/* Mobile hint */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto md:hidden">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl px-4 py-3 shadow-xl border border-white/20 text-center max-w-xs">
          <p className="text-sm font-semibold text-purple-800 mb-1">✨ Welcome to the Magical Forest! ✨</p>
          <p className="text-xs text-gray-600">Use the touch controls below to explore and find hidden letters!</p>
        </div>
      </div>
    </div>
  );
};

export default GameUI;