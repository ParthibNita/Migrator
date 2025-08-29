import React from 'react';
import { motion } from 'framer-motion';

const Background = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden bg-neutral-950">
      <motion.div
        className="absolute top-0 left-0 w-[150%] h-[150%] opacity-50"
        style={{
          background:
            'radial-gradient(circle, rgba(29, 185, 84, 0.6) 0%, transparent 69%)',
        }}
        animate={{
          x: ['-25%', '25%', '-25%'],
          y: ['-25%', '25%', '-25%'],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-[150%] h-[150%] opacity-30"
        style={{
          background:
            'radial-gradient(circle, rgba(255, 0, 0, 0.5) 0%, transparent 69%)',
        }}
        animate={{
          x: ['25%', '-25%', '25%'],
          y: ['25%', '-25%', '25%'],
          rotate: [0, -180, -360],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
      />
    </div>
  );
};

export default Background;
