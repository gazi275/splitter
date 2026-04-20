import { useState, useCallback } from 'react';
import { PanelNode, SplitDirection } from '../types/panel';
import { generateNodeId, getDistinctColorPair } from '../utils/colorUtils';
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
            const [firstColor, secondColor] = getDistinctColorPair();

            return {
              id: node.id,
              type: 'split',
              direction,
              sizes: [50, 50],
              children: [
                {
                  id: generateNodeId(),
                  type: 'leaf',
                  color: firstColor,
                },
                {
                  id: generateNodeId(),
                  type: 'leaf',
                  color: secondColor,
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
      const removeNode = (node: PanelNode, id: number): PanelNode | null => {
        if (node.type === 'leaf') {
          return node.id === id ? null : node;
        }

        const leftResult = removeNode(node.children[0], id);
        const rightResult = removeNode(node.children[1], id);

        if (leftResult === node.children[0] && rightResult === node.children[1]) {
          return node;
        }

        if (leftResult === null) {
          return rightResult;
        }

        if (rightResult === null) {
          return leftResult;
        }

        return {
          ...node,
          children: [leftResult, rightResult],
        };
      };

      const result = removeNode(prevRoot, nodeId);
      return result ?? prevRoot;
    });
  }, []);

  return { root, handleSplit, handleRemove };
};
