import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { PanelProps } from '../../types/panel';
import {
  panelLeafStyle,
  panelSplitContainerStyle,
  panelChildStyle,
  dividerStyle,
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
    style={panelControlButtonStyle(false)}
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
const Divider = forwardRef<HTMLDivElement, {
  isVertical: boolean;
  onDragStart: (e: React.MouseEvent<HTMLDivElement>) => void;
  isDragging: boolean;
}>(({ isVertical, onDragStart, isDragging }, ref) => {
  const dividerRef = useRef<HTMLDivElement>(null);

  const setRefs = (element: HTMLDivElement | null) => {
    dividerRef.current = element;

    if (typeof ref === 'function') {
      ref(element);
    } else if (ref) {
      ref.current = element;
    }
  };

  const handleMouseEnter = () => {
    if (!isDragging && dividerRef.current) {
      dividerRef.current.style.backgroundColor = COLORS.DIVIDER_HOVER;
    }
  };

  const handleMouseLeave = () => {
    if (!isDragging && dividerRef.current) {
      dividerRef.current.style.backgroundColor = COLORS.DIVIDER;
    }
  };

  return (
    <div
      ref={setRefs}
      onMouseDown={onDragStart}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={dividerStyle(isVertical, isDragging)}
    />
  );
});

/**
 * Panel Component - Handles both leaf and split nodes
 */
export const Panel: React.FC<PanelProps> = ({ node, onSplit, onRemove, isRoot }) => {
  const [hovering, setHovering] = useState(false);
  const [dragging, setDragging] = useState(false);

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
    const isVertical = node.direction === 'v';
    const [size1, size2] = node.sizes;

    const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
      setDragging(true);
    };

    const handleDragEnd = () => {
      setDragging(false);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging) return;

      const container = document.querySelector(`[data-panel-id="${node.id}"]`)?.parentElement;
      if (!container) return;

      const rect = container.getBoundingClientRect();

      if (isVertical) {
        const newPos = ((e.clientX - rect.left) / rect.width) * 100;
        const newSize1 = Math.max(
          UI_CONSTANTS.MIN_PANEL_SIZE,
          Math.min(UI_CONSTANTS.MAX_PANEL_SIZE, newPos)
        );
        const newSize2 = 100 - newSize1;
        onSplit(node.id, 'resize', [newSize1, newSize2]);
      } else {
        const newPos = ((e.clientY - rect.top) / rect.height) * 100;
        const newSize1 = Math.max(
          UI_CONSTANTS.MIN_PANEL_SIZE,
          Math.min(UI_CONSTANTS.MAX_PANEL_SIZE, newPos)
        );
        const newSize2 = 100 - newSize1;
        onSplit(node.id, 'resize', [newSize1, newSize2]);
      }
    };

    useEffect(() => {
      if (dragging) {
        window.addEventListener('mousemove', handleMouseMove as any);
        window.addEventListener('mouseup', handleDragEnd);
        return () => {
          window.removeEventListener('mousemove', handleMouseMove as any);
          window.removeEventListener('mouseup', handleDragEnd);
        };
      }
    }, [dragging]);

    return (
      <div style={panelSplitContainerStyle(isVertical)} data-panel-id={node.id}>
        {/* First Child */}
        <div style={panelChildStyle(size1)}>
          <Panel node={node.children[0]} onSplit={onSplit} onRemove={onRemove} isRoot={false} />
        </div>

        {/* Divider */}
        <Divider
          ref={dividerRef}
          isVertical={isVertical}
          onDragStart={handleDragStart}
          isDragging={dragging}
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
