export interface PanelControlButtonProps {
  onClick: () => void;
  label: string;
  title: string;
}

export interface DividerProps {
  isVertical: boolean;
  onDragStart: (e: React.MouseEvent<HTMLDivElement>) => void;
  isDragging: boolean;
}
