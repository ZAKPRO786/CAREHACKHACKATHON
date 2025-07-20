import * as THREE from 'three';

export function createForestScene(scene: THREE.Scene) {
  // Create magical angels
  createAngels(scene);
  
  // Create ground
  const groundGeometry = new THREE.PlaneGeometry(100, 100);
  const groundMaterial = new THREE.MeshLambertMaterial({ 
    color: 0x4A7C59,
    transparent: true,
    opacity: 0.8
  });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Create magical forest elements
  createTrees(scene);
  createFlowers(scene);
  createMagicalEffects(scene);
  createPaths(scene);
}

function createTrees(scene: THREE.Scene) {
  const treePositions = [
    { x: 10, z: 10 }, { x: -15, z: 8 }, { x: 20, z: -5 }, { x: -8, z: -12 },
    { x: 5, z: 15 }, { x: -20, z: -8 }, { x: 15, z: -15 }, { x: -12, z: 5 },
    { x: 25, z: 0 }, { x: -5, z: 20 }, { x: 18, z: 12 }, { x: -25, z: 15 },
    { x: 8, z: -20 }, { x: -18, z: -15 }, { x: 12, z: 25 }, { x: 0, z: -25 }
  ];

  treePositions.forEach((pos, index) => {
    const tree = createTree(index);
    tree.position.set(pos.x, 0, pos.z);
    scene.add(tree);
  });
}

function createTree(variant: number) {
  const tree = new THREE.Group();
  
  // Tree trunk
  const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.8, 4, 8);
  const trunkMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
  trunk.position.y = 2;
  trunk.castShadow = true;
  tree.add(trunk);

  // Tree foliage
  const foliageGeometry = new THREE.SphereGeometry(3 + variant * 0.5, 8, 6);
  const foliageColors = [0x228B22, 0x32CD32, 0x90EE90, 0x00FF00];
  const foliageMaterial = new THREE.MeshPhongMaterial({ 
    color: foliageColors[variant % foliageColors.length] 
  });
  const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
  foliage.position.y = 5 + variant * 0.3;
  foliage.castShadow = true;
  tree.add(foliage);

  // Add magical sparkles
  for (let i = 0; i < 5; i++) {
    const sparkle = createSparkle();
    sparkle.position.set(
      (Math.random() - 0.5) * 6,
      4 + Math.random() * 3,
      (Math.random() - 0.5) * 6
    );
    tree.add(sparkle);
  }

  return tree;
}

function createSparkle() {
  const sparkleGeometry = new THREE.SphereGeometry(0.05, 6, 4);
  const sparkleMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xFFFFFF,
    transparent: true,
    opacity: 0.8
  });
  const sparkle = new THREE.Mesh(sparkleGeometry, sparkleMaterial);
  
  // Animate sparkle
  const animateSparkle = () => {
    sparkle.material.opacity = 0.3 + Math.sin(Date.now() * 0.005) * 0.5;
    sparkle.rotation.y += 0.02;
    requestAnimationFrame(animateSparkle);
  };
  animateSparkle();

  return sparkle;
}

function createFlowers(scene: THREE.Scene) {
  const flowerPositions = [
    { x: 3, z: 3 }, { x: -2, z: 4 }, { x: 6, z: -2 }, { x: -4, z: -3 },
    { x: 1, z: 6 }, { x: -6, z: 1 }, { x: 4, z: -5 }, { x: -1, z: -6 }
  ];

  flowerPositions.forEach((pos, index) => {
    const flower = createFlower(index);
    flower.position.set(pos.x, 0.1, pos.z);
    scene.add(flower);
  });
}

function createFlower(variant: number) {
  const flower = new THREE.Group();
  
  // Flower stem
  const stemGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 6);
  const stemMaterial = new THREE.MeshPhongMaterial({ color: 0x228B22 });
  const stem = new THREE.Mesh(stemGeometry, stemMaterial);
  stem.position.y = 0.5;
  flower.add(stem);

  // Flower petals
  const petalColors = [0xFF69B4, 0xFF1493, 0xFFB6C1, 0xFF6347, 0xFFA500, 0xFFD700];
  const petalGeometry = new THREE.SphereGeometry(0.3, 6, 4);
  const petalMaterial = new THREE.MeshPhongMaterial({ 
    color: petalColors[variant % petalColors.length] 
  });
  
  for (let i = 0; i < 6; i++) {
    const petal = new THREE.Mesh(petalGeometry, petalMaterial);
    const angle = (i / 6) * Math.PI * 2;
    petal.position.set(
      Math.cos(angle) * 0.4,
      1,
      Math.sin(angle) * 0.4
    );
    petal.scale.set(0.8, 0.3, 0.8);
    flower.add(petal);
  }

  // Flower center
  const centerGeometry = new THREE.SphereGeometry(0.2, 8, 6);
  const centerMaterial = new THREE.MeshPhongMaterial({ color: 0xFFD700 });
  const center = new THREE.Mesh(centerGeometry, centerMaterial);
  center.position.y = 1;
  flower.add(center);

  return flower;
}

function createMagicalEffects(scene: THREE.Scene) {
  // Create floating magical orbs
  for (let i = 0; i < 10; i++) {
    const orb = createMagicalOrb();
    orb.position.set(
      (Math.random() - 0.5) * 50,
      2 + Math.random() * 8,
      (Math.random() - 0.5) * 50
    );
    scene.add(orb);
  }
}

function createMagicalOrb() {
  const orbGeometry = new THREE.SphereGeometry(0.2, 8, 6);
  const orbMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x00FFFF,
    transparent: true,
    opacity: 0.6
  });
  const orb = new THREE.Mesh(orbGeometry, orbMaterial);
  
  // Animate floating orb
  const originalY = orb.position.y;
  const animateOrb = () => {
    orb.position.y = originalY + Math.sin(Date.now() * 0.003) * 2;
    orb.rotation.x += 0.01;
    orb.rotation.y += 0.015;
    orb.material.opacity = 0.3 + Math.sin(Date.now() * 0.004) * 0.3;
    requestAnimationFrame(animateOrb);
  };
  animateOrb();

  return orb;
}

function createPaths(scene: THREE.Scene) {
  // Create winding paths through the forest
  const pathGeometry = new THREE.PlaneGeometry(2, 50);
  const pathMaterial = new THREE.MeshLambertMaterial({ 
    color: 0xDEB887,
    transparent: true,
    opacity: 0.7
  });
  
  // Main path
  const mainPath = new THREE.Mesh(pathGeometry, pathMaterial);
  mainPath.rotation.x = -Math.PI / 2;
  mainPath.position.y = 0.01;
  scene.add(mainPath);

  // Cross path
  const crossPath = new THREE.Mesh(pathGeometry, pathMaterial);
  crossPath.rotation.x = -Math.PI / 2;
  crossPath.rotation.y = Math.PI / 2;
  crossPath.position.y = 0.01;
  scene.add(crossPath);
}

function createAngels(scene: THREE.Scene) {
  const angelPositions = [
    { x: 0, y: 8, z: 0 },
    { x: 15, y: 6, z: 10 },
    { x: -12, y: 7, z: -8 }
  ];

  angelPositions.forEach((pos, index) => {
    const angel = createAngel(index);
    angel.position.set(pos.x, pos.y, pos.z);
    scene.add(angel);
  });
}

function createAngel(variant: number) {
  const angel = new THREE.Group();
  
  // Angel body (glowing white/golden)
  const bodyGeometry = new THREE.CapsuleGeometry(0.4, 1.5, 4, 8);
  const bodyMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xFFFAF0,
    emissive: 0xFFD700,
    emissiveIntensity: 0.2
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.castShadow = true;
  angel.add(body);
  
  // Angel head
  const headGeometry = new THREE.SphereGeometry(0.5, 12, 8);
  const head = new THREE.Mesh(headGeometry, bodyMaterial);
  head.position.set(0, 1.2, 0);
  head.castShadow = true;
  angel.add(head);
  
  // Angel halo
  const haloGeometry = new THREE.TorusGeometry(0.6, 0.05, 8, 16);
  const haloMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xFFD700,
    emissive: 0xFFD700,
    emissiveIntensity: 0.8
  });
  const halo = new THREE.Mesh(haloGeometry, haloMaterial);
  halo.position.set(0, 2, 0);
  halo.rotation.x = Math.PI / 2;
  angel.add(halo);
  
  // Angel wings
  const wingGeometry = new THREE.SphereGeometry(1, 8, 6);
  const wingMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xF0F8FF,
    transparent: true,
    opacity: 0.8,
    emissive: 0xE6E6FA,
    emissiveIntensity: 0.1
  });
  
  const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
  leftWing.position.set(-1.2, 0.5, -0.3);
  leftWing.scale.set(0.8, 1.5, 0.3);
  leftWing.rotation.z = 0.3;
  angel.add(leftWing);
  
  const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
  rightWing.position.set(1.2, 0.5, -0.3);
  rightWing.scale.set(0.8, 1.5, 0.3);
  rightWing.rotation.z = -0.3;
  angel.add(rightWing);
  
  // Add gentle floating animation
  const originalY = angel.position.y;
  const animateAngel = () => {
    angel.position.y = originalY + Math.sin(Date.now() * 0.002 + variant) * 0.5;
    angel.rotation.y += 0.005;
    
    // Animate wings
    leftWing.rotation.z = 0.3 + Math.sin(Date.now() * 0.008) * 0.2;
    rightWing.rotation.z = -0.3 - Math.sin(Date.now() * 0.008) * 0.2;
    
    // Animate halo
    halo.rotation.z += 0.01;
    
    requestAnimationFrame(animateAngel);
  };
  animateAngel();
  
  angel.userData = { 
    type: 'angel', 
    variant: variant,
    greeting: `Hello little explorer! I'm your guardian angel. Let me guide you to find magical letters! ✨`
  };
  
  return angel;
}