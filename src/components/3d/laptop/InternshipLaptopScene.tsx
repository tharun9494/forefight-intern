import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { buildLaptopMesh, LaptopMeshComponents } from './LaptopMeshBuilder';
import LaptopClassroomScreen, { MonthKey } from './LaptopClassroomScreen';
import { createPortal } from 'react-dom';
import { RotateCcw, Sparkles, Monitor, Layers } from 'lucide-react';

export interface InternshipLaptopSceneProps {
  activeMonth: MonthKey;
  onSelectMonth: (month: MonthKey) => void;
  className?: string;
}

export default function InternshipLaptopScene({
  activeMonth,
  onSelectMonth,
  className = '',
}: InternshipLaptopSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cssContainerRef = useRef<HTMLDivElement>(null);

  // Animation & Timeline State
  const [screenPower, setScreenPower] = useState(0);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

  // References for Animation & Scene Lifecycle
  const animStartTimeRef = useRef<number | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const laptopComponentsRef = useRef<LaptopMeshComponents | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cssRendererRef = useRef<CSS3DRenderer | null>(null);
  const cssObjectRef = useRef<CSS3DObject | null>(null);

  // Responsive camera framing reference
  const containerDimensionsRef = useRef({ width: 640, height: 480, aspect: 1.33 });

  // Parallax Dampening
  const mousePosRef = useRef({ x: 0.5, y: 0.5 });
  const currentParallaxRef = useRef({ x: 0, y: 0 });
  const isHoveredRef = useRef(false);
  const isVisibleRef = useRef(true);

  // 1. Accessibility & WebGL Support Check
  useEffect(() => {
    try {
      const testCanvas = document.createElement('canvas');
      const gl = !!(
        window.WebGLRenderingContext &&
        (testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl'))
      );
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

  // 2. DOM Mount Target for CSS3D Screen Object
  const [screenPortalTarget, setScreenPortalTarget] = useState<HTMLDivElement | null>(null);

  // 3. Initialize Three.js WebGL & CSS3D Scenes
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current || !webglSupported) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    const width = container.clientWidth || 640;
    const height = container.clientHeight || 500;
    const aspect = width / height;
    containerDimensionsRef.current = { width, height, aspect };

    // --- WebGL Scene ---
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // --- Perspective Camera with Product-Photography FOV (30°) ---
    // Low-distortion 85mm-equivalent lens for authentic product rendering
    const camera = new THREE.PerspectiveCamera(30, aspect, 0.1, 100);
    cameraRef.current = camera;

    // --- WebGL Renderer ---
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    rendererRef.current = renderer;

    // --- CSS3D Renderer (Crisp React interactive DOM screen) ---
    const cssRenderer = new CSS3DRenderer();
    cssRenderer.setSize(width, height);
    cssRenderer.domElement.style.position = 'absolute';
    cssRenderer.domElement.style.top = '0';
    cssRenderer.domElement.style.left = '0';
    cssRenderer.domElement.style.width = '100%';
    cssRenderer.domElement.style.height = '100%';
    cssRenderer.domElement.style.pointerEvents = 'none'; // pass-through to canvas
    cssContainerRef.current?.appendChild(cssRenderer.domElement);
    cssRendererRef.current = cssRenderer;

    // --- Build Precision 3D Laptop Model ---
    const laptop = buildLaptopMesh();
    laptopComponentsRef.current = laptop;
    scene.add(laptop.rootGroup);

    // Initial closed state: lid rotation = 0 rad
    laptop.lidPivotGroup.rotation.x = 0;

    // --- Screen DOM Element & CSS3DObject (16:10 Aspect Ratio, High-Legibility 768x480 Resolution) ---
    const screenDiv = document.createElement('div');
    screenDiv.style.width = '768px';
    screenDiv.style.height = '480px';
    screenDiv.style.pointerEvents = 'auto'; // allow direct clicks on tabs & buttons
    setScreenPortalTarget(screenDiv);

    const cssObj = new CSS3DObject(screenDiv);
    cssObj.name = 'ClassroomScreenCSS3D';
    // Exact 16:10 aperture match: screen quad is 3.20 units wide for 768px DOM
    const scaleFactor = 3.20 / 768; // ~0.0041667
    cssObj.scale.set(scaleFactor, scaleFactor, scaleFactor);

    // Positioned coplanar with the inner screen frame
    cssObj.rotation.x = Math.PI / 2;
    cssObj.position.set(0, -0.0025, 2.30 / 2);

    // Attach CSS3DObject to the lid child group so it rotates with the hinge
    laptop.lidPivotGroup.children[0].add(cssObj);
    cssObjectRef.current = cssObj;

    // --- Blender-Grade Studio Lighting Setup ---

    // 1. Key Light: Large softbox from front-top-left
    const keyLight = new THREE.DirectionalLight(0xfff8ee, 3.4);
    keyLight.position.set(-3.2, 5.0, 4.2);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 14;
    keyLight.shadow.camera.left = -2.8;
    keyLight.shadow.camera.right = 2.8;
    keyLight.shadow.camera.top = 2.8;
    keyLight.shadow.camera.bottom = -2.8;
    keyLight.shadow.bias = -0.0003;
    scene.add(keyLight);

    // 2. ForeFight Amber Rim Light: Grazing edge light from rear-right
    const amberRimLight = new THREE.DirectionalLight(0xf59e0b, 5.2);
    amberRimLight.position.set(3.8, 3.8, -3.0);
    scene.add(amberRimLight);

    // 3. Cool Slate Fill Light: Soft neutral illumination from bottom-left
    const coolFillLight = new THREE.DirectionalLight(0x28354c, 2.0);
    coolFillLight.position.set(-3.0, 0.6, 3.0);
    scene.add(coolFillLight);

    // 4. Chassis Reflection Light: Gentle front-right highlight
    const chassisReflectLight = new THREE.DirectionalLight(0x354054, 1.5);
    chassisReflectLight.position.set(3.2, 1.2, 2.8);
    scene.add(chassisReflectLight);

    // 5. Overhead Softbox: Top studio light
    const overheadLight = new THREE.PointLight(0xffffff, 1.2, 10);
    overheadLight.position.set(0, 4.5, 0);
    scene.add(overheadLight);

    // 6. Ambient Base Fill: Deep studio fill
    const ambientLight = new THREE.AmbientLight(0x141a26, 0.95);
    scene.add(ambientLight);

    // --- Dynamic Camera Framing Function ---
    // Targets 92-96% visual width fill of the available right hero column,
    // ensuring the laptop is dominant and large while keeping the entire object visible.
    const computeFramingDistance = (asp: number): number => {
      const vFovRad = (30 * Math.PI) / 180;
      const hFovRad = 2 * Math.atan(Math.tan(vFovRad / 2) * asp);
      // Calibrated bounding radius for the 3.40x2.30 ultra-thin unibody laptop
      const boundingRadius = 2.05;
      const targetFill = 0.94; // 94% visual fill of container width
      const distV = boundingRadius / targetFill / Math.tan(vFovRad / 2);
      const distH = boundingRadius / targetFill / Math.tan(hFovRad / 2);
      return Math.max(distV, distH);
    };

    // --- Resize Observer ---
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0) {
          const newAspect = w / h;
          containerDimensionsRef.current = { width: w, height: h, aspect: newAspect };
          camera.aspect = newAspect;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
          cssRenderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    // --- Visibility Observer (Pause when offscreen) ---
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    visibilityObserver.observe(container);

    // --- Animation Timeline Constants (5.5 Seconds Sequence) ---
    // 0.0s - 1.5s: Closed laptop, clearly recognizable
    // 1.5s - 3.5s: Lid rotates smoothly around real hinge axis
    // 3.5s - 4.5s: Display illuminates gradually
    // 4.5s - 5.5s: Classroom interface becomes crisp & interactive
    const TOTAL_ANIM_DURATION = 5500;
    const OPEN_ANGLE = -108 * (Math.PI / 180); // ~ -1.885 rad

    const animate = (time: number) => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      if (!isVisibleRef.current) return;

      if (animStartTimeRef.current === null) {
        animStartTimeRef.current = time;
      }

      const elapsed = time - animStartTimeRef.current;
      const rawProgress = isReducedMotion ? 1.0 : Math.min(elapsed / TOTAL_ANIM_DURATION, 1.0);

      if (rawProgress >= 1.0 && !isAnimationComplete) {
        setIsAnimationComplete(true);
      }

      // --- DYNAMIC CAMERA POSE CALCULATION ---
      const curAspect = containerDimensionsRef.current.aspect;
      const targetDistance = computeFramingDistance(curAspect);

      // Look-at centers
      const closedCenter = new THREE.Vector3(0, 0.02, 0);
      const openCenter = new THREE.Vector3(0, 0.65, -0.15);

      // Camera direction unit vectors (elevated 3/4 perspective)
      // Closed view: 22° elevation, 16° azimuth
      const closedDir = new THREE.Vector3(
        Math.sin((16 * Math.PI) / 180) * Math.cos((22 * Math.PI) / 180),
        Math.sin((22 * Math.PI) / 180),
        Math.cos((16 * Math.PI) / 180) * Math.cos((22 * Math.PI) / 180)
      ).normalize();

      // Open view: 15° elevation, 9° azimuth (ergonomic reading angle, expansive display)
      const openDir = new THREE.Vector3(
        Math.sin((9 * Math.PI) / 180) * Math.cos((15 * Math.PI) / 180),
        Math.sin((15 * Math.PI) / 180),
        Math.cos((9 * Math.PI) / 180) * Math.cos((15 * Math.PI) / 180)
      ).normalize();

      const camClosedPos = closedCenter.clone().add(closedDir.multiplyScalar(targetDistance * 0.95));
      const camOpenPos = openCenter.clone().add(openDir.multiplyScalar(targetDistance));

      const currentCamPos = new THREE.Vector3();
      const currentLookAt = new THREE.Vector3();

      let currentLidAngle = 0;
      let power = 0;

      if (isReducedMotion) {
        // Reduced Motion: immediately open and illuminated
        currentLidAngle = OPEN_ANGLE;
        power = 1.0;
        currentCamPos.copy(camOpenPos);
        currentLookAt.copy(openCenter);
      } else {
        // --- TIMELINE EXECUTION ---

        // 1. Camera interpolation (1.5s to 3.5s)
        let camProgress = 0;
        if (elapsed > 1500) {
          const rawCamT = Math.min((elapsed - 1500) / 2000, 1.0);
          // Smooth cubic ease-in-out
          camProgress =
            rawCamT < 0.5 ? 4 * rawCamT * rawCamT * rawCamT : 1 - Math.pow(-2 * rawCamT + 2, 3) / 2;
        }
        currentCamPos.lerpVectors(camClosedPos, camOpenPos, camProgress);
        currentLookAt.lerpVectors(closedCenter, openCenter, camProgress);

        // 2. Lid Opening Rotation (1.5s to 3.5s)
        if (elapsed < 1500) {
          currentLidAngle = 0;
        } else if (elapsed >= 1500 && elapsed <= 3500) {
          const lidT = (elapsed - 1500) / 2000;
          // Quartic ease-out for fluid-damped hinge movement
          const ease = 1 - Math.pow(1 - lidT, 4);
          currentLidAngle = OPEN_ANGLE * ease;
        } else {
          currentLidAngle = OPEN_ANGLE;
        }

        // 3. Screen Illumination (3.5s to 4.5s) & Fade In (4.5s to 5.5s)
        if (elapsed < 3500) {
          power = 0;
        } else if (elapsed >= 3500 && elapsed <= 4500) {
          const illumT = (elapsed - 3500) / 1000;
          power = Math.pow(illumT, 1.6) * 0.75;
        } else if (elapsed > 4500 && elapsed <= 5500) {
          const fadeT = (elapsed - 4500) / 1000;
          power = 0.75 + fadeT * 0.25;
        } else {
          power = 1.0;
        }
      }

      setScreenPower(power);

      // Apply lid rotation to the hinge pivot
      laptop.lidPivotGroup.rotation.x = currentLidAngle;

      // Apply screen emissive backlight
      laptop.screenMaterial.emissive.setHex(0x0e172a);
      laptop.screenMaterial.emissiveIntensity = power * 0.45;

      // Specular glint across display glass during illumination
      if (elapsed > 3500 && elapsed < 4800) {
        const glintT = (elapsed - 3500) / 1300;
        laptop.glassMesh.material = new THREE.MeshPhysicalMaterial({
          color: 0x090e1a,
          emissive: new THREE.Color(0xf59e0b),
          emissiveIntensity: Math.sin(glintT * Math.PI) * 0.35,
          transmission: 0.12,
          opacity: 0.22,
          transparent: true,
          roughness: 0.05,
          metalness: 0.12,
          clearcoat: 0.95,
        });
      }

      // --- MOUSE PARALLAX DAMPENING (Max ±3° tilt) ---
      const targetParallaxX = isHoveredRef.current ? (mousePosRef.current.x - 0.5) * 0.35 : 0;
      const targetParallaxY = isHoveredRef.current ? -(mousePosRef.current.y - 0.5) * 0.22 : 0;

      currentParallaxRef.current.x += (targetParallaxX - currentParallaxRef.current.x) * 0.05;
      currentParallaxRef.current.y += (targetParallaxY - currentParallaxRef.current.y) * 0.05;

      camera.position.set(
        currentCamPos.x + currentParallaxRef.current.x,
        currentCamPos.y + currentParallaxRef.current.y,
        currentCamPos.z
      );
      camera.lookAt(currentLookAt);

      // --- RENDER BOTH PASSES ---
      renderer.render(scene, camera);
      cssRenderer.render(scene, camera);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    // --- Cleanup on unmount ---
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      laptop.dispose();
      renderer.dispose();
      if (cssRenderer.domElement.parentNode) {
        cssRenderer.domElement.parentNode.removeChild(cssRenderer.domElement);
      }
    };
  }, [webglSupported, isReducedMotion]);

  // Handle Mouse Move for Parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mousePosRef.current = { x, y };
  };

  // Replay Animation Sequence
  const replayAnimation = useCallback(() => {
    animStartTimeRef.current = performance.now();
    setIsAnimationComplete(false);
  }, []);

  if (!webglSupported) {
    return (
      <div className="w-full aspect-[16/10] bg-[#0c121e] rounded-3xl border border-white/10 p-6 flex flex-col justify-center items-center text-center">
        <Monitor className="w-12 h-12 text-amber-400 mb-3" />
        <h4 className="text-lg font-bold text-white">Interactive Classroom</h4>
        <div className="w-full max-w-lg mt-4 h-80 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          <LaptopClassroomScreen
            activeMonth={activeMonth}
            onSelectMonth={onSelectMonth}
            screenPower={1}
            isInteractive={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full flex flex-col items-center ${className}`}>
      {/* 3D Scene Viewport Container (Enlarged to 85-92% width with proportional height) */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => {
          isHoveredRef.current = true;
        }}
        onMouseLeave={() => {
          isHoveredRef.current = false;
        }}
        className="relative w-full h-[540px] sm:h-[600px] md:h-[660px] lg:h-[700px] xl:h-[750px] overflow-hidden rounded-3xl select-none"
      >
        {/* WebGL Canvas (Chassis, Keys, Trackpad, Hinge, Shadows, Studio Lighting) */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

        {/* CSS3D Container (Holds the React Classroom Screen in 3D Space) */}
        <div ref={cssContainerRef} className="absolute inset-0 w-full h-full pointer-events-none" />

        {/* Mount the Real Interactive Classroom into the CSS3DObject */}
        {screenPortalTarget &&
          createPortal(
            <LaptopClassroomScreen
              activeMonth={activeMonth}
              onSelectMonth={onSelectMonth}
              screenPower={screenPower}
              isInteractive={isAnimationComplete || screenPower > 0.8}
            />,
            screenPortalTarget
          )}

        {/* Cinematic Status Pill (Top Right) */}
        <div className="absolute top-4 right-4 z-20 flex items-center space-x-2">
          <div className="px-3 py-1.5 rounded-xl bg-[#080d18]/85 backdrop-blur-md border border-white/10 flex items-center space-x-2 text-[11px] font-mono text-gray-300 shadow-xl">
            <span
              className={`w-2 h-2 rounded-full ${
                screenPower >= 0.9 ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span className="font-semibold text-white">
              {screenPower >= 0.9 ? 'Interactive 3D Classroom' : 'Cinematic Sequence'}
            </span>
          </div>

          <button
            type="button"
            onClick={replayAnimation}
            title="Replay Opening Sequence"
            className="p-2 rounded-xl bg-[#080d18]/85 hover:bg-[#11192e] backdrop-blur-md border border-white/10 text-gray-300 hover:text-amber-400 transition-all shadow-xl active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Ambient Floor Glow Gradient */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#070a11] via-transparent to-transparent opacity-40" />
      </div>

      {/* Synchronized Curriculum Navigation Ribbon */}
      <div className="w-full max-w-xl mt-3 px-4 py-2.5 rounded-2xl bg-[#0b101c]/90 backdrop-blur-md border border-white/[0.08] flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono uppercase text-gray-400 tracking-wider font-semibold">
            Explore Journey:
          </span>
          <div className="flex items-center space-x-1.5">
            {(['month1', 'month2', 'month3'] as MonthKey[]).map((key, i) => (
              <button
                key={key}
                type="button"
                onClick={() => onSelectMonth(key)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  activeMonth === key
                    ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300'
                }`}
              >
                Month 0{i + 1}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={replayAnimation}
          className="inline-flex items-center space-x-1.5 text-[11px] font-mono text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Replay Sequence</span>
        </button>
      </div>
    </div>
  );
}
