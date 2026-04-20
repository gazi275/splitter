import { useState, useCallback } from 'react';
import { PanelNode, SplitDirection } from '../types/panel';
import { generateNodeId, getRandomColor } from '../utils/colorUtils';
import { updateNodeById } from '../utils/treeUtils';

/**
 * Custom hook for managing panel tree operations
 */
export const usePanelTree = (initialRoot: PanelNode) => {
  const [root, setRoot] = useState<PanelNode>(initialRoot);

  const handleSplit = useCallback(
    (nodeId: number, direction: SplitDirection | 'resize', newSizes?: [number, number]) => {
      setRoot((prevRoot) => {
        return updateNodeById(prevRoot, nodeId, (node) => {
          if (direction === 'resize' && newSizes) {
            if (node.type === 'split') {
              return {
                ...node,
                sizes: newSizes,
              };
            }
          }

          if (node.type === 'leaf' && direction !== 'resize') {
            return {
              id: node.id,
              type: 'split',
              direction,
              sizes: [50, 50],
              children: [
                {
                  id: generateNodeId(),
                  type: 'leaf',
                  color: getRandomColor(),
                },
                {
                  id: generateNodeId(),
                  type: 'leaf',
                  color: getRandomColor(),
                },
              ],
            };
          }
          return node;
        });
      });
    },
    []
  );

  const handleRemove = useCallback((nodeId: number) => {
    setRoot((prevRoot) => {
      const removeNode = (node: PanelNode, id: number): { node: PanelNode; removed: boolean; replacement?: PanelNode } => {
        if (node.type === 'split') {
          const leftResult = removeNode(node.children[0], id);
          const rightResult = removeNode(node.children[1], id);

          if (leftResult.removed) {
            return {
              ...rightResult,
              removed: true,
              replacement: node.children[1],
            };
          }

          if (rightResult.removed) {
            return {
              ...leftResult,
              removed: true,
              replacement: node.children[0],
            };
          }

          return {
            node: {
              ...node,
              children: [leftResult.node, rightResult.node],
            },
            removed: false,
          };
        }

        if (node.id === id) {
          return { removed: true, node };
        }

        return { node, removed: false };
      };

      const result = removeNode(prevRoot, nodeId);
      return result.replacement || result.node;
    });
  }, []);

  return { root, handleSplit, handleRemove };
};
