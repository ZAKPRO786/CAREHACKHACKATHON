import React, { useEffect, useRef, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { useAccessibility } from '../context/AccessibilityContext';

interface AudioState {
  isPlaying: boolean;
  currentSound: string | null;
  lastPlayTime: number;
}

const AudioManager: React.FC = () => {
  const { gameState } = useGame();
  const { settings } = useAccessibility();
  const audioContextRef = useRef<AudioContext | null>(null);
  const backgroundMusicRef = useRef<AudioBufferSourceNode | null>(null);
  const soundQueueRef = useRef<string[]>([]);
  const audioStateRef = useRef<AudioState>({
    isPlaying: false,
    currentSound: null,
    lastPlayTime: 0
  });
  const speechQueueRef = useRef<string[]>([]);
  const isSpeakingRef = useRef(false);

  // Initialize audio context
  useEffect(() => {
    if (!audioContextRef.current && gameState.audioEnabled) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (error) {
        console.warn('Web Audio API not supported:', error);
      }
    }
  }, [gameState.audioEnabled]);

  // Background ambience management
  useEffect(() => {
    if (gameState.audioEnabled && settings.soundEffectsEnabled) {
      startBackgroundAmbience();
    } else {
      stopBackgroundAmbience();
    }

    return () => stopBackgroundAmbience();
  }, [gameState.audioEnabled, settings.soundEffectsEnabled]);

  const startBackgroundAmbience = useCallback(() => {
    if (!audioContextRef.current || backgroundMusicRef.current) return;

    try {
      const audioContext = audioContextRef.current;
      
      // Create gentle forest ambience
      const gainNode = audioContext.createGain();
      gainNode.gain.setValueAtTime(0.05, audioContext.currentTime); // Very quiet background
      gainNode.connect(audioContext.destination);

      // Create wind sound buffer
      const windBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 4, audioContext.sampleRate);
      const windData = windBuffer.getChannelData(0);
      
      for (let i = 0; i < windData.length; i++) {
        windData[i] = (Math.random() * 2 - 1) * 0.2;
      }

      const windSource = audioContext.createBufferSource();
      windSource.buffer = windBuffer;
      windSource.loop = true;

      // Low-pass filter for gentle wind sound
      const windFilter = audioContext.createBiquadFilter();
      windFilter.type = 'lowpass';
      windFilter.frequency.setValueAtTime(600, audioContext.currentTime);
      windFilter.Q.setValueAtTime(1, audioContext.currentTime);

      windSource.connect(windFilter);
      windFilter.connect(gainNode);
      windSource.start();

      backgroundMusicRef.current = windSource;
    } catch (error) {
      console.warn('Failed to start background ambience:', error);
    }
  }, []);

  const stopBackgroundAmbience = useCallback(() => {
    if (backgroundMusicRef.current) {
      try {
        backgroundMusicRef.current.stop();
        backgroundMusicRef.current.disconnect();
      } catch (error) {
        console.warn('Error stopping background music:', error);
      }
      backgroundMusicRef.current = null;
    }
  }, []);

  // Synchronized speech management
  const speakText = useCallback((text: string, priority: 'high' | 'normal' = 'normal') => {
    if (!gameState.narrationEnabled || !('speechSynthesis' in window)) return;

    // Clear queue for high priority messages
    if (priority === 'high') {
      speechSynthesis.cancel();
      speechQueueRef.current = [];
      isSpeakingRef.current = false;
    }

    // Add to queue
    speechQueueRef.current.push(text);
    processNextSpeech();
  }, [gameState.narrationEnabled]);

  const processNextSpeech = useCallback(() => {
    if (isSpeakingRef.current || speechQueueRef.current.length === 0) return;

    const nextText = speechQueueRef.current.shift();
    if (!nextText) return;

    isSpeakingRef.current = true;

    const utterance = new SpeechSynthesisUtterance(nextText);
    utterance.rate = 0.8;
    utterance.pitch = 1.1;
    utterance.volume = 0.8;
    utterance.lang = 'en-US';

    utterance.onend = () => {
      isSpeakingRef.current = false;
      // Process next item in queue after a short pause
      setTimeout(processNextSpeech, 500);
    };

    utterance.onerror = () => {
      isSpeakingRef.current = false;
      setTimeout(processNextSpeech, 100);
    };

    speechSynthesis.speak(utterance);
  }, []);

  // Sound effect management with debouncing
  const playSound = useCallback((soundType: string, debounceMs: number = 1000) => {
    if (!audioContextRef.current || !gameState.audioEnabled || !settings.soundEffectsEnabled) return;

    const now = Date.now();
    const audioState = audioStateRef.current;

    // Prevent rapid-fire sounds of the same type
    if (audioState.currentSound === soundType && (now - audioState.lastPlayTime) < debounceMs) {
      return;
    }

    audioState.currentSound = soundType;
    audioState.lastPlayTime = now;

    try {
      const audioContext = audioContextRef.current;
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Different sounds for different events
      switch (soundType) {
        case 'success':
          // Happy ascending chord
          oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
          oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
          oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.6);
          break;

        case 'interaction':
          // Gentle chime
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
          gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.3);
          break;

        case 'movement':
          // Soft footstep
          oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.1);
          break;

        default:
          oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
          gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.2);
      }
    } catch (error) {
      console.warn('Failed to play sound:', error);
    }
  }, [gameState.audioEnabled, settings.soundEffectsEnabled]);

  // Expose functions globally for game engine
  useEffect(() => {
    (window as any).playGameSound = playSound;
    (window as any).speakGameText = speakText;
    (window as any).clearSpeechQueue = () => {
      speechSynthesis.cancel();
      speechQueueRef.current = [];
      isSpeakingRef.current = false;
    };
  }, [playSound, speakText]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopBackgroundAmbience();
      speechSynthesis.cancel();
      speechQueueRef.current = [];
      isSpeakingRef.current = false;
    };
  }, [stopBackgroundAmbience]);

  return null;
};
export default AudioManager;
