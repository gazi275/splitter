import React, { useEffect, useMemo } from 'react';
import { Panel } from '../Panel';
import { usePanelTree } from '../../hooks/usePanelTree';
import { generateNodeId, getRandomColor } from '../../utils/colorUtils';
import { normalizePanelTree } from '../../utils/treeUtils';
import { rootStyle } from '../../styles/componentStyles';
import { PanelNode } from '../../types/panel';

interface PanelSplitterProps {
  initialLayout?: PanelNode;
  onLayoutChange?: (layout: PanelNode) => void;
}

/**
 * PanelSplitter - Main app component
 * Manages the recursive panel tree and renders the UI
 */
export const PanelSplitter: React.FC<PanelSplitterProps> = ({
  initialLayout,
  onLayoutChange,
}) => {
  const initialRoot = useMemo(
    () => ({
      id: generateNodeId(),
      type: 'leaf' as const,
      color: getRandomColor(),
    }),
    []
  );

  const { root, setRoot, handleSplit, handleRemove } = usePanelTree(initialRoot);

  useEffect(() => {
    if (initialLayout) {
      setRoot(normalizePanelTree(initialLayout));
    }
  }, [initialLayout, setRoot]);

  useEffect(() => {
    onLayoutChange?.(root);
  }, [onLayoutChange, root]);

  return (
    <div style={rootStyle}>
      <Panel node={root} onSplit={handleSplit} onRemove={handleRemove} isRoot={true} />
    </div>
  );
};

PanelSplitter.displayName = 'PanelSplitter';
