import React from 'react';
import { useAccessibility } from '../context/AccessibilityContext';

interface Card {
  id: number;
  symbol: string;
  color: string;
  sound: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface GameCardProps {
  card: Card;
  index: number;
  isScanned: boolean;
  onClick: () => void;
}

export default function GameCard({ card, index, isScanned, onClick }: GameCardProps) {
  const { settings, announceText } = useAccessibility();

  const handleClick = () => {
    onClick();
    
    if (settings.audioEnabled && !card.isFlipped) {
      announceText(`Card ${index + 1}, ${card.symbol}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const getCardClasses = () => {
    let classes = 'relative w-full aspect-square rounded-xl transition-all duration-300 cursor-pointer transform hover:scale-105 focus:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500';
    
    if (settings.simpleMode) {
      classes += ' text-4xl';
    } else {
      classes += ' text-2xl sm:text-3xl';
    }

    if (isScanned) {
      classes += ' ring-4 ring-yellow-400 ring-offset-2 animate-pulse';
    }

    if (card.isMatched) {
      classes += ' opacity-75';
    }

    if (settings.reducedMotion) {
      classes = classes.replace('transition-all duration-300', 'transition-none');
      classes = classes.replace('hover:scale-105', '');
      classes = classes.replace('animate-pulse', '');
    }

    return classes;
  };

  const getBackgroundColor = () => {
    if (settings.highContrast) {
      return card.isFlipped || card.isMatched ? 'bg-white border-4 border-black' : 'bg-black';
    }
    
    if (settings.audioMode) {
      return card.isFlipped || card.isMatched ? 'bg-blue-100' : 'bg-gray-700';
    }

    return card.isFlipped || card.isMatched ? `${card.color} bg-opacity-80` : 'bg-gray-300';
  };

  const getTextColor = () => {
    if (settings.highContrast) {
      return card.isFlipped || card.isMatched ? 'text-black' : 'text-white';
    }
    
    if (settings.audioMode) {
      return card.isFlipped || card.isMatched ? 'text-gray-800' : 'text-white';
    }

    return 'text-white';
  };

  return (
    <button
      className={`${getCardClasses()} ${getBackgroundColor()}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={card.isMatched}
      aria-label={
        card.isFlipped || card.isMatched 
          ? `Card ${index + 1}: ${card.symbol}${card.isMatched ? ' - matched' : ''}`
          : `Card ${index + 1}: hidden`
      }
      aria-pressed={card.isFlipped}
      tabIndex={settings.oneSwitchMode ? -1 : 0}
      role="gridcell"
    >
      <div className={`absolute inset-0 flex items-center justify-center font-bold ${getTextColor()}`}>
        {card.isFlipped || card.isMatched ? (
          <span role="img" aria-label={`Symbol: ${card.symbol}`}>
            {card.symbol}
          </span>
        ) : (
          <span aria-hidden="true">
            {settings.audioMode ? '🔊' : '?'}
          </span>
        )}
      </div>
      
      {card.isMatched && (
        <div className="absolute top-1 right-1">
          <span role="img" aria-label="Matched" className="text-green-600">✓</span>
        </div>
      )}
      
      {isScanned && (
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
      )}
    </button>
  );
}