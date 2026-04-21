import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { Panel } from '../Panel';
import { usePanelTree } from '../../hooks/usePanelTree';
import { generateNodeId, getRandomColor, setNodeIdCounter } from '../../utils/colorUtils';
import { getMaxNodeId, normalizePanelTree } from '../../utils/treeUtils';
import { rootStyle } from '../../styles/componentStyles';
import { PanelNode } from '../../types/panel';

interface PanelSplitterProps {
  initialLayout?: PanelNode;
  onLayoutChange?: (layout: PanelNode) => void;
  onHistoryStateChange?: (state: { canUndo: boolean; canRedo: boolean }) => void;
}

export interface PanelSplitterRef {
  undo: () => void;
  redo: () => void;
}

const cloneLayout = (layout: PanelNode): PanelNode => JSON.parse(JSON.stringify(layout)) as PanelNode;

/**
 * PanelSplitter - Main app component
 * Manages the recursive panel tree and renders the UI
 */
export const PanelSplitter = forwardRef<PanelSplitterRef, PanelSplitterProps>(function PanelSplitter(
  { initialLayout, onLayoutChange, onHistoryStateChange },
  ref
) {
  const initialRoot = useMemo(
    () => ({
      id: generateNodeId(),
      type: 'leaf' as const,
      color: getRandomColor(),
    }),
    []
  );

  const { root, setRoot, handleSplit, handleRemove } = usePanelTree(initialRoot);
  const historyRef = useRef<PanelNode[]>([cloneLayout(initialRoot)]);
  const historyIndexRef = useRef(0);
  const skipHistoryCommitRef = useRef(false);

  const emitHistoryState = useCallback(() => {
    onHistoryStateChange?.({
      canUndo: historyIndexRef.current > 0,
      canRedo: historyIndexRef.current < historyRef.current.length - 1,
    });
  }, [onHistoryStateChange]);

  const undo = useCallback(() => {
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current -= 1;
    skipHistoryCommitRef.current = true;
    setRoot(cloneLayout(historyRef.current[historyIndexRef.current]));
    emitHistoryState();
  }, [emitHistoryState, setRoot]);

  const redo = useCallback(() => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current += 1;
    skipHistoryCommitRef.current = true;
    setRoot(cloneLayout(historyRef.current[historyIndexRef.current]));
    emitHistoryState();
  }, [emitHistoryState, setRoot]);

  useImperativeHandle(
    ref,
    () => ({
      undo,
      redo,
    }),
    [redo, undo]
  );

  useEffect(() => {
    if (initialLayout) {
      const normalizedLayout = normalizePanelTree(initialLayout);
      historyRef.current = [cloneLayout(normalizedLayout)];
      historyIndexRef.current = 0;
      skipHistoryCommitRef.current = true;
      setRoot(normalizedLayout);
      setNodeIdCounter(getMaxNodeId(normalizedLayout) + 1);
      emitHistoryState();
    }
  }, [emitHistoryState, initialLayout, setRoot]);

  useEffect(() => {
    if (skipHistoryCommitRef.current) {
      skipHistoryCommitRef.current = false;
      onLayoutChange?.(root);
      return;
    }

    const currentBase = historyRef.current.slice(0, historyIndexRef.current + 1);
    const previous = currentBase[currentBase.length - 1];
    if (JSON.stringify(previous) !== JSON.stringify(root)) {
      const nextHistory = [...currentBase, cloneLayout(root)];
      historyRef.current = nextHistory.slice(-100);
      historyIndexRef.current = historyRef.current.length - 1;
      emitHistoryState();
    }

    onLayoutChange?.(root);
  }, [emitHistoryState, onLayoutChange, root]);

  return (
    <div style={rootStyle}>
      <Panel node={root} onSplit={handleSplit} onRemove={handleRemove} isRoot={true} />
    </div>
  );
});

PanelSplitter.displayName = 'PanelSplitter';
