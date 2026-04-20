import React, { useState, useEffect } from 'react';
import { PanelProps } from '../../types/panel';
import {
  panelLeafStyle,
  panelSplitContainerStyle,
  panelChildStyle,
  dividerStyle,
  dividerLabelStyle,
  panelControlsContainerStyle,
  panelControlButtonStyle,
} from '../../styles/componentStyles';
import { COLORS, UI_CONSTANTS } from '../../constants/colors';

/**
 * Panel Control Button Component
 */
const PanelControlButton: React.FC<{
  onClick: () => void;
  label: string;
  title: string;
}> = ({ onClick, label, title }) => (
  <button
    onClick={onClick}
    title={title}
    style={panelControlButtonStyle()}
    onMouseEnter={(e) => {
      const target = e.currentTarget as HTMLButtonElement;
      target.style.backgroundColor = COLORS.BUTTON_BG_HOVER;
    }}
    onMouseLeave={(e) => {
      const target = e.currentTarget as HTMLButtonElement;
      target.style.backgroundColor = COLORS.BUTTON_BG;
    }}
  >
    {label}
  </button>
);

/**
 * Divider Component for resizable split
 */
const Divider: React.FC<{
  isVertical: boolean;
  onDragStart: (e: React.MouseEvent<HTMLDivElement>) => void;
  isDragging: boolean;
  percentage: number;
}> = ({ isVertical, onDragStart, isDragging, percentage }) => {
  const labelText = `${Math.round(percentage)}%`;

  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    event.currentTarget.style.backgroundColor = COLORS.DIVIDER_HOVER;
  };

  const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
    event.currentTarget.style.backgroundColor = COLORS.DIVIDER;
  };

  return (
    <div
      onMouseDown={onDragStart}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={dividerStyle(isVertical, isDragging)}
    >
      {isDragging && <div style={dividerLabelStyle}>{labelText}</div>}
    </div>
  );
};

/**
 * Panel Component - Handles both leaf and split nodes
 */
export const Panel: React.FC<PanelProps> = ({ node, onSplit, onRemove, isRoot }) => {
  const [hovering, setHovering] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [previewPercentage, setPreviewPercentage] = useState<number | null>(null);
  const isSplitNode = node.type === 'split';
  const isVertical = isSplitNode ? node.direction === 'v' : false;

  const handleDragEnd = () => {
    setDragging(false);
    setPreviewPercentage(null);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging || !isSplitNode) return;

    const container = document.querySelector(`[data-panel-id="${node.id}"]`);
    if (!container) return;

    const rect = container.getBoundingClientRect();

    if (isVertical) {
      const newPos = ((e.clientX - rect.left) / rect.width) * 100;
      const newSize1 = Math.max(
        UI_CONSTANTS.MIN_PANEL_SIZE,
        Math.min(UI_CONSTANTS.MAX_PANEL_SIZE, newPos)
      );
      const newSize2 = 100 - newSize1;
      setPreviewPercentage(newSize1);
      onSplit(node.id, 'resize', [newSize1, newSize2]);
    } else {
      const newPos = ((e.clientY - rect.top) / rect.height) * 100;
      const newSize1 = Math.max(
        UI_CONSTANTS.MIN_PANEL_SIZE,
        Math.min(UI_CONSTANTS.MAX_PANEL_SIZE, newPos)
      );
      const newSize2 = 100 - newSize1;
      setPreviewPercentage(newSize1);
      onSplit(node.id, 'resize', [newSize1, newSize2]);
    }
  };

  useEffect(() => {
    if (!dragging || !isSplitNode) return;

    window.addEventListener('mousemove', handleMouseMove as any);
    window.addEventListener('mouseup', handleDragEnd);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove as any);
      window.removeEventListener('mouseup', handleDragEnd);
    };
  }, [dragging, isSplitNode, isVertical, node.id, onSplit]);

  if (node.type === 'leaf') {
    return (
      <div
        style={{
          ...panelLeafStyle,
          backgroundColor: node.color,
        }}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {/* Control Buttons */}
        <div style={panelControlsContainerStyle(hovering)}>
          {!isRoot && (
            <PanelControlButton
              onClick={() => onRemove(node.id)}
              label="−"
              title="Remove this panel"
            />
          )}
          <PanelControlButton
            onClick={() => onSplit(node.id, 'v')}
            label="v"
            title="Split vertically (left/right)"
          />
          <PanelControlButton
            onClick={() => onSplit(node.id, 'h')}
            label="h"
            title="Split horizontally (top/bottom)"
          />
        </div>
      </div>
    );
  }

  // Split node
  if (node.type === 'split') {
    const [size1, size2] = node.sizes;
    const visiblePercentage = previewPercentage ?? size1;

    const handleDragStart = () => {
      setDragging(true);
      setPreviewPercentage(size1);
    };

    return (
      <div style={panelSplitContainerStyle(isVertical)} data-panel-id={node.id}>
        {/* First Child */}
        <div style={panelChildStyle(size1)}>
          <Panel node={node.children[0]} onSplit={onSplit} onRemove={onRemove} isRoot={false} />
        </div>

        {/* Divider */}
        <Divider
          isVertical={isVertical}
          onDragStart={handleDragStart}
          isDragging={dragging}
          percentage={visiblePercentage}
        />

        {/* Second Child */}
        <div style={panelChildStyle(size2)}>
          <Panel node={node.children[1]} onSplit={onSplit} onRemove={onRemove} isRoot={false} />
        </div>
      </div>
    );
  }

  return null;
};

Panel.displayName = 'Panel';
