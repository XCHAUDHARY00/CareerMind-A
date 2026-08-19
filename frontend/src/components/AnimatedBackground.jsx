import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-50 bg-transparent">
      {/* Animated Moving Orbs Background */}
      <motion.div 
        animate={{ 
          x: ['-20%', '20%', '-20%'], 
          y: ['-20%', '20%', '-20%'],
          rotate: [0, 90, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute top-[10%] left-[20%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-fuchsia-600/20 rounded-full blur-[120px]" 
      />
      <motion.div 
        animate={{ 
          x: ['20%', '-20%', '20%'], 
          y: ['20%', '-20%', '20%'],
          rotate: [0, -90, 0]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="absolute top-[40%] right-[10%] w-[35vw] h-[35vw] max-w-[400px] max-h-[400px] bg-indigo-600/20 rounded-full blur-[120px]" 
      />
      <motion.div 
        animate={{ 
          x: ['0%', '30%', '0%'], 
          y: ['30%', '0%', '30%'],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-[-10%] left-[30%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] bg-emerald-500/10 rounded-full blur-[120px]" 
      />
      <motion.div 
        animate={{ 
          x: ['-10%', '10%', '-10%'], 
          y: ['10%', '-10%', '10%'],
          scale: [1, 1.5, 1]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        className="absolute top-[20%] right-[40%] w-[25vw] h-[25vw] max-w-[300px] max-h-[300px] bg-amber-500/10 rounded-full blur-[100px]" 
      />
      <motion.div 
        animate={{ 
          x: ['-30%', '0%', '-30%'], 
          y: ['0%', '-20%', '0%'],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-[20%] right-[20%] w-[30vw] h-[30vw] max-w-[350px] max-h-[350px] bg-rose-600/15 rounded-full blur-[100px]" 
      />
    </div>
  );
};

export default AnimatedBackground;
