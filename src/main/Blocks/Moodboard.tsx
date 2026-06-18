import { useState, useMemo, useCallback, useEffect } from "react";
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
  onChangeColor?: (id: string, color: string) => void;
  onChangeLabel?: (id: string, label: string) => void;
};

// ✅ Callbacks passés via nodeTypes context plutôt que dans data
// On garde la même structure mais on corrige les bugs

function ColorNode({ id, data }: NodeProps<Node<ColorNodeData>>) {
  return (
    <div className="Node" style={{ background: data.color || "#ffffff" }}>
      <div>
        <input
          type="text"
          value={data.label}
          onChange={(e) => data.onChangeLabel?.(id, e.target.value)}
        />
      </div>
      <div>
        <input
          type="color"
          value={data.color || "#ffffff"}
          onChange={(e) => data.onChangeColor?.(id, e.target.value)}
        />
      </div>
    </div>
  );
}

interface Props {
  innerRef: React.RefObject<HTMLHeadingElement | null>;
  oninput: (e: React.KeyboardEvent<HTMLElement>) => void;
  onBlur?: (data: Node<ColorNodeData>[]) => void;
  contenu: Node[];
}

function Moodboard({ innerRef, oninput, onBlur, contenu }: Props) {
  const [nodes, setNodes] = useState<Node<ColorNodeData>[]>(
    contenu as Node<ColorNodeData>[],
  );

  useEffect(() => {
    setNodes(contenu as Node<ColorNodeData>[]);
  }, [contenu]);

  const sanitizeNodes = useCallback(
    (nodesToSanitize: Node<ColorNodeData>[]) =>
      nodesToSanitize.map((node) => ({
        ...node,
        data: {
          label: node.data.label,
          color: node.data.color,
        },
      })),
    [],
  );

  const onChangeLabel = useCallback(
    (id: string, newLabel: string) => {
      setNodes((nds) => {
        const updated = nds.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, label: newLabel } }
            : node,
        );
        onBlur?.(sanitizeNodes(updated));
        return updated;
      });
    },
    [onBlur, sanitizeNodes],
  );

  const onChangeColor = useCallback(
    (id: string, newColor: string) => {
      setNodes((nds) => {
        const updated = nds.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, color: newColor } }
            : node,
        );
        onBlur?.(sanitizeNodes(updated));
        return updated;
      });
    },
    [onBlur, sanitizeNodes],
  );

  const nodeTypes = useMemo(() => ({ colorNode: ColorNode }), []);

  const nodesWithHandlers = useMemo(
    () =>
      nodes.map((node) => ({
        ...node,
        type: "colorNode",
        data: {
          ...node.data,
          onChangeColor,
          onChangeLabel,
        },
      })),
    [nodes, onChangeColor, onChangeLabel],
  );

  const onNodesChange: OnNodesChange<Node<ColorNodeData>> = useCallback(
    (changes) => {
      setNodes((nds) => {
        const updated = applyNodeChanges(changes, nds); // ✅ résultat utilisé
        onBlur?.(sanitizeNodes(updated));
        return updated;
      });
    },
    [onBlur, sanitizeNodes],
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
      },
    };
    setNodes((nds) => {
      const updated = [...nds, newNode];
      onBlur?.(updated);
      return updated;
    });
  }, [nodes.length, onChangeColor, onChangeLabel, onBlur]);

  return (
    <div className="M00dBo4Rd" ref={innerRef} onKeyDown={oninput}>
      <button onClick={addNewNode} className="add-btn">
        <img src={add} alt="Ajouter" />
      </button>
      <ReactFlow
        nodes={nodesWithHandlers}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        fitView
      />
    </div>
  );
}

export default Moodboard;
