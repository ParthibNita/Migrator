import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, ArrowRight, Music, Youtube, Sparkles } from 'lucide-react';
import { Typewriter } from './../components/TypewriterAnim.jsx';

const AnimatedSphere = () => {
  const meshRef = useRef();
  useFrame((state) => {
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[3, 64, 64]} />
      <meshStandardMaterial
        color="#1DB954"
        wireframe
        transparent
        opacity={0.4}
        emissive="#1DB954"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
};

const FloatingNote = ({ position, rotationSpeed }) => {
  const meshRef = useRef();
  useFrame((state) => {
    meshRef.current.rotation.y = state.clock.elapsedTime * rotationSpeed;
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.3;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position}>
        <cylinderGeometry args={[0.1, 0.1, 0.8, 8]} />
        <meshStandardMaterial
          color="#FF0000"
          emissive="#FF0000"
          emissiveIntensity={0.5}
        />
      </mesh>
    </Float>
  );
};

const Particles = ({ count = 100 }) => {
  const particlesRef = useRef();
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
  }

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#FFFFFF" transparent opacity={0.6} />
    </points>
  );
};

export const HomePage = () => {
  const { accessToken, login } = useAuthStore();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleStart = async () => {
    if (accessToken) {
      navigate('/dashboard');
    } else {
      login();
    }
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-neutral-900 via-black to-neutral-900 overflow-hidden">
      <Canvas camera={{ position: [0, 5, 5], fov: 69 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#1DB954" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#FF0000" />

        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={0.5}
        />
        <Particles count={800} />

        <AnimatedSphere />
        <FloatingNote position={[2, 1, 0]} rotationSpeed={0.8} />
        <FloatingNote position={[-2, -1, 2]} rotationSpeed={1.2} />
        <FloatingNote position={[1, -2, -1]} rotationSpeed={0.6} />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.8}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60" />

      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 30, scale: 3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-green-400 to-red-400 bg-clip-text text-transparent relative overflow-hidden"
        >
          MIGRATOR
          <motion.span
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent transform -skew-x-12"
            initial={{ x: '-150%', opacity: 0 }}
            animate={{ x: '150%', opacity: 1 }}
            transition={{
              duration: 2.5,
              delay: 0.8,
              ease: 'easeInOut',
            }}
          />
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-xl md:text-2xl text-neutral-300 mb-8 max-w-2xl text-center md:text-left"
        >
          <Typewriter text="Transfer your music between " delay={0.4} />
          <Typewriter
            text="Spotify"
            delay={1.2}
            className="text-green-400 font-semibold"
          />
          <Typewriter text=" and " delay={1.8} />
          <Typewriter
            text="YouTube Music"
            delay={2.0}
            className="text-red-400 font-semibold"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl"
        >
          {[
            {
              icon: Sparkles,
              text: 'One-Click Transfers',
              color: 'text-blue-400',
            },
            {
              icon: Music,
              text: 'Preserve Playlist Quality',
              color: 'text-green-400',
            },
            {
              icon: Youtube,
              text: 'Cross-Platform Sync',
              color: 'text-red-400',
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-xs rounded-xl p-6 border border-white/10"
            >
              <item.icon className={`w-8 h-8 mx-auto mb-3 ${item.color}`} />
              <p className="text-neutral-200 font-medium">{item.text}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          <Button
            onClick={handleStart}
            size="lg"
            className="relative overflow-hidden group px-8 py-6 text-lg font-semibold rounded-2xl bg-gradient-to-r from-green-600 to-red-600 hover:from-green-700 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-green-500/20"
          >
            <span className="relative z-10 flex items-center gap-3">
              {accessToken ? (
                <>
                  Continue to Dashboard
                  <ArrowRight
                    className={`w-5 h-5 transition-transform ${isHovered ? 'translate-x-1' : ''}`}
                  />
                </>
              ) : (
                <>
                  Start Transferring
                  <Play className="w-5 h-5" />
                </>
              )}
            </span>

            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-6 text-neutral-500 text-sm"
        >
          © 2025 Migrator • Made for music lovers 🎸
        </motion.div>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-green-500 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
