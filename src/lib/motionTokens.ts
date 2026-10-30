// Token Gerak Revio (Bagian 4 Master Prompt)

export const MOTION_TOKENS = {
  duration: {
    fast: 0.15,      // 150ms
    standard: 0.25,  // 250ms
    slow: 0.40,      // 400ms
    expressive: 0.70 // 700ms
  },
  easing: {
    enter: [0.22, 1, 0.36, 1] as const,
    exit: [0.4, 0, 1, 1] as const,
    spring: {
      stiffness: 260,
      damping: 24,
    }
  },
  stagger: 0.06 // 60ms
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: MOTION_TOKENS.stagger,
      delayChildren: 0.1,
    },
  },
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_TOKENS.duration.standard,
      ease: MOTION_TOKENS.easing.enter,
    },
  },
};

export const scaleSpring = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: MOTION_TOKENS.easing.spring.stiffness,
      damping: MOTION_TOKENS.easing.spring.damping,
    },
  },
};
