import React, { createContext, useContext, useState, useCallback } from 'react';

interface GameState {
  score: number;
  lettersFound: string[];
  currentLevel: number;
  playerPosition: { x: number; y: number; z: number };
  gameMode: 'explore' | 'learn' | 'challenge';
  audioEnabled: boolean;
  narrationEnabled: boolean;
}

interface GameContextType {
  gameState: GameState;
  updateScore: (points: number) => void;
  addFoundLetter: (letter: string) => void;
  setPlayerPosition: (position: { x: number; y: number; z: number }) => void;
  setGameMode: (mode: 'explore' | 'learn' | 'challenge') => void;
  toggleAudio: () => void;
  toggleNarration: () => void;
  announceToUser: (message: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    lettersFound: [],
    currentLevel: 1,
    playerPosition: { x: 0, y: 0, z: 0 },
    gameMode: 'explore',
    audioEnabled: true,
    narrationEnabled: true,
  });

  const updateScore = useCallback((points: number) => {
    setGameState(prev => ({ ...prev, score: prev.score + points }));
  }, []);

  const addFoundLetter = useCallback((letter: string) => {
    setGameState(prev => {
      if (!prev.lettersFound.includes(letter)) {
        return { ...prev, lettersFound: [...prev.lettersFound, letter] };
      }
      return prev;
    });
  }, []);

  const setPlayerPosition = useCallback((position: { x: number; y: number; z: number }) => {
    setGameState(prev => ({ ...prev, playerPosition: position }));
  }, []);

  const setGameMode = useCallback((mode: 'explore' | 'learn' | 'challenge') => {
    setGameState(prev => ({ ...prev, gameMode: mode }));
  }, []);

  const toggleAudio = useCallback(() => {
    setGameState(prev => ({ ...prev, audioEnabled: !prev.audioEnabled }));
  }, []);

  const toggleNarration = useCallback(() => {
    setGameState(prev => ({ ...prev, narrationEnabled: !prev.narrationEnabled }));
  }, []);

  const announceToUser = useCallback((message: string) => {
    // Use managed speech system
    if ((window as any).speakGameText) {
      (window as any).speakGameText(message, 'normal');
    }
  }, [gameState.narrationEnabled]);

  const value = {
    gameState,
    updateScore,
    addFoundLetter,
    setPlayerPosition,
    setGameMode,
    toggleAudio,
    toggleNarration,
    announceToUser,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};