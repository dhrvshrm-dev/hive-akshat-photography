// Shared motion tokens so every animated surface on the site feels like one system.

// The site's signature easing — a soft, cinematic decelerate.
export const ease = [0.22, 1, 0.36, 1];

// Snappy: sliding pills, nav underlines, anything that should feel immediate.
export const springSnappy = { type: "spring", stiffness: 400, damping: 35 };

// Soft: cursor ring, tilt, magnetic pull — trailing, weighted motion.
export const springSoft = { type: "spring", stiffness: 150, damping: 20 };

export const duration = {
  fast: 0.3,
  base: 0.7,
  slow: 1.2,
  cinematic: 1.6,
};

// Container/child pair for staggered list or grid entrances.
export const staggerContainer = (stagger = 0.06, delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren } },
});

export const fadeUpChild = (y = 20) => ({
  hidden: { opacity: 0, y },
  show: { opacity: 1, y: 0, transition: { duration: duration.base, ease } },
});
