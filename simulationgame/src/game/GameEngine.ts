import * as THREE from 'three';
import { AccessibilitySettings } from '../context/AccessibilityContext';

export class GameEngine {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private player: THREE.Object3D;
  private letters: THREE.Object3D[] = [];
  private animals: THREE.Object3D[] = [];
  private isAnimating = true;
  private keys: { [key: string]: boolean } = {};
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();

  constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.player = new THREE.Object3D();
    
    this.setupPlayer();
    this.setupControls();
    this.createInteractiveElements();
    this.animate();
  }

  private setupPlayer() {
    // Create simple player representation (invisible but used for positioning)
    const playerGeometry = new THREE.SphereGeometry(0.5, 8, 6);
    const playerMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x4A90E2, 
      transparent: true, 
      opacity: 0 
    });
    const playerMesh = new THREE.Mesh(playerGeometry, playerMaterial);
    this.player.add(playerMesh);
    this.player.position.set(0, 1, 5);
    this.scene.add(this.player);
  }

  private setupControls() {
    // Keyboard controls
    window.addEventListener('keydown', (event) => {
      this.keys[event.code] = true;
      
      // Accessibility: Announce key presses for screen readers
      const keyDescriptions: { [key: string]: string } = {
        'ArrowUp': 'Moving forward',
        'ArrowDown': 'Moving backward',
        'ArrowLeft': 'Turning left',
        'ArrowRight': 'Turning right',
        'KeyW': 'Moving forward',
        'KeyS': 'Moving backward',
        'KeyA': 'Moving left',
        'KeyD': 'Moving right',
        'Space': 'Interact with object',
        'Enter': 'Interact with object'
      };

      if (keyDescriptions[event.code]) {
        this.announceAction(keyDescriptions[event.code]);
      }
    });

    window.addEventListener('keyup', (event) => {
      this.keys[event.code] = false;
    });

    // Mouse/touch controls for clicking on objects
    this.renderer.domElement.addEventListener('click', (event) => {
      this.handleClick(event);
    });

    // Gamepad support for accessibility
    this.setupGamepadSupport();
  }

  private setupGamepadSupport() {
    const checkGamepad = () => {
      const gamepads = navigator.getGamepads();
      for (let i = 0; i < gamepads.length; i++) {
        const gamepad = gamepads[i];
        if (gamepad) {
          // Handle gamepad input for accessibility
          this.handleGamepadInput(gamepad);
        }
      }
      requestAnimationFrame(checkGamepad);
    };
    checkGamepad();
  }

  private handleGamepadInput(gamepad: Gamepad) {
    const threshold = 0.3;
    const now = Date.now();
    
    // Debounce gamepad input
    if (this.lastGamepadInput && (now - this.lastGamepadInput) < 100) {
      return;
    }
    
    // Left stick for movement
    if (Math.abs(gamepad.axes[0]) > threshold || Math.abs(gamepad.axes[1]) > threshold) {
      const moveX = gamepad.axes[0];
      const moveZ = gamepad.axes[1];
      
      this.player.position.x += moveX * 0.1;
      this.player.position.z += moveZ * 0.1;
      
      this.updateCameraPosition();
      this.lastGamepadInput = now;
    }

    // Button A for interaction
    if (gamepad.buttons[0].pressed) {
      this.interactWithNearestObject();
    }
  }

  private lastGamepadInput: number = 0;
  private lastMovementSound: number = 0;
  private lastInteractionTime: number = 0;
  private currentlySpeaking: boolean = false;
  private speechQueue: string[] = [];
  private lastAnnouncementTime: number = 0;

  private createInteractiveElements() {
    // Create hidden letters throughout the scene
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const letterPositions = [
      { x: 5, y: 2, z: 0 }, { x: -3, y: 1.5, z: -5 }, { x: 8, y: 3, z: -2 },
      { x: -6, y: 2.5, z: 3 }, { x: 2, y: 1, z: -8 }, { x: -4, y: 3.5, z: -1 },
      { x: 7, y: 2, z: 6 }, { x: -2, y: 1.5, z: -7 }, { x: 4, y: 4, z: -3 },
      { x: -8, y: 2, z: 2 }, { x: 6, y: 1, z: -6 }, { x: -1, y: 3, z: 5 },
      { x: 9, y: 2.5, z: -4 }, { x: -5, y: 1.5, z: -2 }, { x: 3, y: 3.5, z: 8 },
      { x: -7, y: 2, z: -5 }, { x: 1, y: 1, z: -9 }, { x: 5, y: 4, z: 1 },
      { x: -3, y: 2.5, z: 7 }, { x: 8, y: 1.5, z: -1 }, { x: -6, y: 3, z: -8 },
      { x: 2, y: 2, z: 4 }, { x: -4, y: 1, z: -6 }, { x: 7, y: 3.5, z: 3 },
      { x: -1, y: 2, z: -4 }, { x: 4, y: 1.5, z: 9 }
    ];

    for (let i = 0; i < alphabet.length; i++) {
      const letter = this.createFloatingLetter(alphabet[i], letterPositions[i]);
      this.letters.push(letter);
      this.scene.add(letter);
    }

    // Create friendly animal guides
    this.createAnimalGuides();
  }

  private createFloatingLetter(letter: string, position: { x: number; y: number; z: number }) {
    const group = new THREE.Group();
    
    // Create glowing bubble background
    const sphereGeometry = new THREE.SphereGeometry(1.2, 32, 24);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x87CEEB,
      emissive: 0x4169E1,
      transparent: true,
      opacity: 0.6
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    group.add(sphere);

    // Create high-contrast text for the letter
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = 256;
    canvas.height = 256;
    
    // Add background circle for better visibility
    context.fillStyle = 'rgba(255, 255, 255, 0.9)';
    context.beginPath();
    context.arc(128, 128, 100, 0, Math.PI * 2);
    context.fill();
    
    // Add letter with high contrast
    context.fillStyle = '#2D1B69';
    context.strokeStyle = '#FFFFFF';
    context.lineWidth = 4;
    context.font = 'bold 120px "Fredoka One", Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.strokeText(letter, 128, 128);
    context.fillText(letter, 128, 128);

    const texture = new THREE.CanvasTexture(canvas);
    const textMaterial = new THREE.MeshBasicMaterial({ 
      map: texture, 
      transparent: true 
    });
    const textGeometry = new THREE.PlaneGeometry(2, 2);
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.z = 0.2;
    group.add(textMesh);

    // Add magical glow effect
    const glowGeometry = new THREE.SphereGeometry(1.4, 16, 12);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xFFD700,
      transparent: true,
      opacity: 0.3
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    group.add(glow);

    group.position.set(position.x, position.y, position.z);
    group.userData = { type: 'letter', letter: letter, found: false };

    return group;
  }

  private createAnimalGuides() {
    const animalPositions = [
      { x: 3, y: 0, z: 2 },
      { x: -5, y: 0, z: -3 },
      { x: 7, y: 0, z: 4 }
    ];

    animalPositions.forEach((pos, index) => {
      const animal = this.createAnimal(index);
      animal.position.set(pos.x, pos.y, pos.z);
      this.animals.push(animal);
      this.scene.add(animal);
    });
  }

  private createAnimal(type: number) {
    const group = new THREE.Group();
    
    // Enhanced animal representations
    const colors = [0x8B4513, 0x4169E1, 0x32CD32]; // Brown, Blue, Green
    const animalTypes = ['🦌', '🦉', '🐿️'];
    
    // Create more detailed animal body
    const bodyGeometry = new THREE.CapsuleGeometry(0.6, 1.2, 4, 8);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: colors[type] });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    group.add(body);

    // Add detailed head
    const headGeometry = new THREE.SphereGeometry(0.6, 12, 8);
    const head = new THREE.Mesh(headGeometry, bodyMaterial);
    head.position.set(0, 1.2, 0.8);
    head.castShadow = true;
    group.add(head);
    
    // Add eyes
    const eyeGeometry = new THREE.SphereGeometry(0.1, 8, 6);
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.2, 1.3, 1.2);
    group.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.2, 1.3, 1.2);
    group.add(rightEye);
    
    // Add ears for some animals
    if (type === 0 || type === 2) { // Deer or squirrel
      const earGeometry = new THREE.ConeGeometry(0.2, 0.4, 6);
      const leftEar = new THREE.Mesh(earGeometry, bodyMaterial);
      leftEar.position.set(-0.3, 1.6, 0.6);
      leftEar.rotation.z = -0.3;
      group.add(leftEar);
      
      const rightEar = new THREE.Mesh(earGeometry, bodyMaterial);
      rightEar.position.set(0.3, 1.6, 0.6);
      rightEar.rotation.z = 0.3;
      group.add(rightEar);
    }
    
    // Add tail
    const tailGeometry = new THREE.SphereGeometry(0.3, 8, 6);
    const tail = new THREE.Mesh(tailGeometry, bodyMaterial);
    tail.position.set(0, 0.5, -1);
    tail.scale.set(0.8, 0.8, 1.5);
    group.add(tail);

    group.userData = { 
      type: 'animal', 
      animalType: type, 
      emoji: animalTypes[type],
      greeting: `Hello! I'm a friendly ${['deer', 'owl', 'squirrel'][type]}. Let me help you find letters!`
    };

    return group;
  }

  private handleClick(event: MouseEvent) {
    // Calculate mouse position in normalized device coordinates
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Cast ray from camera through mouse position
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    // Check for intersections with interactive objects
    const allInteractables = [...this.letters, ...this.animals];
    const intersects = this.raycaster.intersectObjects(allInteractables, true);

    if (intersects.length > 0) {
      const clickedObject = intersects[0].object.parent || intersects[0].object;
      this.interactWithObject(clickedObject);
    }
  }

  private interactWithObject(object: THREE.Object3D) {
    if (object.userData.type === 'letter' && !object.userData.found) {
      this.collectLetter(object);
    } else if (object.userData.type === 'animal') {
      this.talkToAnimal(object);
    }
  }

  private collectLetter(letterObject: THREE.Object3D) {
    const now = Date.now();
    
    // Prevent rapid collection sounds
    if (this.lastInteractionTime && (now - this.lastInteractionTime) < 2000) {
      return;
    }
    
    this.lastInteractionTime = now;
    letterObject.userData.found = true;
    
    // Play success animation
    const targetScale = 2;
    const originalScale = letterObject.scale.clone();
    
    const animateCollection = () => {
      letterObject.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      letterObject.rotation.y += 0.2;
      
      if (letterObject.scale.x < targetScale * 0.9) {
        requestAnimationFrame(animateCollection);
      } else {
        // Make letter disappear with fade effect
        const material = (letterObject.children[0] as THREE.Mesh).material as THREE.MeshPhongMaterial;
        material.transparent = true;
        
        const fadeOut = () => {
          material.opacity -= 0.05;
          if (material.opacity > 0) {
            requestAnimationFrame(fadeOut);
          } else {
            letterObject.visible = false;
          }
        };
        fadeOut();
      }
    };
    animateCollection();

    // Announce letter collection
    const letter = letterObject.userData.letter;
    const message = `Wonderful! You found the letter ${letter}! ${letter} is for ${this.getWordForLetter(letter)}`;
    this.announceAction(message, 'high');
    
    // Play success sound
    if ((window as any).playGameSound) {
      (window as any).playGameSound('success');
    }

    // Update game state (this would normally go through the React context)
    this.updateGameState(letter);
    
    // Add visual celebration effect
    this.createCelebrationEffect(letterObject.position);
  }

  private talkToAnimal(animalObject: THREE.Object3D) {
    const now = Date.now();
    
    // Prevent spam clicking on animals
    if (this.lastInteractionTime && (now - this.lastInteractionTime) < 3000) {
      return;
    }
    
    this.lastInteractionTime = now;
    
    const greeting = animalObject.userData.greeting;
    const emoji = animalObject.userData.emoji;
    
    // Animate animal
    const originalY = animalObject.position.y;
    const animateGreeting = () => {
      animalObject.position.y = originalY + Math.sin(Date.now() * 0.01) * 0.2;
      animalObject.rotation.y += 0.05;
    };
    
    const greetingAnimation = setInterval(animateGreeting, 16);
    setTimeout(() => clearInterval(greetingAnimation), 2000);

    this.announceAction(`${emoji} ${greeting}`, 'normal');
    
    if ((window as any).playGameSound) {
      (window as any).playGameSound('interaction');
    }
  }

  private interactWithNearestObject() {
    // Find nearest interactive object for gamepad/one-button mode
    const playerPosition = this.player.position;
    let nearestObject: THREE.Object3D | null = null;
    let nearestDistance = Infinity;

    [...this.letters, ...this.animals].forEach(obj => {
      const distance = playerPosition.distanceTo(obj.position);
      if (distance < nearestDistance && distance < 5) {
        nearestDistance = distance;
        nearestObject = obj;
      }
    });

    if (nearestObject) {
      this.interactWithObject(nearestObject);
    }
  }

  private getWordForLetter(letter: string): string {
    const words: { [key: string]: string } = {
      'A': 'Apple', 'B': 'Ball', 'C': 'Cat', 'D': 'Dog', 'E': 'Elephant',
      'F': 'Fish', 'G': 'Giraffe', 'H': 'House', 'I': 'Ice cream', 'J': 'Jump',
      'K': 'Kite', 'L': 'Lion', 'M': 'Moon', 'N': 'Nest', 'O': 'Orange',
      'P': 'Penguin', 'Q': 'Queen', 'R': 'Rainbow', 'S': 'Sun', 'T': 'Tree',
      'U': 'Umbrella', 'V': 'Violin', 'W': 'Water', 'X': 'X-ray', 'Y': 'Yellow', 'Z': 'Zebra'
    };
    return words[letter] || letter;
  }

  private updateCameraPosition() {
    // Smooth camera follow
    const idealCameraPosition = new THREE.Vector3(
      this.player.position.x,
      this.player.position.y + 5,
      this.player.position.z + 10
    );
    
    this.camera.position.lerp(idealCameraPosition, 0.05);
    this.camera.lookAt(this.player.position);
  }

  private handleMovement() {
    const moveSpeed = 0.1;
    const now = Date.now();
    let moved = false;

    if (this.keys['ArrowUp'] || this.keys['KeyW']) {
      this.player.position.z -= moveSpeed;
      moved = true;
    }
    if (this.keys['ArrowDown'] || this.keys['KeyS']) {
      this.player.position.z += moveSpeed;
      moved = true;
    }
    if (this.keys['ArrowLeft'] || this.keys['KeyA']) {
      this.player.position.x -= moveSpeed;
      moved = true;
    }
    if (this.keys['ArrowRight'] || this.keys['KeyD']) {
      this.player.position.x += moveSpeed;
      moved = true;
    }

    if (moved) {
      this.updateCameraPosition();
      
      // Play movement sound occasionally
      if (this.lastMovementSound === 0 || (now - this.lastMovementSound) > 2000) {
        this.lastMovementSound = now;
        if ((window as any).playGameSound) {
          (window as any).playGameSound('movement', 2000);
        }
      }
    }

    // Interaction keys
    if (this.keys['Space'] || this.keys['Enter']) {
      this.interactWithNearestObject();
      this.keys['Space'] = false;
      this.keys['Enter'] = false;
    }
  }

  private animate = () => {
    if (!this.isAnimating) return;

    this.handleMovement();

    // Animate floating letters
    this.letters.forEach((letter, index) => {
      if (!letter.userData.found) {
        letter.rotation.y += 0.01;
        letter.position.y += Math.sin(Date.now() * 0.001 + index) * 0.001;
      }
    });

    // Animate animals
    this.animals.forEach((animal, index) => {
      animal.position.y += Math.sin(Date.now() * 0.002 + index * 2) * 0.002;
    });

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate);
  };

  private announceAction(message: string, priority: 'high' | 'normal' = 'normal') {
    const now = Date.now();
    
    // Prevent announcement spam
    if (priority === 'normal' && this.lastAnnouncementTime && (now - this.lastAnnouncementTime) < 1000) {
      return;
    }
    
    this.lastAnnouncementTime = now;
    
    // This would normally use the React context
    const announcements = document.getElementById('announcements');
    if (announcements) {
      announcements.textContent = message;
    }
    // Use managed speech system
    if ((window as any).speakGameText) {
      (window as any).speakGameText(message, priority);
    }
  }

  private updateGameState(letter: string) {
    // This would normally dispatch to React context
    console.log(`Letter ${letter} collected!`);
  }

  public updateAccessibilitySettings(settings: any) {
    // Apply accessibility settings to the 3D scene
    if (settings.highContrast) {
      this.renderer.setClearColor(0x000000, 1);
    } else {
      this.renderer.setClearColor(0x87CEEB, 1);
    }

    // Update material properties for high contrast
    this.letters.forEach(letter => {
      if (settings.highContrast) {
        const material = (letter.children[0] as THREE.Mesh).material as THREE.MeshPhongMaterial;
        material.color.setHex(0xFFFFFF);
        material.emissive.setHex(0xFFFFFF);
      }
    });
  }

  public dispose() {
    this.isAnimating = false;
    
    // Clear any pending audio
    if ((window as any).clearSpeechQueue) {
      (window as any).clearSpeechQueue();
    }
    
    // Clean up resources
  }
  
  private createCelebrationEffect(position: THREE.Vector3) {
    // Create particle effect for letter collection
    for (let i = 0; i < 10; i++) {
      const particle = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 6, 4),
        new THREE.MeshBasicMaterial({ color: 0xFFD700, transparent: true, opacity: 0.8 })
      );
      
      particle.position.copy(position);
      particle.position.add(new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        Math.random() * 2,
        (Math.random() - 0.5) * 2
      ));
      
      this.scene.add(particle);
      
      // Animate particle
      const animateParticle = () => {
        particle.position.y += 0.05;
        particle.material.opacity -= 0.02;
        
        if (particle.material.opacity > 0) {
          requestAnimationFrame(animateParticle);
        } else {
          this.scene.remove(particle);
        }
      };
      
      setTimeout(() => animateParticle(), i * 100);
    }
  }
}