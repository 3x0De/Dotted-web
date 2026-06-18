import { useState, useMemo, useCallback } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  type NodeProps,
  type Node,
  type OnNodesChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "../../Styles/main/Blocks/Moodboard.scss";
import add from "../../assets/Image/Block logo/Add.svg";

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

function Moodboard() {
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
      position: { x: 50, y: 50 },
      data: { label: "Nœud 1", color: "#ffffff", onChangeColor, onChangeLabel },
    },
    {
      id: "n2",
      type: "colorNode",
      position: { x: 300, y: 50 },
      data: { label: "Nœud 2", color: "#ffffff", onChangeColor, onChangeLabel },
    },
  ]);

  const nodeTypes = useMemo(() => ({ colorNode: ColorNode }), []);

  const onNodesChange: OnNodesChange<Node<ColorNodeData>> = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );

  const addNewNode = useCallback(() => {
    const id = `node_${Date.now()}`;

    const newNode: Node<ColorNodeData> = {
      id,
      type: "colorNode",
      position: {
        x: Math.random() * 200 + 50,
        y: Math.random() * 200 + 50,
      },
      data: {
        label: `Nœud ${nodes.length + 1}`,
        color: "#ffffff",
        onChangeColor,
        onChangeLabel,
      },
    };

    setNodes((nds) => [...nds, newNode]);
  }, [nodes.length, onChangeColor, onChangeLabel]);

  return (
    <div className="M00dBo4Rd">
      <button onClick={addNewNode} className="add-btn">
        <img src={add} alt="Ajouter" />
      </button>

      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        fitView
      />
    </div>
  );
}

export default Moodboard;
