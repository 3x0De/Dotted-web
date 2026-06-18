import { useState, useMemo, useCallback } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type NodeProps,
  type Node,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

type ColorNodeData = {
  label: string;
  color?: string;
  onChangeColor: (id: string, color: string) => void;
  onChangeLabel: (id: string, label: string) => void;
};

function ColorNode({ id, data }: NodeProps<Node<ColorNodeData>>) {
  return (
    <div
      className="Node"
      style={{
        background: data.color || "#ffffff",
        padding: "10px",
        borderRadius: "5px",
        border: "1px solid #ccc",
      }}
    >
      <div>
        <input
          type="text"
          value={data.label}
          onChange={(e) => data.onChangeLabel(id, e.target.value)}
        />
      </div>
      <div>
        <input
          type="color"
          value={data.color || "#ffffff"}
          onChange={(e) => data.onChangeColor(id, e.target.value)}
        />
      </div>
    </div>
  );
}

const initialEdges = [{ id: "n1-n2", source: "n1", target: "n2" }];

export default function Test() {
  const onChangeLabel = useCallback((id: string, newLabel: string) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, label: newLabel } }
          : node,
      ),
    );
  }, []);

  const onChangeColor = useCallback((id: string, newColor: string) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, color: newColor } }
          : node,
      ),
    );
  }, []);

  const [nodes, setNodes] = useState<Node<ColorNodeData>[]>([
    {
      id: "n1",
      type: "colorNode",
      position: { x: 0, y: 0 },
      data: { label: "Node 1", color: "#ffffff", onChangeColor, onChangeLabel },
    },
    {
      id: "n2",
      type: "colorNode",
      position: { x: 250, y: 100 },
      data: { label: "Node 2", color: "#ffffff", onChangeColor, onChangeLabel },
    },
  ]);

  const [edges, setEdges] = useState(initialEdges);

  const nodeTypes = useMemo(() => ({ colorNode: ColorNode }), []);

  const onNodesChange: OnNodesChange<Node<ColorNodeData>> = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      />
    </div>
  );
}
