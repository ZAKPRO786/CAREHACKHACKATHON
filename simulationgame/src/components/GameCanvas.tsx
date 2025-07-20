import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useGame } from '../context/GameContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { createForestScene } from '../game/scenes/ForestScene';
import { GameEngine } from '../game/GameEngine';

const GameCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const { gameState, announceToUser } = useGame();
  const { settings } = useAccessibility();

  useEffect(() => {
    if (!mountRef.current) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x87CEEB, 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    mountRef.current.appendChild(renderer.domElement);

    // Create forest scene
    createForestScene(scene);

    // Initialize game engine
    const gameEngine = new GameEngine(scene, camera, renderer);
    gameEngineRef.current = gameEngine;

    // Set up camera position
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 50, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      gameEngine.dispose();
      renderer.dispose();
    };
  }, []);

  // Update game engine with accessibility settings
  useEffect(() => {
    if (gameEngineRef.current) {
      gameEngineRef.current.updateAccessibilitySettings(settings);
    }
  }, [settings]);

  return (
    <div 
      ref={mountRef} 
      className="w-full h-full"
      role="img"
      aria-label="3D magical forest game world. Use arrow keys or WASD to explore and find hidden letters."
      tabIndex={0}
    />
  );
};

export default GameCanvas;