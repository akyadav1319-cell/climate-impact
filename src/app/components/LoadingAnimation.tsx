import { motion } from 'motion/react';

export function LoadingAnimation() {
  return (
    <div className="flex items-center justify-center gap-2">
      <motion.div
        className="size-3 rounded-full bg-primary"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="size-3 rounded-full bg-primary"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.2,
        }}
      />
      <motion.div
        className="size-3 rounded-full bg-primary"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.4,
        }}
      />
    </div>
  );
}
