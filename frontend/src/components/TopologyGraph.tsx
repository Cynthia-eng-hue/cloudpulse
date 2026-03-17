import React, { useEffect, useRef } from 'react';
import { Graph } from '@antv/x6';
import { DagreLayout } from '@antv/layout';

interface TopologyGraphProps {
  nodes: any[];
  edges: any[];
  onNodeClick?: (node: any) => void;
}

const TopologyGraph: React.FC<TopologyGraphProps> = ({ nodes, edges, onNodeClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    graphRef.current = new Graph({
      container: containerRef.current,
      autoResize: true,
      panning: true,
      mousewheel: {
        enabled: true,
        modifiers: ['ctrl', 'meta'],
      },
      grid: {
        size: 10,
        visible: true,
        type: 'dot',
        args: { color: '#f0f0f0', thickness: 1 },
      },
      interacting: {
        nodeMovable: true,
      },
    });

    graphRef.current.on('node:click', ({ node }) => {
      onNodeClick?.(node.getData());
    });

    return () => {
      graphRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (!graphRef.current || nodes.length === 0) return;

    const dagreLayout = new DagreLayout({
      rankdir: 'LR',
      nodesep: 50,
      ranksep: 70,
    } as any);

    const model = (dagreLayout as any).layout({
      nodes: nodes.map(n => ({ 
        id: n.id, 
        width: 140, 
        height: 60,
        data: n 
      })),
      edges: edges.map(e => ({ 
        source: e.source, 
        target: e.target 
      }))
    });


    graphRef.current.clearCells();

    // Render nodes
    model.nodes?.forEach((n: any) => {
      graphRef.current?.addNode({
        id: n.id,
        x: n.x,
        y: n.y,
        width: n.width,
        height: n.height,
        label: n.data.label,
        data: n.data,
        attrs: {
          body: {
            fill: n.data.status === 'error' ? '#fff1f0' : n.data.status === 'warning' ? '#fffbe6' : '#f6ffed',
            stroke: n.data.status === 'error' ? '#ff4d4f' : n.data.status === 'warning' ? '#faad14' : '#52c41a',
            strokeWidth: 2,
            rx: 6,
            ry: 6,
          },
          label: {
            text: n.data.label,
            fill: '#333',
            fontSize: 12,
          },
        },
      });
    });

    // Render edges
    model.edges?.forEach((e: any) => {
      graphRef.current?.addEdge({
        source: e.source,
        target: e.target,
        attrs: {
          line: {
            stroke: '#bfbfbf',
            strokeWidth: 1,
            targetMarker: {
              name: 'block',
              width: 10,
              height: 8,
            },
          },
        },
      });
    });

    graphRef.current.centerContent();
  }, [nodes, edges]);

  return <div ref={containerRef} className="w-screen h-screen bg-white" />;
};

export default TopologyGraph;
