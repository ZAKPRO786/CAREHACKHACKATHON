import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAccessibility } from './AccessibilityContext';

interface Card {
  id: number;
  symbol: string;
  color: string;
  sound: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface GameState {
  cards: Card[];
  flippedCards: number[];
  matches: number;
  attempts: number;
  gameStarted: boolean;
  gameCompleted: boolean;
  currentScanIndex: number;
  isScanning: boolean;
  score: number;
}

type GameAction = 
  | { type: 'FLIP_CARD'; payload: number }
  | { type: 'MATCH_CARDS'; payload: number[] }
  | { type: 'RESET_FLIPPED' }
  | { type: 'NEW_GAME'; payload: Card[] }
  | { type: 'COMPLETE_GAME' }
  | { type: 'SET_SCAN_INDEX'; payload: number }
  | { type: 'TOGGLE_SCANNING' }
  | { type: 'INCREMENT_SCORE'; payload: number };

const gameSymbols = ['🌟', '🌈', '🦋', '🌸', '🎈', '🎨', '🎵', '🍀'];
const gameColors = ['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 
                   'bg-purple-400', 'bg-pink-400', 'bg-indigo-400', 'bg-orange-400'];
const gameSounds = ['note1', 'note2', 'note3', 'note4', 'note5', 'note6', 'note7', 'note8'];

const initialState: GameState = {
  cards: [],
  flippedCards: [],
  matches: 0,
  attempts: 0,
  gameStarted: false,
  gameCompleted: false,
  currentScanIndex: 0,
  isScanning: false,
  score: 0,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'FLIP_CARD':
      if (state.flippedCards.length >= 2 || state.cards[action.payload].isFlipped) {
        return state;
      }
      
      const newFlippedCards = [...state.flippedCards, action.payload];
      const newCards = state.cards.map((card, index) =>
        index === action.payload ? { ...card, isFlipped: true } : card
      );

      return {
        ...state,
        cards: newCards,
        flippedCards: newFlippedCards,
        gameStarted: true,
      };

    case 'MATCH_CARDS':
      return {
        ...state,
        cards: state.cards.map((card, index) =>
          action.payload.includes(index) ? { ...card, isMatched: true } : card
        ),
        matches: state.matches + 1,
        attempts: state.attempts + 1,
        flippedCards: [],
      };

    case 'RESET_FLIPPED':
      return {
        ...state,
        cards: state.cards.map(card =>
          card.isMatched ? card : { ...card, isFlipped: false }
        ),
        flippedCards: [],
        attempts: state.attempts + 1,
      };

    case 'NEW_GAME':
      return {
        ...initialState,
        cards: action.payload,
      };

    case 'COMPLETE_GAME':
      return {
        ...state,
        gameCompleted: true,
      };

    case 'SET_SCAN_INDEX':
      return {
        ...state,
        currentScanIndex: action.payload,
      };

    case 'TOGGLE_SCANNING':
      return {
        ...state,
        isScanning: !state.isScanning,
      };

    case 'INCREMENT_SCORE':
      return {
        ...state,
        score: state.score + action.payload,
      };

    default:
      return state;
  }
}

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  createNewGame: () => void;
  flipCard: (index: number) => void;
  playSound: (sound: string) => void;
} | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { settings } = useAccessibility();

  const createNewGame = () => {
    const cardCount = settings.simpleMode ? 8 : 16;
    const symbolsToUse = gameSymbols.slice(0, cardCount / 2);
    
    const cardPairs = symbolsToUse.flatMap((symbol, index) => [
      {
        id: index * 2,
        symbol,
        color: gameColors[index],
        sound: gameSounds[index],
        isFlipped: false,
        isMatched: false,
      },
      {
        id: index * 2 + 1,
        symbol,
        color: gameColors[index],
        sound: gameSounds[index],
        isFlipped: false,
        isMatched: false,
      },
    ]);

    const shuffledCards = cardPairs.sort(() => Math.random() - 0.5);
    dispatch({ type: 'NEW_GAME', payload: shuffledCards });
  };

  const playSound = (sound: string) => {
    if (!settings.audioEnabled) return;
    
    // Create audio context for sound effects
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const frequencies: { [key: string]: number } = {
      note1: 261.63, // C4
      note2: 293.66, // D4
      note3: 329.63, // E4
      note4: 349.23, // F4
      note5: 392.00, // G4
      note6: 440.00, // A4
      note7: 493.88, // B4
      note8: 523.25, // C5
      success: 523.25,
      error: 220.00,
    };

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequencies[sound] || 440, audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const flipCard = (index: number) => {
    if (state.flippedCards.length >= 2) return;
    
    const card = state.cards[index];
    if (card.isFlipped || card.isMatched) return;

    playSound(card.sound);
    dispatch({ type: 'FLIP_CARD', payload: index });
  };

  // Check for matches
  useEffect(() => {
    if (state.flippedCards.length === 2) {
      const [first, second] = state.flippedCards;
      const firstCard = state.cards[first];
      const secondCard = state.cards[second];

      setTimeout(() => {
        if (firstCard.symbol === secondCard.symbol) {
          playSound('success');
          dispatch({ type: 'MATCH_CARDS', payload: [first, second] });
          dispatch({ type: 'INCREMENT_SCORE', payload: 100 });
          
          // Announce match for screen readers
          if (settings.audioEnabled) {
            const utterance = new SpeechSynthesisUtterance('Match found! Great job!');
            utterance.rate = 0.8;
            speechSynthesis.speak(utterance);
          }
        } else {
          playSound('error');
          dispatch({ type: 'RESET_FLIPPED' });
        }
      }, 1000);
    }
  }, [state.flippedCards, settings.audioEnabled]);

  // Check for game completion
  useEffect(() => {
    if (state.cards.length > 0 && state.matches === state.cards.length / 2) {
      setTimeout(() => {
        dispatch({ type: 'COMPLETE_GAME' });
        dispatch({ type: 'INCREMENT_SCORE', payload: Math.max(0, 500 - state.attempts * 10) });
        
        if (settings.audioEnabled) {
          const utterance = new SpeechSynthesisUtterance('Congratulations! You completed the game!');
          utterance.rate = 0.8;
          speechSynthesis.speak(utterance);
        }
      }, 500);
    }
  }, [state.matches, state.cards.length, settings.audioEnabled]);

  // Auto-scanning for one-switch mode
  useEffect(() => {
    if (settings.oneSwitchMode && state.isScanning && state.cards.length > 0) {
      const interval = setInterval(() => {
        dispatch({ type: 'SET_SCAN_INDEX', payload: (state.currentScanIndex + 1) % state.cards.length });
      }, 1500);

      return () => clearInterval(interval);
    }
  }, [settings.oneSwitchMode, state.isScanning, state.currentScanIndex, state.cards.length]);

  // Initialize game on first load
  useEffect(() => {
    createNewGame();
  }, [settings.simpleMode]);

  return (
    <GameContext.Provider value={{ state, dispatch, createNewGame, flipCard, playSound }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}