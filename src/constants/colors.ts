/**
 * Bright, vivid colors for panel randomization
 */
export const BRIGHT_COLORS = [
  '#FF1493', // Hot Pink
  '#00FF41', // Lime Green
  '#FF00FF', // Magenta
  '#00CED1', // Dark Turquoise
  '#0080FF', // Electric Blue
  '#FF6347', // Tomato / Coral
  '#00FFFF', // Cyan
  '#FFD700', // Gold
  '#FF4500', // Orange Red
  '#39FF14', // Neon Green
  '#FF10F0', // Deep Magenta
  '#00D9FF', // Sky Cyan
] as const;

/**
 * UI Constants
 */
export const UI_CONSTANTS = {
  BUTTON_SIZE: 40,
  BUTTON_GAP: 12,
  DIVIDER_WIDTH: 4,
  BUTTON_BORDER_RADIUS: 4,
  MIN_PANEL_SIZE: 10,
  MAX_PANEL_SIZE: 90,
  HOVER_OPACITY: {
    VISIBLE: 1,
    HIDDEN: 0.3,
  },
  TRANSITION_DURATION: '0.2s',
} as const;

/**
 * Z-Index levels
 */
export const Z_INDEX = {
  CONTROLS: 10,
  DIVIDER: 5,
} as const;

/**
 * Color themes for UI elements
 */
export const COLORS = {
  BUTTON_BG: 'rgba(100, 100, 100, 0.6)',
  BUTTON_BG_HOVER: 'rgba(80, 80, 80, 0.8)',
  BUTTON_TEXT: '#ffffff',
  DIVIDER: '#ffffff',
  DIVIDER_HOVER: '#f2f2f2',
} as const;
