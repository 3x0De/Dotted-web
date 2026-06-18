import { useCallback } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "../../Styles/main/Blocks/Graphe.scss";

interface Props {
  innerRef: React.RefObject<HTMLHeadingElement | null>;
  onBlur?: (data: { nodes: Node[]; edges: Edge[] }) => void;
  contenu: {
    nodes: Node[];
    edges: Edge[];
  };
}

function Graphe({ innerRef, onBlur, contenu }: Props) {
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

  return (
    <div className="Graph3" ref={innerRef}>
      <ReactFlow
        nodes={contenu.nodes}
        edges={contenu.edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      />
    </div>
  );
}

export default Graphe;
