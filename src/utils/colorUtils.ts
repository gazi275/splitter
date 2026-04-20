import { BRIGHT_COLORS } from '../constants/colors';

/**
 * Get a random bright color from the palette
 */
export const getRandomColor = (): string => {
  return BRIGHT_COLORS[Math.floor(Math.random() * BRIGHT_COLORS.length)];
};

/**
 * Generate a unique node ID
 */
let nodeIdCounter = 0;

export const generateNodeId = (): number => {
  return nodeIdCounter++;
};

export const resetNodeIdCounter = (): void => {
  nodeIdCounter = 0;
};
