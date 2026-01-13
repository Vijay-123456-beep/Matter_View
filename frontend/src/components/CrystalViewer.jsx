import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line, Text } from '@react-three/drei';
import * as THREE from 'three';

function Atom({ position, color, radius, visible, element }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current && visible) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  if (!visible) return null;

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[radius, 32, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
    </mesh>
  );
}

function Bond({ start, end, visible }) {
  if (!visible) return null;

  const points = useMemo(() => [new THREE.Vector3(...start), new THREE.Vector3(...end)], [start, end]);

  return (
    <Line
      points={points}
      color="#666666"
      lineWidth={2}
      transparent
      opacity={0.8}
    />
  );
}

function UnitCell({ latticeParams, visible }) {
  if (!visible || !latticeParams) return null;

  const { a, b, c, alpha, beta, gamma } = latticeParams;
  
  // Convert angles to radians
  const alphaRad = (alpha * Math.PI) / 180;
  const betaRad = (beta * Math.PI) / 180;
  const gammaRad = (gamma * Math.PI) / 180;

  // Calculate unit cell vectors
  const ax = a;
  const ay = 0;
  const az = 0;

  const bx = b * Math.cos(gammaRad);
  const by = b * Math.sin(gammaRad);
  const bz = 0;

  const cx = c * Math.cos(betaRad);
  const cy = c * (Math.cos(alphaRad) - Math.cos(betaRad) * Math.cos(gammaRad)) / Math.sin(gammaRad);
  const cz = Math.sqrt(c * c - cx * cx - cy * cy);

  // Define unit cell vertices
  const vertices = [
    [0, 0, 0],
    [ax, ay, az],
    [bx, by, bz],
    [ax + bx, ay + by, az + bz],
    [cx, cy, cz],
    [ax + cx, ay + cy, az + cz],
    [bx + cx, by + cy, bz + cz],
    [ax + bx + cx, ay + by + cy, az + bz + cz]
  ];

  // Define edges connecting vertices
  const edges = [
    [0, 1], [1, 3], [3, 2], [2, 0], // Bottom face
    [4, 5], [5, 7], [7, 6], [6, 4], // Top face
    [0, 4], [1, 5], [2, 6], [3, 7]  // Vertical edges
  ];

  return (
    <group>
      {edges.map(([start, end], index) => {
        const startPoint = vertices[start];
        const endPoint = vertices[end];
        return (
          <Line
            key={index}
            points={[
              new THREE.Vector3(...startPoint),
              new THREE.Vector3(...endPoint)
            ]}
            color="#00ff00"
            lineWidth={1}
            transparent
            opacity={0.6}
          />
        );
      })}
    </group>
  );
}

function CrystalStructure({ structure, visibility, elementVisibility }) {
  const atoms = useMemo(() => {
    if (!structure?.atoms) return [];
    
    return structure.atoms.map(atom => ({
      ...atom,
      visible: visibility.atoms && elementVisibility[atom.element]
    }));
  }, [structure?.atoms, visibility.atoms, elementVisibility]);

  const bonds = useMemo(() => {
    if (!structure?.bonds) return [];
    
    return structure.bonds.map(bond => {
      const atom1 = structure.atoms[bond.atom1_index];
      const atom2 = structure.atoms[bond.atom2_index];
      
      return {
        ...bond,
        start: atom1.cartesian_coordinates,
        end: atom2.cartesian_coordinates,
        visible: visibility.bonds && 
                elementVisibility[atom1.element] && 
                elementVisibility[atom2.element]
      };
    });
  }, [structure?.bonds, structure?.atoms, visibility.bonds, elementVisibility]);

  // Get atom radius based on element (simplified)
  const getAtomRadius = (element) => {
    const radii = {
      'H': 0.31, 'He': 0.28, 'Li': 1.28, 'Be': 0.96, 'B': 0.85, 'C': 0.76,
      'N': 0.71, 'O': 0.66, 'F': 0.57, 'Ne': 0.58, 'Na': 1.66, 'Mg': 1.41,
      'Al': 1.21, 'Si': 1.11, 'P': 1.07, 'S': 1.05, 'Cl': 1.02, 'Ar': 1.06,
      'K': 2.03, 'Ca': 1.76, 'Sc': 1.70, 'Ti': 1.60, 'V': 1.53, 'Cr': 1.39,
      'Mn': 1.39, 'Fe': 1.32, 'Co': 1.26, 'Ni': 1.24, 'Cu': 1.28, 'Zn': 1.34,
      'Ga': 1.35, 'Ge': 1.22, 'As': 1.19, 'Se': 1.16, 'Br': 1.14, 'Kr': 1.17,
      'Rb': 2.20, 'Sr': 1.95, 'Y': 1.80, 'Zr': 1.59, 'Nb': 1.43, 'Mo': 1.36,
      'Tc': 1.36, 'Ru': 1.34, 'Rh': 1.34, 'Pd': 1.37, 'Ag': 1.44, 'Cd': 1.52,
      'In': 1.58, 'Sn': 1.45, 'Sb': 1.46, 'Te': 1.40, 'I': 1.38, 'Xe': 1.40,
    };
    return (radii[element] || 1.0) * 0.3; // Scale down for visualization
  };

  return (
    <group>
      {/* Render atoms */}
      {atoms.map((atom) => (
        <Atom
          key={atom.index}
          position={atom.cartesian_coordinates}
          color={atom.color}
          radius={getAtomRadius(atom.element)}
          visible={atom.visible}
          element={atom.element}
        />
      ))}
      
      {/* Render bonds */}
      {bonds.map((bond, index) => (
        <Bond
          key={index}
          start={bond.start}
          end={bond.end}
          visible={bond.visible}
        />
      ))}
      
      {/* Render unit cell */}
      <UnitCell 
        latticeParams={structure?.lattice_parameters}
        visible={visibility.unitCell}
      />
    </group>
  );
}

export default function CrystalViewer({ structure, visibility, elementVisibility }) {
  return (
    <div style={{ width: '100%', height: '600px', border: '1px solid #ccc' }}>
      <Canvas
        camera={{ position: [10, 10, 10], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <pointLight position={[-10, -10, -5]} intensity={0.4} />
        
        <CrystalStructure 
          structure={structure}
          visibility={visibility}
          elementVisibility={elementVisibility}
        />
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          zoomSpeed={1.2}
          panSpeed={0.8}
          rotateSpeed={0.5}
        />
        
        <gridHelper args={[20, 20]} position={[0, -5, 0]} />
      </Canvas>
    </div>
  );
}
