/**
 * Kids English Area Design System
 * Rainbow theme extensions and visual guidelines
 */

export const KIDS_COLORS = {
  level1: {
    primary: "#FFB4E5",    // Soft pink
    secondary: "#FFD4F0",
    accent: "#FF8FD8",
    background: "#FFF5FC",
    gradient: "from-pink-200 via-pink-100 to-pink-50"
  },
  level2: {
    primary: "#A8E6CF",    // Soft green
    secondary: "#C8F4DD",
    accent: "#7DDBB0",
    background: "#F5FFF9",
    gradient: "from-green-200 via-green-100 to-green-50"
  },
  level3: {
    primary: "#FFD89C",    // Soft orange
    secondary: "#FFEAC7",
    accent: "#FFC96F",
    background: "#FFFBF0",
    gradient: "from-orange-200 via-orange-100 to-orange-50"
  },
  rainbow: {
    red: "#FF6B9D",
    orange: "#FFB366",
    yellow: "#FFE66D",
    green: "#A8E6CF",
    blue: "#6EC1E4",
    purple: "#C49CDE"
  }
} as const;

export const KIDS_ANIMATIONS = {
  bounce: "animate-[bounce_1s_ease-in-out_infinite]",
  pulse: "animate-[pulse_2s_ease-in-out_infinite]",
  wiggle: "animate-[wiggle_1s_ease-in-out_infinite]",
  float: "animate-[float_3s_ease-in-out_infinite]",
  spin: "animate-[spin_3s_linear_infinite]",
  tada: "animate-[tada_1s_ease-in-out]"
} as const;

export const KIDS_TYPOGRAPHY = {
  playful: "font-['Comic_Neue',_'Nunito',_sans-serif]",
  friendly: "font-['Quicksand',_'Poppins',_sans-serif]",
  educational: "font-['Montserrat',_sans-serif]"
} as const;

export const KIDS_SPACING = {
  tight: "space-y-2",
  normal: "space-y-4",
  relaxed: "space-y-6",
  loose: "space-y-8"
} as const;

export const KIDS_SHADOWS = {
  soft: "shadow-sm shadow-pink-200/50",
  medium: "shadow-md shadow-pink-300/50",
  large: "shadow-lg shadow-pink-400/50",
  glow: "shadow-[0_0_20px_rgba(255,180,229,0.4)]"
} as const;

export const KIDS_BORDERS = {
  playful: "border-4 border-dashed",
  friendly: "border-2 border-solid rounded-2xl",
  fun: "border-3 border-dotted rounded-full"
} as const;

/**
 * Get level-specific theme
 */
export function getKidsLevelTheme(levelId: string) {
  const themes = {
    level1: KIDS_COLORS.level1,
    level2: KIDS_COLORS.level2,
    level3: KIDS_COLORS.level3
  };
  return themes[levelId as keyof typeof themes] || themes.level1;
}

/**
 * Get age-appropriate animation
 */
export function getKidsAnimation(age: number) {
  if (age <= 7) return KIDS_ANIMATIONS.bounce;
  if (age <= 10) return KIDS_ANIMATIONS.float;
  return KIDS_ANIMATIONS.pulse;
}

/**
 * Get mascot for age range
 */
export function getKidsMascot(ageRange: string) {
  const mascots = {
    "4-7": {
      name: "Sparkle the Explorer",
      emoji: "⭐",
      description: "Your friendly guide to colors, shapes, and fun!",
      image: "/images/kids/kids_mascot_explorer.png"
    },
    "7-10": {
      name: "Buddy the Adventurer",
      emoji: "🌈",
      description: "Let's explore stories and learn together!",
      image: "/images/kids/kids_mascot_adventurer.png"
    },
    "10-13": {
      name: "Sage the Thinker",
      emoji: "🦉",
      description: "Ready to dive deep into ideas and creativity?",
      image: "/images/kids/kids_mascot_thinker.png"
    }
  };
  return mascots[ageRange as keyof typeof mascots] || mascots["4-7"];
}

/**
 * Get progress badge for room completion
 */
export function getProgressBadge(entriesCompleted: number, totalEntries: number = 5) {
  const percentage = (entriesCompleted / totalEntries) * 100;
  
  if (percentage === 0) return { level: "starter", emoji: "🌱", color: "#E0E0E0" };
  if (percentage < 50) return { level: "learning", emoji: "🌟", color: "#FFE66D" };
  if (percentage < 100) return { level: "growing", emoji: "⭐", color: "#FFB366" };
  return { level: "mastered", emoji: "🏆", color: "#FFD700" };
}

/**
 * Confetti celebration for achievements
 */
export function triggerKidsConfetti() {
  // Simple confetti-like effect using emojis
  const confettiEmojis = ["🎉", "⭐", "🌟", "✨", "🎊", "🌈"];
  const colors = Object.values(KIDS_COLORS.rainbow);
  
  return {
    emojis: confettiEmojis,
    colors,
    duration: 3000,
    count: 50
  };
}