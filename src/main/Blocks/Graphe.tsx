import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Handle,
  Position,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type OnNodesDelete,
  type OnEdgesDelete,
  type Node,
  type Edge,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "../../Styles/main/Blocks/Graphe.scss";
import add from "../../assets/Image/Block logo/Add.svg";

type ColorNodeData = {
  label: string;
  color?: string;
  onChangeColor: (id: string, color: string) => void;
  onChangeLabel: (id: string, label: string) => void;
};

function ColorNode({ id, data }: NodeProps<Node<ColorNodeData>>) {
  return (
    <div className="Node" style={{ background: data.color || "#ffffff" }}>
      <Handle
        type="target"
        position={Position.Left}
        id="target-left"
        isConnectable={true}
      />

      <div>
        <input
          type="text"
          value={data.label}
          onChange={(e) => data.onChangeLabel(id, e.target.value)}
        />
        <input
          type="color"
          value={data.color || "#ffffff"}
          onChange={(e) => data.onChangeColor(id, e.target.value)}
        />
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="source-right"
        isConnectable={true}
      />
    </div>
  );
}

interface Props {
  innerRef: React.RefObject<HTMLHeadingElement | null>;
  oninput: (e: React.KeyboardEvent<HTMLElement>) => void;
  onBlur?: (data: { nodes: Node[]; edges: Edge[] }) => void;
  contenu: {
    nodes: Node[];
    edges: Edge[];
  };
}

function Graphe({ innerRef, oninput, onBlur, contenu }: Props) {
  const nodeTypes = useMemo(() => ({ colorNode: ColorNode }), []);

  const handleColorChange = useCallback(
    (id: string, color: string) => {
      const nextNodes = contenu.nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, color } } : node,
      );
      onBlur?.({ nodes: nextNodes, edges: contenu.edges });
    },
    [contenu.nodes, contenu.edges, onBlur],
  );

  const handleLabelChange = useCallback(
    (id: string, label: string) => {
      const nextNodes = contenu.nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, label } } : node,
      );
      onBlur?.({ nodes: nextNodes, edges: contenu.edges });
    },
    [contenu.nodes, contenu.edges, onBlur],
  );

  const nodesWithHandlers = useMemo(() => {
    return contenu.nodes.map((node) => ({
      ...node,
      type: "colorNode",
      data: {
        ...node.data,
        onChangeColor: handleColorChange,
        onChangeLabel: handleLabelChange,
      },
    }));
  }, [contenu.nodes, handleColorChange, handleLabelChange]);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      const nextNodes = applyNodeChanges(changes, contenu.nodes);
      onBlur?.({ nodes: nextNodes, edges: contenu.edges });
    },
    [contenu.nodes, contenu.edges, onBlur],
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      const nextEdges = applyEdgeChanges(changes, contenu.edges);
      onBlur?.({ nodes: contenu.nodes, edges: nextEdges });
    },
    [contenu.nodes, contenu.edges, onBlur],
  );

  const onConnect: OnConnect = useCallback(
    (params) => {
      const nextEdges = addEdge(params, contenu.edges);
      onBlur?.({ nodes: contenu.nodes, edges: nextEdges });
    },
    [contenu.nodes, contenu.edges, onBlur],
  );

  const onNodesDelete: OnNodesDelete = useCallback(
    (deletedNodes) => {
      const nextNodes = contenu.nodes.filter(
        (n) => !deletedNodes.some((dn) => dn.id === n.id),
      );

      onBlur?.({ nodes: nextNodes, edges: contenu.edges });
    },
    [contenu.nodes, contenu.edges, onBlur],
  );

  const onEdgesDelete: OnEdgesDelete = useCallback(
    (deletedEdges) => {
      const nextEdges = contenu.edges.filter(
        (e) => !deletedEdges.some((de) => de.id === e.id),
      );

      onBlur?.({ nodes: contenu.nodes, edges: nextEdges });
    },
    [contenu.nodes, contenu.edges, onBlur],
  );

  const addNewNode = useCallback(() => {
    const id = `node_${Date.now()}`;
    const newNode: Node = {
      id,
      type: "colorNode",
      position: { x: Math.random() * 250, y: Math.random() * 250 },
      data: {
        label: `Nœud ${contenu.nodes.length + 1}`,
        color: "#ffffff",
      },
    };

    const nextNodes = [...contenu.nodes, newNode];
    onBlur?.({ nodes: nextNodes, edges: contenu.edges });
  }, [contenu.nodes, contenu.edges, onBlur]);

  return (
    <div className="Graph3" ref={innerRef} onKeyDown={oninput}>
      <button onClick={addNewNode}>
        <img src={add} alt="Ajouter" />
      </button>

      <div>
        <ReactFlow
          nodes={nodesWithHandlers}
          edges={contenu.edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodesDelete={onNodesDelete}
          onEdgesDelete={onEdgesDelete}
          nodeTypes={nodeTypes}
          deleteKeyCode={["Backspace", "Delete"]}
          fitView
        />
      </div>
    </div>
  );
}

export default Graphe;
