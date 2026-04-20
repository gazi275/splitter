import { CSSProperties } from 'react';
import { UI_CONSTANTS, COLORS, Z_INDEX } from '../constants/colors';

export const panelControlButtonStyle = (hovering: boolean): CSSProperties => ({
  width: `${UI_CONSTANTS.BUTTON_SIZE}px`,
  height: `${UI_CONSTANTS.BUTTON_SIZE}px`,
  fontSize: '20px',
  fontWeight: 'bold',
  backgroundColor: COLORS.BUTTON_BG,
  color: COLORS.BUTTON_TEXT,
  border: 'none',
  borderRadius: `${UI_CONSTANTS.BUTTON_BORDER_RADIUS}px`,
  cursor: 'pointer',
  transition: `background-color ${UI_CONSTANTS.TRANSITION_DURATION}`,
});

export const panelControlsContainerStyle = (hovering: boolean): CSSProperties => ({
  display: 'flex',
  gap: `${UI_CONSTANTS.BUTTON_GAP}px`,
  alignItems: 'center',
  justifyContent: 'center',
  opacity: hovering ? UI_CONSTANTS.HOVER_OPACITY.VISIBLE : UI_CONSTANTS.HOVER_OPACITY.HIDDEN,
  transition: `opacity ${UI_CONSTANTS.TRANSITION_DURATION}`,
  zIndex: Z_INDEX.CONTROLS,
});

export const panelLeafStyle: CSSProperties = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
  boxSizing: 'border-box',
  border: '1px solid rgba(255, 255, 255, 0.85)',
  cursor: 'default',
};

export const panelSplitContainerStyle = (isVertical: boolean): CSSProperties => ({
  flex: 1,
  display: 'flex',
  flexDirection: isVertical ? 'row' : 'column',
  overflow: 'hidden',
  position: 'relative',
});

export const panelChildStyle = (percentage: number): CSSProperties => ({
  flex: `${percentage}%`,
  display: 'flex',
  overflow: 'hidden',
});

export const dividerStyle = (isVertical: boolean, isDragging: boolean): CSSProperties => ({
  width: isVertical ? `${UI_CONSTANTS.DIVIDER_WIDTH}px` : '100%',
  height: isVertical ? '100%' : `${UI_CONSTANTS.DIVIDER_WIDTH}px`,
  backgroundColor: COLORS.DIVIDER,
  cursor: isVertical ? 'col-resize' : 'row-resize',
  userSelect: 'none',
  flexShrink: 0,
  boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.8)',
  transition: isDragging ? 'none' : `background-color ${UI_CONSTANTS.TRANSITION_DURATION}`,
  zIndex: Z_INDEX.DIVIDER,
});

export const rootStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  minHeight: '100vh',
  margin: 0,
  padding: 0,
  fontFamily: 'system-ui, -apple-system, sans-serif',
  overflow: 'hidden',
  display: 'flex',
};
