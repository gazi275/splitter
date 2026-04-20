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
