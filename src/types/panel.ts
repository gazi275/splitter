export type NodeType = 'leaf' | 'split';
export type SplitDirection = 'v' | 'h';

export interface LeafNode {
  id: number;
  type: 'leaf';
  color: string;
}

export interface SplitNode {
  id: number;
  type: 'split';
  direction: SplitDirection;
  sizes: [number, number];
  children: [PanelNode, PanelNode];
}

export type PanelNode = LeafNode | SplitNode;

export interface PanelProps {
  node: PanelNode;
  onSplit: (nodeId: number, direction: SplitDirection | 'resize', newSizes?: [number, number]) => void;
  onRemove: (nodeId: number) => void;
  isRoot: boolean;
}
