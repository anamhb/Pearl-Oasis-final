import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import logoGlbDataUrl from '../assets/images/opt/PO-logo.glb?inline';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// Module-level synchronous cache so Loader, Navbar, and Footer decode PO-logo.glb once with zero network delay
let cachedLogoMeshData = null;

function decodeBase64ToBytes(dataUrl) {
  const commaIdx = dataUrl.indexOf(',');
  const base64 = commaIdx >= 0 ? dataUrl.slice(commaIdx + 1) : dataUrl;
  if (typeof Uint8Array.fromBase64 === 'function') {
    return Uint8Array.fromBase64(base64);
  }
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function getParsedLogoData() {
  if (cachedLogoMeshData) return cachedLogoMeshData;

  const bytes = decodeBase64ToBytes(logoGlbDataUrl);
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

  // Verify GLB magic ("glTF" = 0x46546C67)
  if (dv.getUint32(0, true) !== 0x46546c67) {
    throw new Error('Invalid GLB header for PO-logo.glb');
  }

  const jsonLen = dv.getUint32(12, true);
  const jsonText = new TextDecoder().decode(bytes.subarray(20, 20 + jsonLen));
  const gltf = JSON.parse(jsonText);

  const binChunkOffset = 20 + jsonLen + 8;
  const prim = gltf.meshes[0].primitives[0];
  const idxAcc = gltf.accessors[prim.indices];
  const posAcc = gltf.accessors[prim.attributes.POSITION];
  const idxView = gltf.bufferViews[idxAcc.bufferView];
  const posView = gltf.bufferViews[posAcc.bufferView];

  const idxByteOffset =
    bytes.byteOffset + binChunkOffset + (idxView.byteOffset || 0) + (idxAcc.byteOffset || 0);
  const posByteOffset =
    bytes.byteOffset + binChunkOffset + (posView.byteOffset || 0) + (posAcc.byteOffset || 0);

  const idxBytesPerElem = idxAcc.componentType === 5125 ? 4 : 2;
  const rawIdxBuffer = bytes.buffer.slice(idxByteOffset, idxByteOffset + idxAcc.count * idxBytesPerElem);
  const indices =
    idxAcc.componentType === 5125
      ? new Uint32Array(rawIdxBuffer)
      : new Uint16Array(rawIdxBuffer);

  const rawPosBuffer = bytes.buffer.slice(posByteOffset, posByteOffset + posAcc.count * 12);
  const positions = new Float32Array(rawPosBuffer);

  // Compute bounding box & center vertices around origin once
  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const y = positions[i + 1];
    const z = positions[i + 2];
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (z < minZ) minZ = z;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
    if (z > maxZ) maxZ = z;
  }

  const cx = (minX + maxX) * 0.5;
  const cy = (minY + maxY) * 0.5;
  const cz = (minZ + maxZ) * 0.5;

  for (let i = 0; i < positions.length; i += 3) {
    positions[i] -= cx;
    positions[i + 1] -= cy;
    positions[i + 2] -= cz;
  }

  cachedLogoMeshData = {
    positions,
    indices,
    size: {
      x: maxX - minX,
      y: maxY - minY,
      z: maxZ - minZ,
    },
  };

  return cachedLogoMeshData;
}

export default function Logo3D({
  className = "w-11 h-11",
  rotationSpeed = 0.95,
  surface = "dark",
  showLoadingSpinner = true,
  interactive = true,
  onLoaded,
  onFullRotation,
  onError,
}) {
  const containerRef = useRef(null);
  const modelRef = useRef(null);
  const rotationSpeedRef = useRef(rotationSpeed);
  const onLoadedRef = useRef(onLoaded);
  const onFullRotationRef = useRef(onFullRotation);
  const onErrorRef = useRef(onError);
  const [loadError, setLoadError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  rotationSpeedRef.current = rotationSpeed;
  onLoadedRef.current = onLoaded;
  onFullRotationRef.current = onFullRotation;
  onErrorRef.current = onError;

  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isLightSurface = surface === 'light';
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Detect WebGL capability & software renderer safely
    let isWebGLAvailable = false;
    let isSoftwareGl = false;
    try {
      const testCanvas = document.createElement('canvas');
      const gl =
        window.WebGLRenderingContext &&
        (testCanvas.getContext('webgl2') ||
          testCanvas.getContext('webgl') ||
          testCanvas.getContext('experimental-webgl'));
      if (gl) {
        isWebGLAvailable = true;
        const dbg = gl.getExtension('WEBGL_debug_renderer_info');
        const rendererStr = dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : '';
        isSoftwareGl = /swiftshader|llvmpipe|softpipe|mesa/i.test(String(rendererStr));
      }
    } catch {
      isWebGLAvailable = false;
    }

    if (!isWebGLAvailable) {
      setLoadError(true);
      onErrorRef.current?.();
      return;
    }

    let meshData;
    try {
      meshData = getParsedLogoData();
    } catch (e) {
      console.warn("Could not decode PO-logo.glb:", e);
      setLoadError(true);
      onErrorRef.current?.();
      return;
    }

    const width = container.clientWidth || 64;
    const height = container.clientHeight || 64;

    const scene = new THREE.Scene();
    const cameraFov = isLightSurface ? 38 : 40;
    const camera = new THREE.PerspectiveCamera(cameraFov, width / height, 0.1, 100);
    camera.position.set(0, 0, isLightSurface ? 3.52 : 3.2);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: isSoftwareGl ? 'low-power' : 'default',
      });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      if (isLightSurface) {
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.04;
      }
      renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height);
      renderer.domElement.style.display = 'block';
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn("Failed to initialize WebGLRenderer for 3D logo:", e);
      setLoadError(true);
      onErrorRef.current?.();
      return;
    }

    if (isLightSurface) {
      // Zero-stall instant-compile studio lighting calibrated for metallic gold on pure white
      const hemiLight = new THREE.HemisphereLight(0xfff5d6, 0x8a5e14, 1.85);
      scene.add(hemiLight);

      const keyLight = new THREE.DirectionalLight(0xfff8e0, 3.6);
      keyLight.position.set(2.5, 3.5, 4.5);
      scene.add(keyLight);

      const fillLight = new THREE.DirectionalLight(0xf2c962, 2.2);
      fillLight.position.set(-3.2, 1.0, 3.2);
      scene.add(fillLight);

      const backRim1 = new THREE.DirectionalLight(0xffd25a, 3.4);
      backRim1.position.set(-2.5, 2.0, -4.0);
      scene.add(backRim1);

      const backRim2 = new THREE.DirectionalLight(0xffe799, 2.0);
      backRim2.position.set(3.0, -1.5, -3.0);
      scene.add(backRim2);

      const catchLight = new THREE.PointLight(0xfff3be, 2.4, 12);
      catchLight.position.set(0, 1.4, 3.0);
      scene.add(catchLight);
    } else {
      // Studio Lighting for Bright Vibrant Gold Finish (Dark Navbar/Footer)
      const ambientLight = new THREE.AmbientLight(0xfff8e7, 3.2);
      scene.add(ambientLight);

      const dirLight1 = new THREE.DirectionalLight(0xfff0b3, 4.2);
      dirLight1.position.set(2, 3, 4);
      scene.add(dirLight1);

      const dirLight2 = new THREE.DirectionalLight(0xffd700, 3.0);
      dirLight2.position.set(-3, -1, -2);
      scene.add(dirLight2);

      const pointLight = new THREE.PointLight(0xfff2a3, 3.5, 12);
      pointLight.position.set(0, 1.5, 2.5);
      scene.add(pointLight);
    }

    // Build geometry synchronously from cached centered TypedArrays
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(meshData.positions, 3));
    geometry.setIndex(new THREE.BufferAttribute(meshData.indices, 1));

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(isLightSurface ? 0xd9a528 : 0xffd700),
      roughness: isLightSurface ? 0.26 : 0.22,
      metalness: isLightSurface ? 0.68 : 0.85,
      emissive: new THREE.Color(isLightSurface ? 0x593900 : 0x664400),
      emissiveIntensity: isLightSurface ? 0.24 : 0.35,
      flatShading: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    const { size } = meshData;
    if (isLightSurface) {
      // Exact 360-degree Y-rotation extent framing so corners never clip during spin
      const halfY = size.y / 2;
      const xzRadius = Math.hypot(size.x / 2, size.z / 2);
      const maxExtent = Math.max(halfY, xzRadius);
      if (maxExtent > 0) {
        mesh.scale.setScalar(1 / maxExtent);
      }
    } else {
      const maxDim = Math.max(size.x, size.y, size.z);
      if (maxDim > 0) {
        mesh.scale.setScalar(2.45 / maxDim);
      }
    }

    const pivotGroup = new THREE.Group();
    pivotGroup.add(mesh);
    scene.add(pivotGroup);
    modelRef.current = pivotGroup;

    // Paint Frame 1 synchronously before the browser draws the loader
    renderer.render(scene, camera);
    setLoaded(true);
    onLoadedRef.current?.();

    let isMounted = true;
    let isVisible = true;
    let animId = 0;
    let softTimerId = 0;
    let totalRotation = 0;
    let fullRotationNotified = false;
    const clock = new THREE.Clock();

    const scheduleNextFrame = () => {
      if (!isMounted || !isVisible || document.hidden || prefersReducedMotion) {
        animId = 0;
        return;
      }
      if (isSoftwareGl) {
        softTimerId = window.setTimeout(() => {
          softTimerId = 0;
          if (isMounted && isVisible && !document.hidden) {
            animId = requestAnimationFrame(tick);
          }
        }, 32);
      } else {
        animId = requestAnimationFrame(tick);
      }
    };

    const tick = () => {
      animId = 0;
      if (!isMounted || !isVisible || document.hidden || prefersReducedMotion) {
        return;
      }
      const delta = Math.min(clock.getDelta(), 0.1);
      if (modelRef.current) {
        const step = delta * rotationSpeedRef.current;
        modelRef.current.rotation.y += step;
        totalRotation += Math.abs(step);
        if (!fullRotationNotified && totalRotation >= Math.PI * 2) {
          fullRotationNotified = true;
          onFullRotationRef.current?.();
        }
      }
      renderer.render(scene, camera);
      scheduleNextFrame();
    };

    const startLoop = () => {
      if (!isMounted || !modelRef.current || animId || softTimerId || document.hidden || !isVisible) return;
      if (prefersReducedMotion) {
        renderer.render(scene, camera);
        return;
      }
      clock.getDelta();
      animId = requestAnimationFrame(tick);
    };

    const stopLoop = () => {
      if (animId) {
        cancelAnimationFrame(animId);
        animId = 0;
      }
      if (softTimerId) {
        window.clearTimeout(softTimerId);
        softTimerId = 0;
      }
    };

    startLoop();

    let observer = null;
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          isVisible = entries.some((entry) => entry.isIntersecting);
          if (isVisible) {
            startLoop();
          } else {
            stopLoop();
          }
        },
        { rootMargin: '120px 0px' }
      );
      observer.observe(container);
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopLoop();
      } else {
        startLoop();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth || 64;
      const h = container.clientHeight || 64;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (modelRef.current) {
        renderer.render(scene, camera);
      }
    };

    let resizeObserver = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(container);
    }
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      isMounted = false;
      stopLoop();
      if (observer) observer.disconnect();
      if (resizeObserver) resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', handleResize);

      geometry.dispose();
      material.dispose();

      if (renderer) {
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        renderer.dispose();
      }
    };
  }, [surface]);

  if (loadError) {
    if (!showLoadingSpinner) return null;
    return (
      <div className={`${className} rounded-full border border-[#C9A45C] bg-[#18080B]/90 flex items-center justify-center p-1 shadow-md`}>
        <div className="w-4 h-4 rounded-full border-2 border-[#F5C369] border-t-transparent" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`${className} relative flex items-center justify-center ${interactive ? 'cursor-pointer' : 'pointer-events-none'} overflow-visible`}
      title={interactive ? "Pearl Oasis 3D Logo" : undefined}
    >
      {showLoadingSpinner && !loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full border border-[#C9A45C] border-t-transparent animate-spin" />
        </div>
      )}
    </div>
  );
}
