import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RotateCcw, Sliders, Sparkles, Eye, Layers, Shield, Compass } from 'lucide-react';

export default function HeroSculptureEngine() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // HUD & Telemetry State
  const [activeLighting, setActiveLighting] = useState<'studio' | 'amber' | 'dramatic'>('studio');
  const [isInteracting, setIsInteracting] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);
  const [fps, setFps] = useState<number>(60);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const rimLightRef = useRef<THREE.DirectionalLight | null>(null);
  const coreLightRef = useRef<THREE.PointLight | null>(null);

  // Interactive control references
  const targetRotationRef = useRef({ x: 0.12, y: -0.32 });
  const currentRotationRef = useRef({ x: 0.12, y: -0.32 });
  const mousePosRef = useRef({ x: 0, y: 0 });
  const isPointerDownRef = useRef(false);
  const pointerStartRef = useRef({ x: 0, y: 0 });
  const rotationStartRef = useRef({ x: 0.12, y: -0.32 });
  const animFrameIdRef = useRef<number | null>(null);
  const isVisibleRef = useRef(true);

  // Check WebGL availability and motion preference
  useEffect(() => {
    try {
      const testCanvas = document.createElement('canvas');
      const gl = !!(window.WebGLRenderingContext && (testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl')));
      setWebglSupported(gl);
    } catch {
      setWebglSupported(false);
    }

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(motionQuery.matches);
    const motionHandler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    motionQuery.addEventListener('change', motionHandler);
    return () => motionQuery.removeEventListener('change', motionHandler);
  }, []);

  // Update studio lighting preset
  const setLightingPreset = useCallback((preset: 'studio' | 'amber' | 'dramatic') => {
    setActiveLighting(preset);
    if (!keyLightRef.current || !rimLightRef.current || !coreLightRef.current) return;

    if (preset === 'studio') {
      keyLightRef.current.color.setHex(0xffeedd);
      keyLightRef.current.intensity = 3.2;
      rimLightRef.current.color.setHex(0xf59e0b);
      rimLightRef.current.intensity = 4.5;
      coreLightRef.current.color.setHex(0xf59e0b);
      coreLightRef.current.intensity = 2.4;
    } else if (preset === 'amber') {
      keyLightRef.current.color.setHex(0xfbbf24);
      keyLightRef.current.intensity = 4.0;
      rimLightRef.current.color.setHex(0xea580c);
      rimLightRef.current.intensity = 5.5;
      coreLightRef.current.color.setHex(0xd97706);
      coreLightRef.current.intensity = 3.6;
    } else {
      keyLightRef.current.color.setHex(0xffffff);
      keyLightRef.current.intensity = 1.8;
      rimLightRef.current.color.setHex(0xf59e0b);
      rimLightRef.current.intensity = 7.0;
      coreLightRef.current.color.setHex(0xffedd5);
      coreLightRef.current.intensity = 1.6;
    }
  }, []);

  const resetView = useCallback(() => {
    targetRotationRef.current = { x: 0.12, y: -0.32 };
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current || !webglSupported) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 460;

    // 1. SCENE SETUP
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. CAMERA SETUP - Refined 36° FOV with clean headroom and breathing room
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0.25, 7.4);
    cameraRef.current = camera;

    // 3. RENDERER SETUP - PBR tone mapping & antialiasing
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // 4. STUDIO ENVIRONMENT (Procedural PMREM Studio Texture)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const envCanvas = document.createElement('canvas');
    envCanvas.width = 1024;
    envCanvas.height = 512;
    const envCtx = envCanvas.getContext('2d');
    if (envCtx) {
      // Dark cyclorama background
      const grad = envCtx.createLinearGradient(0, 0, 0, 512);
      grad.addColorStop(0, '#04070d');
      grad.addColorStop(0.48, '#0b111e');
      grad.addColorStop(0.52, '#141d2e');
      grad.addColorStop(1, '#060a12');
      envCtx.fillStyle = grad;
      envCtx.fillRect(0, 0, 1024, 512);

      // Studio Softbox 1 (Warm Key upper-right)
      const keySoftbox = envCtx.createRadialGradient(780, 120, 10, 780, 120, 240);
      keySoftbox.addColorStop(0, 'rgba(255, 230, 200, 0.95)');
      keySoftbox.addColorStop(0.4, 'rgba(245, 158, 11, 0.45)');
      keySoftbox.addColorStop(1, 'rgba(0, 0, 0, 0)');
      envCtx.fillStyle = keySoftbox;
      envCtx.fillRect(500, 0, 524, 340);

      // Studio Softbox 2 (Cool fill upper-left)
      const fillSoftbox = envCtx.createRadialGradient(240, 160, 20, 240, 160, 220);
      fillSoftbox.addColorStop(0, 'rgba(180, 210, 255, 0.6)');
      fillSoftbox.addColorStop(0.6, 'rgba(70, 100, 150, 0.2)');
      fillSoftbox.addColorStop(1, 'rgba(0, 0, 0, 0)');
      envCtx.fillStyle = fillSoftbox;
      envCtx.fillRect(0, 0, 500, 340);

      // Rim Light Stripe (lower back)
      const rimStripe = envCtx.createLinearGradient(0, 380, 1024, 380);
      rimStripe.addColorStop(0, 'rgba(245, 158, 11, 0)');
      rimStripe.addColorStop(0.5, 'rgba(251, 191, 36, 0.7)');
      rimStripe.addColorStop(1, 'rgba(245, 158, 11, 0)');
      envCtx.fillStyle = rimStripe;
      envCtx.fillRect(0, 360, 1024, 40);

      const envTexture = new THREE.CanvasTexture(envCanvas);
      envTexture.mapping = THREE.EquirectangularReflectionMapping;
      const envMap = pmremGenerator.fromEquirectangular(envTexture).texture;
      scene.environment = envMap;
      envTexture.dispose();
      pmremGenerator.dispose();
    }

    // 5. STUDIO LIGHTING RIG
    const ambientLight = new THREE.AmbientLight(0x0c121e, 1.2);
    scene.add(ambientLight);

    // Warm Key Light (Directional, angled upper-right)
    const keyLight = new THREE.DirectionalLight(0xffeedd, 3.2);
    keyLight.position.set(5.5, 6.5, 4.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 20;
    keyLight.shadow.bias = -0.0002;
    keyLight.shadow.radius = 4;
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    // Cool Fill Light (Directional, left)
    const fillLight = new THREE.DirectionalLight(0x7da4d4, 1.4);
    fillLight.position.set(-6, 3, -3);
    scene.add(fillLight);

    // Golden Rim Backlight
    const rimLight = new THREE.DirectionalLight(0xf59e0b, 4.5);
    rimLight.position.set(0, -3.5, -6.5);
    scene.add(rimLight);
    rimLightRef.current = rimLight;

    // Overhead Diffuser
    const topLight = new THREE.DirectionalLight(0xffffff, 0.8);
    topLight.position.set(0, 8, 1);
    scene.add(topLight);

    // Core Internal Amber Point Light
    const corePointLight = new THREE.PointLight(0xf59e0b, 2.5, 6, 1.8);
    corePointLight.position.set(0, 0, 0);
    scene.add(corePointLight);
    coreLightRef.current = corePointLight;

    // 6. MASTER PBR MATERIALS
    const graphiteMaterial = new THREE.MeshStandardMaterial({
      color: 0x141822,
      roughness: 0.28,
      metalness: 0.88,
      envMapIntensity: 1.4
    });

    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xefa935,
      roughness: 0.22,
      metalness: 0.94,
      envMapIntensity: 2.4
    });

    const aluminumMaterial = new THREE.MeshStandardMaterial({
      color: 0x2e3848,
      roughness: 0.18,
      metalness: 0.92,
      envMapIntensity: 2.0
    });

    const smokedGlassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x182030,
      transmission: 0.9,
      opacity: 1,
      transparent: true,
      roughness: 0.12,
      ior: 1.54,
      thickness: 1.2,
      attenuationColor: new THREE.Color(0xffaa33),
      attenuationDistance: 2.8,
      envMapIntensity: 2.2
    });

    const amberCrystalMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xff9900,
      emissive: 0xd97706,
      emissiveIntensity: 0.85,
      roughness: 0.15,
      transmission: 0.85,
      thickness: 0.9,
      envMapIntensity: 2.0
    });

    // 7. HIERARCHICAL 3D SCULPTURE ASSEMBLY
    const masterSculptureGroup = new THREE.Group();
    scene.add(masterSculptureGroup);

    const coreGroup = new THREE.Group();
    const ring1Group = new THREE.Group();
    const ring2Group = new THREE.Group();
    const outerFrameGroup = new THREE.Group();
    const glassBladesGroup = new THREE.Group();

    masterSculptureGroup.add(coreGroup);
    masterSculptureGroup.add(ring1Group);
    masterSculptureGroup.add(ring2Group);
    masterSculptureGroup.add(outerFrameGroup);
    masterSculptureGroup.add(glassBladesGroup);

    // Kinetic Core
    const coreGeo = new THREE.IcosahedronGeometry(0.68, 0);
    const coreMesh = new THREE.Mesh(coreGeo, amberCrystalMaterial);
    coreMesh.castShadow = true;
    coreGroup.add(coreMesh);

    // Inner gold geometric scaffold
    const innerScaffoldGeo = new THREE.OctahedronGeometry(0.92, 0);
    const scaffoldWireGeo = new THREE.WireframeGeometry(innerScaffoldGeo);
    const scaffoldLines = new THREE.LineSegments(
      scaffoldWireGeo,
      new THREE.LineBasicMaterial({ color: 0xfbbf24, linewidth: 2, transparent: true, opacity: 0.8 })
    );
    coreGroup.add(scaffoldLines);

    // Central Optic Shaft
    const centralShaftGeo = new THREE.CylinderGeometry(0.055, 0.055, 2.4, 32);
    const centralShaftMesh = new THREE.Mesh(centralShaftGeo, goldMaterial);
    coreGroup.add(centralShaftMesh);

    [-0.75, -0.38, 0.38, 0.75].forEach((yPos) => {
      const collarGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.07, 24);
      const collarMesh = new THREE.Mesh(collarGeo, aluminumMaterial);
      collarMesh.position.y = yPos;
      coreGroup.add(collarMesh);
    });

    // Ring 1 (Inner Gold Ring)
    const ring1Geo = new THREE.TorusGeometry(1.42, 0.046, 24, 84);
    const ring1Mesh = new THREE.Mesh(ring1Geo, goldMaterial);
    ring1Mesh.rotation.x = Math.PI / 3;
    ring1Mesh.rotation.y = Math.PI / 6;
    ring1Mesh.castShadow = true;
    ring1Group.add(ring1Mesh);

    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const bracketGeo = new THREE.BoxGeometry(0.11, 0.11, 0.13);
      const bracketMesh = new THREE.Mesh(bracketGeo, graphiteMaterial);
      bracketMesh.position.set(
        Math.cos(angle) * 1.42,
        Math.sin(angle) * 1.42 * Math.cos(Math.PI / 3),
        Math.sin(angle) * 1.42 * Math.sin(Math.PI / 3)
      );
      ring1Group.add(bracketMesh);
    }

    // Ring 2 (Middle Titanium Ring)
    const ring2Geo = new THREE.TorusGeometry(1.85, 0.06, 32, 96);
    const ring2Mesh = new THREE.Mesh(ring2Geo, aluminumMaterial);
    ring2Mesh.rotation.x = -Math.PI / 3.8;
    ring2Mesh.rotation.z = Math.PI / 5;
    ring2Mesh.castShadow = true;
    ring2Group.add(ring2Mesh);

    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const markerGeo = new THREE.CylinderGeometry(0.038, 0.038, 0.14, 16);
      const markerMesh = new THREE.Mesh(markerGeo, goldMaterial);
      markerMesh.position.set(
        Math.cos(angle) * 1.85,
        Math.sin(angle) * 1.85,
        0
      );
      markerMesh.rotation.z = angle;
      ring2Mesh.add(markerMesh);
    }

    // Outer Hex Frame
    const hexRadius = 2.38;
    const hexPoints: THREE.Vector3[] = [];
    for (let i = 0; i <= 6; i++) {
      const a = (i * Math.PI) / 3;
      hexPoints.push(new THREE.Vector3(Math.cos(a) * hexRadius, (i % 2 === 0 ? 0.32 : -0.32), Math.sin(a) * hexRadius));
    }

    for (let i = 0; i < 6; i++) {
      const p1 = hexPoints[i];
      const p2 = hexPoints[i + 1];
      const dist = p1.distanceTo(p2);

      const strutGeo = new THREE.BoxGeometry(0.075, 0.075, dist);
      const strutMesh = new THREE.Mesh(strutGeo, graphiteMaterial);
      strutMesh.position.lerpVectors(p1, p2, 0.5);
      strutMesh.lookAt(p2);
      strutMesh.castShadow = true;
      outerFrameGroup.add(strutMesh);

      const capGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.13, 16);
      const capMesh = new THREE.Mesh(capGeo, goldMaterial);
      capMesh.position.copy(p1);
      outerFrameGroup.add(capMesh);
    }

    for (let i = 0; i < 3; i++) {
      const p = hexPoints[i * 2];
      const rodGeo = new THREE.CylinderGeometry(0.028, 0.028, p.length() * 0.95, 16);
      const rodMesh = new THREE.Mesh(rodGeo, aluminumMaterial);
      rodMesh.position.lerpVectors(p, new THREE.Vector3(0, 0, 0), 0.5);
      rodMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p.clone().normalize());
      outerFrameGroup.add(rodMesh);
    }

    // Smoked Borosilicate Glass Blades
    const bladeGeo = new THREE.BoxGeometry(0.075, 2.9, 0.52);
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2 + Math.PI / 4;
      const bladeMesh = new THREE.Mesh(bladeGeo, smokedGlassMaterial);
      const dist = 1.3;
      bladeMesh.position.set(Math.cos(angle) * dist, 0, Math.sin(angle) * dist);
      bladeMesh.rotation.y = angle + 0.35;
      bladeMesh.castShadow = true;
      bladeMesh.receiveShadow = true;
      glassBladesGroup.add(bladeMesh);
    }

    // Ground Contact Shadow Plinth
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 512;
    shadowCanvas.height = 512;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const shadowGrad = sCtx.createRadialGradient(256, 256, 10, 256, 256, 240);
      shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
      shadowGrad.addColorStop(0.35, 'rgba(5, 8, 15, 0.55)');
      shadowGrad.addColorStop(0.7, 'rgba(10, 15, 25, 0.15)');
      shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      sCtx.fillStyle = shadowGrad;
      sCtx.fillRect(0, 0, 512, 512);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowPlaneGeo = new THREE.PlaneGeometry(6.0, 6.0);
    const shadowPlaneMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.75,
      depthWrite: false
    });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -2.45;
    scene.add(shadowPlane);

    // Floor plinth ring
    const floorRingGeo = new THREE.RingGeometry(2.5, 2.54, 72);
    const floorRingMat = new THREE.MeshBasicMaterial({
      color: 0x242d3d,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35
    });
    const floorRing = new THREE.Mesh(floorRingGeo, floorRingMat);
    floorRing.rotation.x = -Math.PI / 2;
    floorRing.position.y = -2.44;
    scene.add(floorRing);

    // Entrance setup
    camera.position.z = 8.8;
    masterSculptureGroup.scale.set(0.88, 0.88, 0.88);

    // Pointer Interaction Handlers
    const handlePointerDown = (e: PointerEvent) => {
      isPointerDownRef.current = true;
      setIsInteracting(true);
      pointerStartRef.current = { x: e.clientX, y: e.clientY };
      rotationStartRef.current = { ...targetRotationRef.current };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const xNorm = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const yNorm = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mousePosRef.current = { x: xNorm, y: yNorm };

      if (isPointerDownRef.current) {
        const deltaX = (e.clientX - pointerStartRef.current.x) * 0.007;
        const deltaY = (e.clientY - pointerStartRef.current.y) * 0.007;
        targetRotationRef.current.y = rotationStartRef.current.y + deltaX;
        targetRotationRef.current.x = Math.max(-0.55, Math.min(0.55, rotationStartRef.current.x + deltaY));
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      isPointerDownRef.current = false;
      setIsInteracting(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Safe ignore
      }
    };

    canvas.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // Intersection Observer for 0% off-screen GPU
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    // Render loop
    const startTime = performance.now();
    let framesCount = 0;
    let lastFpsUpdate = startTime;

    const animate = (currentTime: number) => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      if (!isVisibleRef.current) return;

      const elapsedTime = (currentTime - startTime) * 0.001;

      framesCount++;
      if (currentTime - lastFpsUpdate >= 1000) {
        setFps(Math.round((framesCount * 1000) / (currentTime - lastFpsUpdate)));
        framesCount = 0;
        lastFpsUpdate = currentTime;
      }

      if (elapsedTime < 2.0) {
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, 7.4, 0.04);
        const s = THREE.MathUtils.lerp(masterSculptureGroup.scale.x, 1.0, 0.04);
        masterSculptureGroup.scale.set(s, s, s);
      }

      const mouseParallaxX = mousePosRef.current.x * 0.14;
      const mouseParallaxY = mousePosRef.current.y * 0.10;

      currentRotationRef.current.x = THREE.MathUtils.lerp(
        currentRotationRef.current.x,
        targetRotationRef.current.x + mouseParallaxY,
        0.06
      );
      currentRotationRef.current.y = THREE.MathUtils.lerp(
        currentRotationRef.current.y,
        targetRotationRef.current.y + mouseParallaxX,
        0.06
      );

      masterSculptureGroup.rotation.x = currentRotationRef.current.x;
      masterSculptureGroup.rotation.y = currentRotationRef.current.y;

      if (keyLightRef.current) {
        keyLightRef.current.position.x = 5.5 + mousePosRef.current.x * 1.5;
        keyLightRef.current.position.y = 6.5 + mousePosRef.current.y * 1.0;
      }

      if (!isReducedMotion) {
        const floatY = Math.sin(elapsedTime * 0.9) * 0.05;
        masterSculptureGroup.position.y = floatY;

        coreGroup.rotation.y = elapsedTime * 0.14;
        coreGroup.rotation.x = Math.sin(elapsedTime * 0.2) * 0.08;

        ring1Group.rotation.z = -elapsedTime * 0.18;
        ring2Group.rotation.y = elapsedTime * 0.12;

        outerFrameGroup.rotation.y = -elapsedTime * 0.06;
        glassBladesGroup.rotation.y = elapsedTime * 0.08;

        if (corePointLight) {
          corePointLight.intensity = 2.4 + Math.sin(elapsedTime * 2.2) * 0.6;
        }
      }

      renderer.render(scene, camera);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight || 460;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      observer.disconnect();

      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }

      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry?.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((m) => m.dispose());
          } else if (object.material) {
            object.material.dispose();
          }
        }
      });

      shadowTexture.dispose();
      renderer.dispose();
    };
  }, [webglSupported, isReducedMotion]);

  if (!webglSupported) {
    return (
      <div className="relative w-full h-[480px] flex items-center justify-center bg-[#0a0f1b] rounded-3xl border border-white/10 p-8 text-center">
        <div className="max-w-md space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Shield className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">ForeFight Era 3D Sculpture</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Your browser does not have WebGL acceleration enabled. The platform remains fully functional.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col rounded-3xl border border-white/[0.12] bg-[#080d16] shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
      {/* 1. TOP STATUS BAR (Dedicated non-overlapping header) */}
      <div className="h-12 px-4 sm:px-5 border-b border-white/[0.08] bg-[#070b13]/90 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2.5">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-mono text-xs text-amber-300 font-semibold tracking-wide">
            ForeFight Nexus Monolith
          </span>
          <span className="text-gray-600 hidden sm:inline">•</span>
          <span className="text-[11px] font-mono text-gray-400 hidden sm:inline">PBR 3D Studio</span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/5 text-[11px] font-mono text-gray-300">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-emerald-400 font-semibold">{fps} FPS</span>
          </div>

          <button
            onClick={resetView}
            title="Reset Camera Vantage Point"
            className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.12] text-gray-300 hover:text-white border border-white/5 transition-all text-xs flex items-center space-x-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="text-[11px] hidden sm:inline font-mono">Reset</span>
          </button>
        </div>
      </div>

      {/* 2. DEDICATED 3D CANVAS VIEWPORT (Pure, unobstructed breathing room) */}
      <div
        ref={containerRef}
        className="relative w-full h-[380px] sm:h-[440px] lg:h-[480px] select-none touch-none bg-gradient-to-b from-[#080d16] via-[#0a0f1b] to-[#070b14]"
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-grab active:cursor-grabbing block"
        />

        {/* Subtle studio vignette */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_55%,rgba(6,9,16,0.65)_100%)]" />

        {/* Orbit indicator hint top right */}
        <div className="absolute top-3 right-3 pointer-events-none">
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-black/40 border border-white/5 text-[10px] font-mono text-gray-400">
            <Compass className="w-3 h-3 text-amber-400" />
            <span>{isInteracting ? 'Free Orbit Angle' : 'Interactive Viewport'}</span>
          </span>
        </div>
      </div>

      {/* 3. DEDICATED STUDIO CONTROL DOCK (Clean, separated controls below canvas) */}
      <div className="border-t border-white/[0.08] bg-[#070b13]/95 p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
        {/* Lighting preset selector */}
        <div className="flex items-center space-x-1 p-1 bg-[#090e18] rounded-xl border border-white/10 w-full sm:w-auto justify-center">
          <button
            onClick={() => setLightingPreset('studio')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeLighting === 'studio'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Sliders className="w-3 h-3 text-amber-400" />
            <span>Studio Softbox</span>
          </button>

          <button
            onClick={() => setLightingPreset('amber')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeLighting === 'amber'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Warm Key</span>
          </button>

          <button
            onClick={() => setLightingPreset('dramatic')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeLighting === 'dramatic'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Eye className="w-3 h-3 text-amber-400" />
            <span>Rim Focus</span>
          </button>
        </div>

        {/* Material Callouts & Interaction Hint */}
        <div className="flex items-center space-x-2 text-[10px] font-mono text-gray-400">
          <span className="hidden md:inline text-gray-500">Materials:</span>
          <span className="px-2 py-0.5 rounded bg-black/40 border border-white/5 text-gray-300">Graphite Ti</span>
          <span className="px-2 py-0.5 rounded bg-black/40 border border-white/5 text-gray-300">Smoked Glass</span>
          <span className="px-2 py-0.5 rounded bg-black/40 border border-white/5 text-amber-300">24K Gold</span>
        </div>
      </div>
    </div>
  );
}
