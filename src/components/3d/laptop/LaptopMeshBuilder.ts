import * as THREE from 'three';

export interface LaptopMeshComponents {
  rootGroup: THREE.Group;
  baseGroup: THREE.Group;
  lidPivotGroup: THREE.Group;
  screenMesh: THREE.Mesh;
  screenMaterial: THREE.MeshPhysicalMaterial;
  glassMesh: THREE.Mesh;
  screenAnchor: THREE.Object3D;
  dispose: () => void;
}

/**
 * Creates a 2D rounded rectangle shape for CNC-milled corner fillets.
 */
function createRoundedRectShape(w: number, d: number, r: number): THREE.Shape {
  const shape = new THREE.Shape();
  const x = -w / 2;
  const y = -d / 2;

  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  shape.lineTo(x + w, y + d - r);
  shape.quadraticCurveTo(x + w, y + d, x + w - r, y + d);
  shape.lineTo(x + r, y + d);
  shape.quadraticCurveTo(x, y + d, x, y + d - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);

  return shape;
}

/**
 * Builds an ultra-thin, contemporary MacBook Pro-inspired laptop model:
 * - Slim 11mm-equivalent CNC aluminum unibody base
 * - Razor-thin 4.5mm display lid with expansive 16:10 screen
 * - Precision-spaced low-profile chiclet keyboard in an all-black anodized well
 * - Edge-to-edge Force Touch frosted glass trackpad
 * - Space Black / Dark Titanium PBR material definition
 */
export function buildLaptopMesh(): LaptopMeshComponents {
  const rootGroup = new THREE.Group();
  rootGroup.name = 'LaptopRoot';

  // ==========================================
  // CONTEMPORARY ULTRA-THIN PROPORTIONS (16" Pro Workstation)
  // ==========================================
  const W = 3.40;          // Width: ~340mm equivalent
  const D = 2.30;          // Depth: ~230mm equivalent
  const H_BASE = 0.032;    // Base thickness: ~11mm (ultra-slim unibody!)
  const H_LID = 0.013;     // Display thickness: ~4.5mm (razor-thin display lid!)
  const CORNER_R = 0.12;   // Refined 12mm corner radius
  const HINGE_Z = -D / 2;  // -1.15
  const HINGE_Y = H_BASE / 2; // 0.016

  // Tracking for leak-free disposal
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];

  const trackGeom = <T extends THREE.BufferGeometry>(g: T): T => {
    geometries.push(g);
    return g;
  };

  const trackMat = <T extends THREE.Material>(m: T): T => {
    materials.push(m);
    return m;
  };

  // ==========================================
  // 1. SPACE BLACK / GRAPHITE PBR MATERIALS
  // ==========================================

  // Space Black Anodized Aluminum (Unibody chassis & lid shell)
  const aluminumMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0x303746,
      metalness: 0.94,
      roughness: 0.28,
      clearcoat: 0.35,
      clearcoatRoughness: 0.25,
      reflectivity: 0.9,
    })
  );

  // Bottom Pan (Dark graphite with satin sheen)
  const bottomPanMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0x242a36,
      metalness: 0.92,
      roughness: 0.35,
      clearcoat: 0.2,
    })
  );

  // Anodized Black Keyboard Well (Recessed deck cavity)
  const keyboardWellMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x111520,
      metalness: 0.3,
      roughness: 0.7,
    })
  );

  // Keycap Material (Low-profile matte chiclet keys)
  const keycapMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x181c26,
      metalness: 0.2,
      roughness: 0.38,
    })
  );

  // Amber Keyboard Backlight Underglow (Warm subtle illumination)
  const underglowMat = trackMat(
    new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.16,
    })
  );

  // Large Force Touch Frosted Glass Trackpad
  const trackpadMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0x28303f,
      metalness: 0.4,
      roughness: 0.16,
      clearcoat: 0.5,
      clearcoatRoughness: 0.2,
    })
  );

  // Trackpad Fine Edge Seam
  const trackpadSeamMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x4f5a6e,
      metalness: 0.95,
      roughness: 0.15,
    })
  );

  // Discrete Black Hinge Mechanism
  const hingeMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x222733,
      metalness: 0.96,
      roughness: 0.2,
    })
  );

  // Display Micro-Bezel (Matte black border)
  const bezelMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x080b12,
      metalness: 0.1,
      roughness: 0.9,
    })
  );

  // Display Screen Surface Material
  const screenMaterial = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0x000000,
      emissive: 0x000000,
      emissiveIntensity: 0.0,
      roughness: 0.06,
      metalness: 0.04,
      clearcoat: 0.8,
      clearcoatRoughness: 0.12,
    })
  );

  // Anti-Reflective Display Glass Overlay
  const screenGlassMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0x080d18,
      transmission: 0.1,
      opacity: 0.2,
      transparent: true,
      roughness: 0.04,
      metalness: 0.1,
      clearcoat: 0.98,
      clearcoatRoughness: 0.06,
      reflectivity: 0.75,
    })
  );

  // Rubber Foot Material
  const rubberMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x05070a,
      roughness: 0.95,
    })
  );

  // ==========================================
  // 2. BASE CHASSIS (ULTRA-THIN UNIBODY)
  // ==========================================
  const baseGroup = new THREE.Group();
  baseGroup.name = 'BaseChassis';

  // A. Top Case (CNC Milled Aluminum Unibody with 12mm Corner Fillets)
  const topCaseShape = createRoundedRectShape(W, D, CORNER_R);
  const topCaseGeom = trackGeom(
    new THREE.ExtrudeGeometry(topCaseShape, {
      depth: H_BASE * 0.6,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.006,
      bevelThickness: 0.005,
      curveSegments: 16,
    })
  );
  const topCaseMesh = new THREE.Mesh(topCaseGeom, aluminumMat);
  topCaseMesh.rotation.x = Math.PI / 2;
  topCaseMesh.position.set(0, H_BASE, 0);
  topCaseMesh.castShadow = true;
  topCaseMesh.receiveShadow = true;
  baseGroup.add(topCaseMesh);

  // B. Tapered Bottom Pan (Separation Seam & Clean Side Profile)
  const bottomPanShape = createRoundedRectShape(W - 0.015, D - 0.015, CORNER_R - 0.01);
  const bottomPanGeom = trackGeom(
    new THREE.ExtrudeGeometry(bottomPanShape, {
      depth: H_BASE * 0.4,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.01,
      bevelThickness: 0.006,
      curveSegments: 16,
    })
  );
  const bottomPanMesh = new THREE.Mesh(bottomPanGeom, bottomPanMat);
  bottomPanMesh.rotation.x = Math.PI / 2;
  bottomPanMesh.position.set(0, H_BASE * 0.4, 0);
  bottomPanMesh.castShadow = true;
  bottomPanMesh.receiveShadow = true;
  baseGroup.add(bottomPanMesh);

  // C. Front Opening Notch (Centered Milled Thumb Groove)
  const notchGeom = trackGeom(new THREE.BoxGeometry(0.52, 0.006, 0.018));
  const notchMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x161a24, roughness: 0.7 }));
  const notchMesh = new THREE.Mesh(notchGeom, notchMat);
  notchMesh.position.set(0, H_BASE + 0.001, D / 2 - 0.004);
  baseGroup.add(notchMesh);

  // D. Anodized Black Keyboard Well (Recessed Deck Cavity)
  const kwW = 2.48;  // Proportional keyboard width (73% of chassis)
  const kwD = 1.04;  // Proportional keyboard depth
  const kwH = 0.006; // Shallow well depth
  const kwZ = -0.34; // Positioned towards hinge to leave ample palm rest

  const kwShape = createRoundedRectShape(kwW, kwD, 0.035);
  const kwGeom = trackGeom(
    new THREE.ExtrudeGeometry(kwShape, {
      depth: kwH,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.003,
      bevelThickness: 0.002,
      curveSegments: 8,
    })
  );
  const kwMesh = new THREE.Mesh(kwGeom, keyboardWellMat);
  kwMesh.rotation.x = Math.PI / 2;
  kwMesh.position.set(0, H_BASE + 0.001, kwZ);
  baseGroup.add(kwMesh);

  // Keyboard Backlit Underglow Diffuser
  const underglowGeom = trackGeom(new THREE.PlaneGeometry(kwW - 0.03, kwD - 0.03));
  const underglowMesh = new THREE.Mesh(underglowGeom, underglowMat);
  underglowMesh.rotation.x = -Math.PI / 2;
  underglowMesh.position.set(0, H_BASE + 0.0015, kwZ);
  baseGroup.add(underglowMesh);

  // E. Modern Low-Profile Chiclet Keycaps Layout
  const keyGroup = new THREE.Group();
  keyGroup.name = 'Keycaps';
  const keyH = 0.007; // Sleek low-profile chiclet height

  interface RowConfig {
    keyCount: number;
    depthScale: number;
    zOffsetRatio: number;
  }

  const rowConfigs: RowConfig[] = [
    { keyCount: 14, depthScale: 0.75, zOffsetRatio: -2.35 }, // Row 0: Full Function Keys + Touch ID
    { keyCount: 14, depthScale: 1.0, zOffsetRatio: -1.45 },  // Row 1: Numbers & Backspace
    { keyCount: 14, depthScale: 1.0, zOffsetRatio: -0.50 },  // Row 2: QWERTY
    { keyCount: 13, depthScale: 1.0, zOffsetRatio: 0.45 },   // Row 3: Home Row & Return
    { keyCount: 12, depthScale: 1.0, zOffsetRatio: 1.40 },   // Row 4: Shift Row
    { keyCount: 7, depthScale: 1.05, zOffsetRatio: 2.35 },   // Row 5: Spacebar & Modifiers
  ];

  const standardRowPitch = kwD / 5.8;

  rowConfigs.forEach((cfg, r) => {
    const rowZ = kwZ + cfg.zOffsetRatio * (standardRowPitch * 0.95);
    const keyDepth = standardRowPitch * cfg.depthScale - 0.014;
    const cols = cfg.keyCount;
    const baseKeyW = (kwW - 0.06) / cols;

    for (let c = 0; c < cols; c++) {
      let w = baseKeyW - 0.011;
      let x = -((cols - 1) * baseKeyW) / 2 + c * baseKeyW;

      // Spacebar sizing in Row 5
      if (r === 5) {
        if (c === 3) {
          w = baseKeyW * 3.4; // Wide centered spacebar
        } else if (c > 3) {
          x += baseKeyW * 1.2;
        } else {
          x -= baseKeyW * 1.2;
        }
      }

      const keyGeom = trackGeom(new THREE.BoxGeometry(w, keyH, keyDepth));
      const keyMesh = new THREE.Mesh(keyGeom, keycapMat);
      keyMesh.position.set(x, H_BASE + keyH / 2 + 0.0005, rowZ);
      keyGroup.add(keyMesh);
    }
  });
  baseGroup.add(keyGroup);

  // F. Dual Laser-Drilled Speaker Grilles Flanking the Keyboard
  const grilleMat = trackMat(new THREE.MeshBasicMaterial({ color: 0x141824 }));
  const grilleGeom = trackGeom(new THREE.PlaneGeometry(0.20, kwD - 0.12));
  const grilleL = new THREE.Mesh(grilleGeom, grilleMat);
  grilleL.rotation.x = -Math.PI / 2;
  grilleL.position.set(-kwW / 2 - 0.22, H_BASE + 0.0015, kwZ);
  baseGroup.add(grilleL);

  const grilleR = new THREE.Mesh(grilleGeom, grilleMat);
  grilleR.rotation.x = -Math.PI / 2;
  grilleR.position.set(kwW / 2 + 0.22, H_BASE + 0.0015, kwZ);
  baseGroup.add(grilleR);

  // G. Expansive Force Touch Frosted Glass Trackpad
  const tpW = 1.15; // Generous 130mm proportional width
  const tpD = 0.72; // 80mm proportional depth
  const tpH = 0.0025;
  const tpZ = 0.59; // Centered in palm rest

  // Micro-seam border
  const tpSeamShape = createRoundedRectShape(tpW + 0.008, tpD + 0.008, 0.02);
  const tpSeamGeom = trackGeom(new THREE.ExtrudeGeometry(tpSeamShape, { depth: tpH, bevelEnabled: false }));
  const tpSeamMesh = new THREE.Mesh(tpSeamGeom, trackpadSeamMat);
  tpSeamMesh.rotation.x = Math.PI / 2;
  tpSeamMesh.position.set(0, H_BASE + tpH, tpZ);
  baseGroup.add(tpSeamMesh);

  // Glass touch surface
  const tpSurfaceShape = createRoundedRectShape(tpW, tpD, 0.018);
  const tpSurfaceGeom = trackGeom(new THREE.ExtrudeGeometry(tpSurfaceShape, { depth: tpH + 0.0005, bevelEnabled: false }));
  const tpSurfaceMesh = new THREE.Mesh(tpSurfaceGeom, trackpadMat);
  tpSurfaceMesh.rotation.x = Math.PI / 2;
  tpSurfaceMesh.position.set(0, H_BASE + tpH + 0.0005, tpZ);
  baseGroup.add(tpSurfaceMesh);

  // H. Integrated Unibody Rear Hinge
  const hingeRadius = 0.013;
  const hingeLength = 2.55;
  const hingeGeom = trackGeom(new THREE.CylinderGeometry(hingeRadius, hingeRadius, hingeLength, 24));
  const hingeMesh = new THREE.Mesh(hingeGeom, hingeMat);
  hingeMesh.rotation.z = Math.PI / 2;
  hingeMesh.position.set(0, HINGE_Y, HINGE_Z);
  baseGroup.add(hingeMesh);

  // I. Flank Thunderbolt Ports
  const portMat = trackMat(new THREE.MeshBasicMaterial({ color: 0x07090f }));
  const portGeom = trackGeom(new THREE.BoxGeometry(0.008, 0.012, 0.04));

  const pL1 = new THREE.Mesh(portGeom, portMat);
  pL1.position.set(-W / 2 - 0.001, H_BASE * 0.5, -0.2);
  baseGroup.add(pL1);

  const pL2 = new THREE.Mesh(portGeom, portMat);
  pL2.position.set(-W / 2 - 0.001, H_BASE * 0.5, -0.32);
  baseGroup.add(pL2);

  const pR1 = new THREE.Mesh(portGeom, portMat);
  pR1.position.set(W / 2 + 0.001, H_BASE * 0.5, -0.2);
  baseGroup.add(pR1);

  // J. Four Low-Profile Rubber Feet
  const footGeom = trackGeom(new THREE.CylinderGeometry(0.032, 0.032, 0.006, 16));
  const footPositions = [
    [-W / 2 + 0.28, -D / 2 + 0.28],
    [W / 2 - 0.28, -D / 2 + 0.28],
    [-W / 2 + 0.28, D / 2 - 0.28],
    [W / 2 - 0.28, D / 2 - 0.28],
  ];
  footPositions.forEach(([fx, fz]) => {
    const foot = new THREE.Mesh(footGeom, rubberMat);
    foot.position.set(fx, -0.003, fz);
    baseGroup.add(foot);
  });

  rootGroup.add(baseGroup);

  // ==========================================
  // 3. SLIM 16:10 DISPLAY LID ASSEMBLY
  // ==========================================
  const lidPivotGroup = new THREE.Group();
  lidPivotGroup.name = 'LidPivotGroup';
  lidPivotGroup.position.set(0, HINGE_Y, HINGE_Z);

  const lidContentGroup = new THREE.Group();
  lidContentGroup.name = 'LidContentGroup';

  // A. Lid Outer Shell (Ultra-Thin 4.5mm CNC Aluminum)
  const lidShape = createRoundedRectShape(W, D, CORNER_R);
  const lidShellGeom = trackGeom(
    new THREE.ExtrudeGeometry(lidShape, {
      depth: H_LID,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.005,
      bevelThickness: 0.004,
      curveSegments: 16,
    })
  );
  const lidShellMesh = new THREE.Mesh(lidShellGeom, aluminumMat);
  lidShellMesh.rotation.x = Math.PI / 2;
  lidShellMesh.position.set(0, H_LID, D / 2);
  lidShellMesh.castShadow = true;
  lidContentGroup.add(lidShellMesh);

  // B. ForeFight Era Monogram Emblem (Back of Lid)
  const logoGeom = trackGeom(new THREE.PlaneGeometry(0.32, 0.32));
  const logoMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x55637a,
      metalness: 0.96,
      roughness: 0.12,
    })
  );
  const logoMesh = new THREE.Mesh(logoGeom, logoMat);
  logoMesh.rotation.x = -Math.PI / 2;
  logoMesh.position.set(0, H_LID + 0.001, D / 2);
  lidContentGroup.add(logoMesh);

  // C. Display Inner Micro-Bezel (Uniform thin black border)
  const bezelGeom = trackGeom(new THREE.BoxGeometry(W - 0.012, 0.0015, D - 0.012));
  const bezelMesh = new THREE.Mesh(bezelGeom, bezelMat);
  bezelMesh.position.set(0, -0.001, D / 2);
  lidContentGroup.add(bezelMesh);

  // Modern Camera Notch at Top Bezel
  const notchBarGeom = trackGeom(new THREE.BoxGeometry(0.24, 0.0018, 0.038));
  const notchBarMesh = new THREE.Mesh(notchBarGeom, bezelMat);
  notchBarMesh.position.set(0, -0.0015, D - 0.024);
  lidContentGroup.add(notchBarMesh);

  const camLensGeom = trackGeom(new THREE.CircleGeometry(0.008, 16));
  const camLensMat = trackMat(new THREE.MeshBasicMaterial({ color: 0x020306 }));
  const camLens = new THREE.Mesh(camLensGeom, camLensMat);
  camLens.rotation.x = Math.PI / 2;
  camLens.position.set(0, -0.002, D - 0.025);
  lidContentGroup.add(camLens);

  // D. Expansive 16:10 Display Screen Aperture
  // Width: 3.20, Height: 2.00 (3.20 / 2.00 = 1.60 = 16:10 exact!)
  const screenW = 3.20;
  const screenH = 2.00;
  const screenGeom = trackGeom(new THREE.PlaneGeometry(screenW, screenH));
  const screenMesh = new THREE.Mesh(screenGeom, screenMaterial);
  screenMesh.rotation.x = Math.PI / 2;
  screenMesh.position.set(0, -0.002, D / 2);
  lidContentGroup.add(screenMesh);

  // Anti-Reflective Display Glass Overlay
  const glassGeom = trackGeom(new THREE.PlaneGeometry(screenW, screenH));
  const glassMesh = new THREE.Mesh(glassGeom, screenGlassMat);
  glassMesh.rotation.x = Math.PI / 2;
  glassMesh.position.set(0, -0.0028, D / 2);
  lidContentGroup.add(glassMesh);

  // E. Screen Anchor for CSS3DObject (Exact 16:10 Match for 768x480 DOM)
  const screenAnchor = new THREE.Object3D();
  screenAnchor.name = 'ScreenAnchor';
  screenAnchor.rotation.x = Math.PI / 2;
  screenAnchor.position.set(0, -0.0032, D / 2);
  lidContentGroup.add(screenAnchor);

  lidPivotGroup.add(lidContentGroup);
  rootGroup.add(lidPivotGroup);

  // ==========================================
  // 4. SOFT STUDIO CONTACT SHADOW PLANE
  // ==========================================
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 512;
  shadowCanvas.height = 512;
  const ctx = shadowCanvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(256, 256, 50, 256, 256, 240);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.82)');
    gradient.addColorStop(0.4, 'rgba(0, 0, 0, 0.35)');
    gradient.addColorStop(0.85, 'rgba(0, 0, 0, 0.06)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);
  }

  const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
  shadowTexture.wrapS = THREE.ClampToEdgeWrapping;
  shadowTexture.wrapT = THREE.ClampToEdgeWrapping;

  const shadowGeom = trackGeom(new THREE.PlaneGeometry(W * 1.5, D * 1.5));
  const shadowMat = trackMat(
    new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
    })
  );
  const shadowMesh = new THREE.Mesh(shadowGeom, shadowMat);
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.set(0, -0.005, 0.05);
  rootGroup.add(shadowMesh);

  // ==========================================
  // 5. CLEAN DISPOSAL
  // ==========================================
  const dispose = () => {
    geometries.forEach((g) => g.dispose());
    materials.forEach((m) => m.dispose());
    shadowTexture.dispose();
  };

  return {
    rootGroup,
    baseGroup,
    lidPivotGroup,
    screenMesh,
    screenMaterial,
    glassMesh,
    screenAnchor,
    dispose,
  };
}
