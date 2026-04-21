import { PanelNode } from '../types/panel';

/**
 * Find a node by ID in the panel tree
 */
export const findNodeById = (node: PanelNode, id: number): PanelNode | null => {
  if (node.id === id) return node;
  if (node.type === 'split') {
    const found = findNodeById(node.children[0], id);
    if (found) return found;
    return findNodeById(node.children[1], id);
  }
  return null;
};

/**
 * Update a node by ID using a mapper function
 */
export const updateNodeById = (
  node: PanelNode,
  id: number,
  updater: (node: PanelNode) => PanelNode
): PanelNode => {
  if (node.id === id) return updater(node);
  if (node.type === 'split') {
    return {
      ...node,
      children: [
        updateNodeById(node.children[0], id, updater),
        updateNodeById(node.children[1], id, updater),
      ],
    };
  }
  return node;
};

/**
 * Returns the maximum node id from a panel tree.
 */
export const getMaxNodeId = (node: PanelNode): number => {
  if (node.type === 'leaf') {
    return node.id;
  }

  const leftMax = getMaxNodeId(node.children[0]);
  const rightMax = getMaxNodeId(node.children[1]);
  return Math.max(node.id, leftMax, rightMax);
};

/**
 * Normalizes a panel tree to keep split percentages in a safe, visible range.
 */
export const normalizePanelTree = (node: PanelNode, minSize = 20): PanelNode => {
  if (node.type === 'leaf') return node;

  const [rawLeft, rawRight] = node.sizes;
  const total = rawLeft + rawRight || 100;
  const leftPct = (rawLeft / total) * 100;
  const clampedLeft = Math.max(minSize, Math.min(100 - minSize, leftPct));
  const clampedRight = 100 - clampedLeft;

  return {
    ...node,
    sizes: [clampedLeft, clampedRight],
    children: [
      normalizePanelTree(node.children[0], minSize),
      normalizePanelTree(node.children[1], minSize),
    ],
  };
};
