import { useCallback, useEffect, useRef, type ChangeEvent } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
  type NodeProps,
  type Connection,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "../../../../styles/main/Page/Block/Component/Graphe.scss";
import Add from "../../../../assets/Img/Header/Add.svg";
import type { InputNodeType } from "../../../../types/MainTypes/BlockTypes/Graphe";

function InputNode({ id, data }: NodeProps<InputNodeType>) {
  const handleTextChange = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      data.onChangeValue?.(id, evt.target.value);
    },
    [id, data],
  );

  const handleColorChange = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      data.onChangeColor?.(id, evt.target.value);
    },
    [id, data],
  );

  return (
    <div className="custom-input-node" style={{ backgroundColor: data.color }}>
      <Handle type="target" position={Position.Top} />
      <div className="node-body">
        <input
          ref={data.registerRef}
          id={`input-text-${id}`}
          name="text"
          type="text"
          value={data.value}
          onChange={handleTextChange}
          onKeyDown={(e) => e.stopPropagation()}
          placeholder="Noeud..."
          className="nodrag"
        />
        <input
          type="color"
          name="color"
          id={`input-color-${id}`}
          value={data.color ?? "#ffffff"}
          onChange={handleColorChange}
          className="nodrag"
        />
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

const nodeTypes = { inputNode: InputNode };
function Graphe({
  children,
  onChange,
  registerRef,
}: {
  children: { Node: InputNodeType[]; Edge: Edge[] };
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  registerRef?: (el: HTMLInputElement | null) => void;
}) {
  const { Node = [], Edge = [] } = children ?? {};

  const inputChangeRef = useRef<(nodeId: string, value: string) => void>(
    () => {},
  );
  const colorChangeRef = useRef<(nodeId: string, color: string) => void>(
    () => {},
  );

  const stableInputChange = useCallback(
    (nodeId: string, value: string) => inputChangeRef.current(nodeId, value),
    [],
  );
  const stableColorChange = useCallback(
    (nodeId: string, color: string) => colorChangeRef.current(nodeId, color),
    [],
  );

  const seededNodes: InputNodeType[] = Node.map((n) => ({
    ...n,
    data: {
      ...n.data,
      onChangeValue: stableInputChange,
      onChangeColor: stableColorChange,
      registerRef,
    },
  }));

  const [nodes, setNodes, onNodesChange] =
    useNodesState<InputNodeType>(seededNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(Edge);

  const handleInputChange = useCallback(
    (nodeId: string, newValue: string) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, value: newValue } }
            : node,
        ),
      );
    },
    [setNodes],
  );

  const handleColorChange = useCallback(
    (nodeId: string, newColor: string) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, color: newColor } }
            : node,
        ),
      );
    },
    [setNodes],
  );

  useEffect(() => {
    inputChangeRef.current = handleInputChange;
    colorChangeRef.current = handleColorChange;
  }, [handleInputChange, handleColorChange]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const addNewNode = () => {
    const nextId = `node_${Date.now()}`;
    const offset = nodes.length * 40;

    const newNode: InputNodeType = {
      id: nextId,
      type: "inputNode" as const,
      position: { x: 100 + offset, y: 100 + offset },
      data: {
        label: `Nœud ${nodes.length + 1}`,
        value: "",
        color: "#ffffff",
        onChangeValue: stableInputChange,
        onChangeColor: stableColorChange,
        registerRef,
      },
    };

    setNodes((nds) => [...nds, newNode]);
  };

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const fakeEvent = {
      target: { value: { Node: nodes, Edge: edges } },
    } as unknown as ChangeEvent<HTMLInputElement>;
    onChange(fakeEvent);
  }, [nodes, edges]);

  return (
    <div className="Graphe">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
      <img src={Add} onClick={addNewNode} alt="Add Node" />
    </div>
  );
}

export default Graphe;
