import React, { useMemo } from 'react';
import { Panel } from '../Panel';
import { usePanelTree } from '../../hooks/usePanelTree';
import { generateNodeId, getRandomColor } from '../../utils/colorUtils';
import { rootStyle } from '../../styles/componentStyles';

/**
 * PanelSplitter - Main app component
 * Manages the recursive panel tree and renders the UI
 */
export const PanelSplitter: React.FC = () => {
  const initialRoot = useMemo(
    () => ({
      id: generateNodeId(),
      type: 'leaf' as const,
      color: getRandomColor(),
    }),
    []
  );

  const { root, handleSplit, handleRemove } = usePanelTree(initialRoot);

  return (
    <div style={rootStyle}>
      <Panel node={root} onSplit={handleSplit} onRemove={handleRemove} isRoot={true} />
    </div>
  );
};

PanelSplitter.displayName = 'PanelSplitter';
