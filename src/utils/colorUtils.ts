import { BRIGHT_COLORS } from '../constants/colors';

/**
 * Get a random bright color from the palette
 */
export const getRandomColor = (): string => {
  return BRIGHT_COLORS[Math.floor(Math.random() * BRIGHT_COLORS.length)];
};

/**
 * Get a random bright color that is not in the excluded set when possible
 */
export const getRandomDistinctColor = (excludedColors: string[] = []): string => {
  const availableColors = BRIGHT_COLORS.filter((color) => !excludedColors.includes(color));

  if (availableColors.length > 0) {
    return availableColors[Math.floor(Math.random() * availableColors.length)];
  }

  return getRandomColor();
};

/**
 * Get a pair of distinct random colors for split children
 */
export const getDistinctColorPair = (): [string, string] => {
  const firstColor = getRandomColor();
  const secondColor = getRandomDistinctColor([firstColor]);

  return [firstColor, secondColor];
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
