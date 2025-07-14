import React, { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { useLocation, useNavigate } from "react-router-dom";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const BoxDisplay = () => {
  const mountRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { boxSize } = location.state || {};

  const [currentStep, setCurrentStep] = useState(3); // Start with full box (step 3)
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);

  // Step definitions with updated names (memoized as it's static)
  const steps = useMemo(
    () => [
      {
        name: "Empty Box",
        description: "Starting with an empty container",
        count: 0,
        volumeFactor: 0, // No items, so no volume
        co2Saved: 0,
        plasticSaved: 0,
      },
      {
        name: "Bags",
        description: "Adding 9 bags to the bottom layer",
        count: 9,
        volumeFactor: 0.25, // Placeholder volume for 9 bags
        co2Saved: 0.5, // Placeholder CO2 saved per bag
        plasticSaved: 0.1, // Placeholder plastic saved per bag
      },
      {
        name: "Kits",
        description: "Placing 3 kits in the middle layer",
        count: 3,
        volumeFactor: 0.4, // Placeholder volume for 3 kits
        co2Saved: 1.2, // Placeholder CO2 saved per kit
        plasticSaved: 0.3, // Placeholder plastic saved per kit
      },
      {
        name: "Volleyballs",
        description: "Completing with 2 volleyballs on top",
        count: 2,
        volumeFactor: 0.3, // Placeholder volume for 2 volleyballs
        co2Saved: 0.8, // Placeholder CO2 saved per volleyball
        plasticSaved: 0.2, // Placeholder plastic saved per volleyball
      },
    ],
    []
  );

  const sceneRef = useRef(null);
  const meshesRef = useRef([]); // Stores { mesh, edges, type, step }
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const animationFrameIdRef = useRef(null); // To manage animation frames

  useEffect(() => {
    if (!boxSize || !mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f9ff);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      50,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(boxSize * 2, boxSize * 1.8, boxSize * 2);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = boxSize;
    controls.maxDistance = boxSize * 4;
    controls.autoRotate = false;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.autoRotateSpeed = 0.2;
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(15, 20, 10);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    scene.add(mainLight);

    const rimLight = new THREE.DirectionalLight(0x4f46e5, 0.8);
    rimLight.position.set(-10, 5, -10);
    scene.add(rimLight);

    // Container
    const containerGeometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
    const containerMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.1,
      transmission: 0.9,
      transparent: true,
      opacity: 0.15,
      thickness: 0.5,
      ior: 1.5,
    });

    const container = new THREE.Mesh(containerGeometry, containerMaterial);
    scene.add(container);

    const wireframe = new THREE.EdgesGeometry(containerGeometry);
    const wireframeMaterial = new THREE.LineBasicMaterial({
      color: 0x1e293b,
      opacity: 0.3,
      transparent: true,
    });
    const containerWireframe = new THREE.LineSegments(
      wireframe,
      wireframeMaterial
    );
    scene.add(containerWireframe);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(boxSize * 3, boxSize * 3);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      metalness: 0.1,
      roughness: 0.8,
      transparent: true,
      opacity: 0.8,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -boxSize / 2 - 0.1;
    ground.receiveShadow = true;
    scene.add(ground);

    // Create all meshes once
    createAllMeshes(boxSize, scene, meshesRef);

    // Initially add all meshes to scene if starting at full box
    if (currentStep === steps.length - 1) {
      addAllMeshesToScene(scene, meshesRef.current);
    } else {
      // If not starting at full box, display only up to currentStep
      meshesRef.current.forEach(({ mesh, edges, step }) => {
        if (step <= currentStep) {
          scene.add(mesh);
          if (edges) scene.add(edges);
        }
      });
    }

    // Animation loop
    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      animationFrameIdRef.current = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect =
        mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight
      );
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      if (controls) controls.dispose();
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      // Clean up Three.js objects to prevent memory leaks
      scene.children.forEach((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      scene.clear();
    };
  }, [boxSize, currentStep, steps]); // Include currentStep in dependency array for initial setup

  const colorPalettes = useMemo(
    () => ({
      cylinder: { color: "#ef4444", metalness: 0.3, roughness: 0.2 },
      cuboid: { color: "#8b5cf6", metalness: 0.4, roughness: 0.1 },
      sphere: { color: "#f59e0b", metalness: 0.2, roughness: 0.3 },
    }),
    []
  );

  // Memoize materials to avoid re-creation
  const materials = useMemo(() => {
    return {
      cylinder: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(colorPalettes.cylinder.color),
        metalness: colorPalettes.cylinder.metalness,
        roughness: colorPalettes.cylinder.roughness,
        clearcoat: 0.3,
        clearcoatRoughness: 0.1,
      }),
      cuboid: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(colorPalettes.cuboid.color),
        metalness: colorPalettes.cuboid.metalness,
        roughness: colorPalettes.cuboid.roughness,
        clearcoat: 0.3,
        clearcoatRoughness: 0.1,
      }),
      sphere: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(colorPalettes.sphere.color),
        metalness: colorPalettes.sphere.metalness,
        roughness: colorPalettes.sphere.roughness,
        clearcoat: 0.5,
        clearcoatRoughness: 0.05,
      }),
      cuboidEdge: new THREE.LineBasicMaterial({
        color: 0x1f2937,
        opacity: 0.8,
        transparent: true,
      }),
    };
  }, [colorPalettes]);

  const createAllMeshes = (boxSize, scene, meshesRef) => {
    const meshes = [];
    const gap = 0.01 * boxSize;
    const unit = boxSize / 3;

    // BAGS (Cylinders - 9 total)
    const cylinderGeometry = new THREE.CylinderGeometry(
      unit * 0.48,
      unit * 0.48,
      unit * 0.9,
      16
    );
    for (let x = 0; x < 3; x++) {
      for (let z = 0; z < 3; z++) {
        const cylinder = new THREE.Mesh(
          cylinderGeometry,
          materials.cylinder
        );
        cylinder.castShadow = true;
        cylinder.receiveShadow = true;

        const finalPos = {
          x: -boxSize / 2 + gap + unit / 2 + x * unit,
          y: -boxSize / 2 + gap + (unit * 0.9) / 2,
          z: -boxSize / 2 + gap + unit / 2 + z * unit,
        };

        cylinder.position.set(finalPos.x, finalPos.y, finalPos.z);
        cylinder.userData = {
          targetPos: finalPos,
          targetRotation: { x: 0, y: 0, z: 0 },
          type: "cylinder",
          step: 1,
          index: x * 3 + z,
        };
        meshes.push({ mesh: cylinder, type: "cylinder", step: 1 });
      }
    }

    // KITS (Cuboids - 3 total)
    const cuboidPositions = [{ x: 0, z: 0 }, { x: 1, z: 0 }, { x: 2, z: 0 }];
    const cuboidGeometry = new THREE.BoxGeometry(
      unit * 0.8,
      unit * 0.8,
      unit * 2.8
    );
    cuboidPositions.forEach(({ x, z }, index) => {
      const cuboid = new THREE.Mesh(cuboidGeometry, materials.cuboid);
      cuboid.castShadow = true;
      cuboid.receiveShadow = true;

      const finalPos = {
        x: -boxSize / 2 + gap + unit / 2 + x * unit,
        y: -boxSize / 2 + gap + unit * 0.9 + (unit * 0.8) / 2,
        z: 0,
      };

      cuboid.position.set(finalPos.x, finalPos.y, finalPos.z);
      cuboid.userData = {
        targetPos: finalPos,
        targetRotation: { x: 0, y: 0, z: 0 },
        type: "cuboid",
        step: 2,
        index: index,
      };

      const edgeGeometry = new THREE.EdgesGeometry(cuboidGeometry);
      const edges = new THREE.LineSegments(edgeGeometry, materials.cuboidEdge);
      edges.position.copy(cuboid.position);

      meshes.push({ mesh: cuboid, edges, type: "cuboid", step: 2 });
    });

    // VOLLEYBALLS (Spheres - 2 total)
    const spherePositions = [{ x: 0.5, z: 0.5 }, { x: 1.5, z: 1.5 }];
    const sphereGeometry = new THREE.SphereGeometry(unit * 0.6, 16, 12);
    spherePositions.forEach(({ x, z }, index) => {
      const sphere = new THREE.Mesh(sphereGeometry, materials.sphere);
      sphere.castShadow = true;
      sphere.receiveShadow = true;

      const finalPos = {
        x: -boxSize / 2 + gap + unit / 2 + x * unit,
        y: -boxSize / 2 + gap + unit * 0.9 + unit * 0.8 + unit * 0.6,
        z: -boxSize / 2 + gap + unit / 2 + z * unit,
      };

      sphere.position.set(finalPos.x, finalPos.y, finalPos.z);
      sphere.userData = {
        targetPos: finalPos,
        type: "sphere",
        step: 3,
        index: index,
      };

      meshes.push({ mesh: sphere, type: "sphere", step: 3 });
    });

    meshesRef.current = meshes;
  };

  const addAllMeshesToScene = (scene, meshes) => {
    meshes.forEach(({ mesh, edges }) => {
      if (!scene.children.includes(mesh)) {
        scene.add(mesh);
      }
      if (edges && !scene.children.includes(edges)) {
        scene.add(edges);
      }
    });
  };

  const animateStep = (stepNumber) => {
    if (isAnimating || stepNumber === currentStep) return;

    setIsAnimating(true);
    setAnimationProgress(0);

    const scene = sceneRef.current;
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }

    if (stepNumber > currentStep) {
      // Adding objects: show meshes relevant to the current step
      const meshesToAnimate = meshesRef.current.filter(
        (meshData) => meshData.step === stepNumber
      );

      meshesToAnimate.forEach(({ mesh, edges }, index) => {
        // Set initial position above the box, slightly randomized
        mesh.position.set(
          mesh.userData.targetPos.x + (Math.random() - 0.5) * 0.5,
          boxSize / 2 + 2 + Math.random() * 1.5,
          mesh.userData.targetPos.z + (Math.random() - 0.5) * 0.5
        );

        if (mesh.userData.targetRotation) {
          mesh.rotation.set(
            Math.random() * Math.PI * 0.1,
            Math.random() * Math.PI * 0.1,
            Math.random() * Math.PI * 0.1
          );
        }

        // Add to scene if not already present
        if (!scene.children.includes(mesh)) {
          scene.add(mesh);
        }
        if (edges && !scene.children.includes(edges)) {
          edges.position.copy(mesh.position);
          edges.rotation.copy(mesh.rotation);
          scene.add(edges);
        }

        // Initialize animation properties
        mesh.userData.velocity = new THREE.Vector3(0, 0, 0);
        mesh.userData.rotationVelocity = new THREE.Vector3(0, 0, 0);
        mesh.userData.hasLanded = false;
        mesh.userData.delay = index * 0.08; // Small delay for staggered drop
      });

      let time = 0;
      const animateObjectsLoop = () => {
        time += 0.016; // Simulate a fixed time step (approx. 60fps)
        let landedCount = 0;

        meshesToAnimate.forEach(({ mesh, edges }) => {
          const userData = mesh.userData;

          if (time < userData.delay) return;

          if (!userData.hasLanded) {
            const gravity = 0.008; // Increased gravity for faster fall
            const damping = 0.96; // Less damping for bouncier feel
            const attraction = 0.05; // Increased attraction to target

            const targetPosVec = new THREE.Vector3(
              userData.targetPos.x,
              userData.targetPos.y,
              userData.targetPos.z
            );

            // Apply attraction force
            mesh.userData.velocity.add(
              targetPosVec.clone().sub(mesh.position).multiplyScalar(attraction)
            );
            // Apply gravity
            mesh.userData.velocity.y -= gravity;

            // Apply damping
            mesh.userData.velocity.multiplyScalar(damping);
            mesh.position.add(mesh.userData.velocity);

            // Apply rotational forces (for non-spheres)
            if (userData.type !== "sphere") {
              const targetRotationEuler = new THREE.Euler(
                userData.targetRotation.x,
                userData.targetRotation.y,
                userData.targetRotation.z
              );
              mesh.userData.rotationVelocity.x +=
                (targetRotationEuler.x - mesh.rotation.x) * 0.05;
              mesh.userData.rotationVelocity.y +=
                (targetRotationEuler.y - mesh.rotation.y) * 0.05;
              mesh.userData.rotationVelocity.z +=
                (targetRotationEuler.z - mesh.rotation.z) * 0.05;

              mesh.userData.rotationVelocity.multiplyScalar(0.95); // Damping for rotation
              mesh.rotation.x += mesh.userData.rotationVelocity.x;
              mesh.rotation.y += mesh.userData.rotationVelocity.y;
              mesh.rotation.z += mesh.userData.rotationVelocity.z;
            }

            // Check if landed (close enough to target position and low vertical velocity)
            const distance = mesh.position.distanceTo(targetPosVec);
            if (distance < 0.05 && Math.abs(userData.velocity.y) < 0.01) {
              mesh.position.copy(targetPosVec);
              if (userData.targetRotation) {
                mesh.rotation.set(
                  userData.targetRotation.x,
                  userData.targetRotation.y,
                  userData.targetRotation.z
                );
              }
              userData.hasLanded = true;

              // Small landing scale effect
              mesh.scale.setScalar(1.05);
              setTimeout(() => {
                mesh.scale.setScalar(1);
              }, 100);
            }

            if (edges) {
              edges.position.copy(mesh.position);
              edges.rotation.copy(mesh.rotation);
            }
          } else {
            landedCount++;
          }
        });

        const progress = Math.min(landedCount / meshesToAnimate.length, 1);
        setAnimationProgress(progress);

        if (progress < 1) {
          animationFrameIdRef.current = requestAnimationFrame(animateObjectsLoop);
        } else {
          setIsAnimating(false);
          setCurrentStep(stepNumber);
          cancelAnimationFrame(animationFrameIdRef.current);
        }
      };
      animationFrameIdRef.current = requestAnimationFrame(animateObjectsLoop);
    } else {
      // Removing objects (going backwards)
      const meshesToHide = meshesRef.current.filter(
        (meshData) => meshData.step > stepNumber
      );

      meshesToHide.forEach(({ mesh, edges }) => {
        scene.remove(mesh);
        if (edges) scene.remove(edges);
      });

      setCurrentStep(stepNumber);
      setIsAnimating(false);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      animateStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      animateStep(currentStep - 1);
    }
  };

  const handleClose = () => navigate(-1);

  // Function to calculate packing percentage, empty percentage, CO2 saved, and plastic saved
  const calculateMetrics = useMemo(() => {
    // Sum of volume factors for all items
    const maxTheoreticalVolumeFactor = steps.slice(1).reduce((sum, step) => sum + step.volumeFactor, 0);

    // The desired packing percentage when all items are added (Step 3)
    const actualMaxPackingPercentage = 86; // As specified: by default it is 86% packed

    let currentVolumeFactor = 0;
    let currentCO2Saved = 0;
    let currentPlasticSaved = 0;

    for (let i = 0; i <= currentStep; i++) {
      currentVolumeFactor += steps[i].volumeFactor;
      currentCO2Saved += steps[i].co2Saved * steps[i].count;
      currentPlasticSaved += steps[i].plasticSaved * steps[i].count;
    }

    // Scale the packing percentage based on the actualMaxPackingPercentage
    const packingPercentage = maxTheoreticalVolumeFactor > 0
      ? (currentVolumeFactor / maxTheoreticalVolumeFactor) * actualMaxPackingPercentage
      : 0;
    const emptyPercentage = 100 - packingPercentage;

    const totalMaxCO2Saved = steps.slice(1).reduce((sum, step) => sum + (step.co2Saved * step.count), 0);
    const totalMaxPlasticSaved = steps.slice(1).reduce((sum, step) => sum + (step.plasticSaved * step.count), 0);

    const co2Progress = totalMaxCO2Saved > 0 ? (currentCO2Saved / totalMaxCO2Saved) : 0;
    const plasticProgress = totalMaxPlasticSaved > 0 ? (currentPlasticSaved / totalMaxPlasticSaved) : 0;


    return {
      packingPercentage: packingPercentage.toFixed(1),
      emptyPercentage: emptyPercentage.toFixed(1),
      co2Saved: currentCO2Saved.toFixed(2),
      plasticSaved: currentPlasticSaved.toFixed(2),
      co2Progress,
      plasticProgress,
    };
  }, [currentStep, steps]); // Recalculate when currentStep or steps change

  if (!boxSize) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-slate-300 text-xl font-light">
            No box data found
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Helper component for the meter arc
  const MeterArc = ({ percentage, color, label }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            className="text-gray-300"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50%"
            cy="50%"
          />
          <circle
            className={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50%"
            cy="50%"
          />
        </svg>
        <div className="absolute text-center">
          <span className="text-sm font-bold text-slate-800">{label}</span>
          <span className="text-xs text-slate-600">%</span>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 z-50 overflow-hidden">
      {/* Loading overlay during animation */}
      {isAnimating && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-10 flex items-center justify-center pointer-events-none">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-2xl">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin border-t-blue-500 mx-auto mb-3"></div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                {currentStep < 3 ? steps[currentStep + 1]?.name : "Updating..."}
              </h3>
              <p className="text-slate-600 text-sm mb-3">
                {currentStep < 3
                  ? steps[currentStep + 1]?.description
                  : "Adjusting layout..."}
              </p>
              <div className="w-32 h-1.5 bg-blue-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-200 ease-out"
                  style={{ width: `${animationProgress * 100}%` }}
                ></div>
              </div>
              <p className="text-blue-600 text-xs mt-2">
                {Math.round(animationProgress * 100)}% Complete
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="relative w-full h-full">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 z-20 group bg-white/20 backdrop-blur-md border border-white/20 hover:bg-white/30 transition-all duration-300 rounded-2xl w-14 h-14 text-2xl text-slate-700 font-light flex items-center justify-center shadow-2xl hover:shadow-blue-500/25 hover:scale-110"
        >
          <span className="group-hover:rotate-90 transition-transform duration-300">
            ×
          </span>
        </button>

        {/* Title */}
        <div className="absolute top-6 left-6 z-20">
          <h1 className="text-2xl font-bold text-slate-800 mb-1">
            3D Step-by-Step Assembly
          </h1>
          <p className="text-slate-600 text-sm">
            Interactive Geometric Placement
          </p>
        </div>

        {/* 3D Canvas */}
        <div ref={mountRef} className="w-full h-full" />

        {/* Left Side Panels */}
        <div className="absolute top-1/2 left-6 transform -translate-y-1/2 z-20 flex flex-col gap-4">
          {/* Box Utilization Panel */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl w-80">
            <h3 className="text-lg font-bold text-slate-800 mb-4 text-center">
              Box Utilization
            </h3>
            <div className="flex justify-around items-center">
              <div className="text-center">
                <p className="text-slate-600 text-xs uppercase tracking-wide mb-1">
                  Packed
                </p>
                <p className="text-slate-800 font-bold text-2xl">
                  {calculateMetrics.packingPercentage}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-slate-600 text-xs uppercase tracking-wide mb-1">
                  Empty
                </p>
                <p className="text-slate-800 font-bold text-2xl">
                  {calculateMetrics.emptyPercentage}%
                </p>
              </div>
            </div>
          </div>

          {/* Environmental Impact Panel */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl w-80">
            <h3 className="text-lg font-bold text-slate-800 mb-4 text-center">
              Environmental Impact
            </h3>
            <div className="flex justify-around items-center">
              <div className="flex flex-col items-center">
                <MeterArc
                  percentage={calculateMetrics.co2Progress * 100}
                  color="text-green-500"
                  label="CO2"
                />
                <p className="text-slate-800 font-bold mt-2">
                  {calculateMetrics.co2Saved} kg
                </p>
                <p className="text-slate-600 text-xs">CO2 Saved</p>
              </div>
              <div className="flex flex-col items-center">
                <MeterArc
                  percentage={calculateMetrics.plasticProgress * 100}
                  color="text-blue-500"
                  label="Plastic"
                />
                <p className="text-slate-800 font-bold mt-2">
                  {calculateMetrics.plasticSaved} kg
                </p>
                <p className="text-slate-600 text-xs">Plastic Saved</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Navigation Panel */}
        <div className="absolute top-1/2 right-6 transform -translate-y-1/2 z-20 flex flex-col gap-4">
          {/* Step Info */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl w-80">
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              <span className="text-slate-700 font-semibold">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-800 mb-2">
              {steps[currentStep].name}
            </h3>
            <p className="text-slate-600 text-sm mb-4">
              {steps[currentStep].description}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white/20 rounded-xl p-3">
                <p className="text-slate-600 text-xs uppercase tracking-wide mb-1">
                  Container Size
                </p>
                <p className="text-slate-800 font-bold text-lg">
                  15.96 inch<sup>3</sup>
                </p>
              </div>
              <div className="bg-white/20 rounded-xl p-3">
                <p className="text-slate-600 text-xs uppercase tracking-wide mb-1">
                  Objects Added
                </p>
                <p className="text-slate-800 font-bold text-lg">
                  {steps
                    .slice(0, currentStep + 1)
                    .reduce((sum, step) => sum + step.count, 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl w-80">
            <div className="flex flex-col gap-3">
              <div className="text-center mb-2">
                <p className="text-slate-700 font-semibold text-sm">
                  Navigation
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0 || isAnimating}
                  className="flex-1 bg-slate-600 hover:bg-slate-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white px-4 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none"
                >
                  ← Previous
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentStep === steps.length - 1 || isAnimating}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white px-4 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none"
                >
                  Next →
                </button>
              </div>

              {/* Step Progress */}
              <div className="flex justify-center gap-2 mt-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index <= currentStep ? "bg-blue-500" : "bg-slate-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoxDisplay;