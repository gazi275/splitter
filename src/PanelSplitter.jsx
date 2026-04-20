import React, { useState, useRef } from 'react';

const BRIGHT_COLORS = [
  '#FF1493', // Hot Pink
  '#00FF41', // Lime Green
  '#FF00FF', // Magenta
  '#00CED1', // Dark Turquoise
  '#0080FF', // Electric Blue
  '#FF6347', // Tomato / Coral
  '#00FFFF', // Cyan
  '#FFD700', // Gold
  '#FF4500', // Orange Red
  '#39FF14', // Neon Green
  '#FF10F0', // Deep Magenta
  '#00D9FF', // Sky Cyan
];

const getRandomColor = () => BRIGHT_COLORS[Math.floor(Math.random() * BRIGHT_COLORS.length)];

let nodeIdCounter = 0;

const Panel = ({ node, onSplit, onRemove, isRoot }) => {
  const [hovering, setHovering] = useState(false);
  const [dragging, setDragging] = useState(false);
  const dividerRef = useRef(null);

  if (node.type === 'leaf') {
    return (
      <div
        style={{
          flex: 1,
          backgroundColor: node.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'default',
        }}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {/* Control Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: hovering ? 1 : 0.3,
            transition: 'opacity 0.2s',
            zIndex: 10,
          }}
        >
          {!isRoot && (
            <button
              onClick={() => onRemove(node.id)}
              style={{
                width: '40px',
                height: '40px',
                fontSize: '20px',
                fontWeight: 'bold',
                backgroundColor: 'rgba(100, 100, 100, 0.6)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = 'rgba(80, 80, 80, 0.8)')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = 'rgba(100, 100, 100, 0.6)')}
            >
              −
            </button>
          )}
          <button
            onClick={() => onSplit(node.id, 'v')}
            style={{
              width: '40px',
              height: '40px',
              fontSize: '20px',
              fontWeight: 'bold',
              backgroundColor: 'rgba(100, 100, 100, 0.6)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = 'rgba(80, 80, 80, 0.8)')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = 'rgba(100, 100, 100, 0.6)')}
          >
            v
          </button>
          <button
            onClick={() => onSplit(node.id, 'h')}
            style={{
              width: '40px',
              height: '40px',
              fontSize: '20px',
              fontWeight: 'bold',
              backgroundColor: 'rgba(100, 100, 100, 0.6)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = 'rgba(80, 80, 80, 0.8)')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = 'rgba(100, 100, 100, 0.6)')}
          >
            h
          </button>
        </div>
      </div>
    );
  }

  // Split node
  if (node.type === 'split') {
    const isVertical = node.direction === 'v';
    const [size1, size2] = node.sizes;

    const handleDragStart = (e) => {
      setDragging(true);
    };

    const handleDragEnd = () => {
      setDragging(false);
    };

    const handleMouseMove = (e) => {
      if (!dragging || !dividerRef.current) return;

      const container = dividerRef.current.parentElement;
      if (!container) return;

      const rect = container.getBoundingClientRect();

      if (isVertical) {
        const newPos = ((e.clientX - rect.left) / rect.width) * 100;
        const newSize1 = Math.max(10, Math.min(90, newPos));
        const newSize2 = 100 - newSize1;
        onSplit(node.id, 'resize', [newSize1, newSize2]);
      } else {
        const newPos = ((e.clientY - rect.top) / rect.height) * 100;
        const newSize1 = Math.max(10, Math.min(90, newPos));
        const newSize2 = 100 - newSize1;
        onSplit(node.id, 'resize', [newSize1, newSize2]);
      }
    };

    React.useEffect(() => {
      if (dragging) {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleDragEnd);
        return () => {
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('mouseup', handleDragEnd);
        };
      }
    }, [dragging]);

    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: isVertical ? 'row' : 'column',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* First Child */}
        <div
          style={{
            flex: `${size1}%`,
            display: 'flex',
            overflow: 'hidden',
          }}
        >
          <Panel node={node.children[0]} onSplit={onSplit} onRemove={onRemove} isRoot={false} />
        </div>

        {/* Divider */}
        <div
          ref={dividerRef}
          onMouseDown={handleDragStart}
          style={{
            width: isVertical ? '4px' : '100%',
            height: isVertical ? '100%' : '4px',
            backgroundColor: '#999',
            cursor: isVertical ? 'col-resize' : 'row-resize',
            userSelect: 'none',
            flexShrink: 0,
            transition: dragging ? 'none' : 'background-color 0.2s',
            ':hover': { backgroundColor: '#666' },
          }}
          onMouseEnter={(e) => !dragging && (e.target.style.backgroundColor = '#666')}
          onMouseLeave={(e) => !dragging && (e.target.style.backgroundColor = '#999')}
        />

        {/* Second Child */}
        <div
          style={{
            flex: `${size2}%`,
            display: 'flex',
            overflow: 'hidden',
          }}
        >
          <Panel node={node.children[1]} onSplit={onSplit} onRemove={onRemove} isRoot={false} />
        </div>
      </div>
    );
  }
};

export default function PanelSplitter() {
  const [root, setRoot] = useState({
    id: nodeIdCounter++,
    type: 'leaf',
    color: getRandomColor(),
  });

  const findNodeById = (node, id) => {
    if (node.id === id) return node;
    if (node.type === 'split') {
      const found = findNodeById(node.children[0], id);
      if (found) return found;
      return findNodeById(node.children[1], id);
    }
    return null;
  };

  const updateNodeById = (node, id, updater) => {
    if (node.id === id) return updater(node);
    if (node.type === 'split') {
      return {
        ...node,
        children: [
          updateNodeById(node.children[0], id, updater),
          updateNodeById(node.children[1], id, updater),
        ],
      };
    }
    return node;
  };

  const handleSplit = (nodeId, direction, newSizes = null) => {
    setRoot((prevRoot) => {
      return updateNodeById(prevRoot, nodeId, (node) => {
        if (direction === 'resize' && newSizes) {
          return {
            ...node,
            sizes: newSizes,
          };
        }

        if (node.type === 'leaf') {
          return {
            id: node.id,
            type: 'split',
            direction,
            sizes: [50, 50],
            children: [
              {
                id: nodeIdCounter++,
                type: 'leaf',
                color: getRandomColor(),
              },
              {
                id: nodeIdCounter++,
                type: 'leaf',
                color: getRandomColor(),
              },
            ],
          };
        }
        return node;
      });
    });
  };

  const handleRemove = (nodeId) => {
    setRoot((prevRoot) => {
      const removeNode = (node, id, parentId = null, isLeftChild = null) => {
        if (node.type === 'split') {
          const leftResult = removeNode(node.children[0], id, node.id, true);
          const rightResult = removeNode(node.children[1], id, node.id, false);

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
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        minHeight: '100vh',
        margin: 0,
        padding: 0,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        overflow: 'hidden',
        display: 'flex',
      }}
    >
      <Panel node={root} onSplit={handleSplit} onRemove={handleRemove} isRoot={true} />
    </div>
  );
}
