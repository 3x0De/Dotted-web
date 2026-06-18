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
  img?: string;
  onChangeColor?: (id: string, color: string) => void;
  onChangeLabel?: (id: string, label: string) => void;
  onChangeImg?: (id: string, img: string) => void;
};

function ColorNode({ id, data }: NodeProps<Node<ColorNodeData>>) {
  async function uploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://localhost:8000/Image/get", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      console.error("Erreur upload image", response.status);
      return;
    }

    const json = await response.json();
    if (!json.ok || !json.path) {
      console.error("Réponse serveur image invalide", json);
      return;
    }

    const fileName = json.name || json.path.split("/").pop();
    if (!fileName) {
      console.error("Impossible de retrouver le nom de fichier image");
      return;
    }

    const imageUrl = `http://localhost:8000/Image/charge/${fileName}`;
    data.onChangeImg?.(id, imageUrl);
  }

  return (
    <div className="Node" style={{ background: data.color || "#ffffff" }}>
      {data.img ? (
        <img
          src={`http://localhost:8000/Image/charge/${data.img.split("/").pop()}`}
        />
      ) : (
        <>
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
          {data.label == "" && (
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  uploadImage(e);
                }}
              />
            </div>
          )}
        </>
      )}
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
          img: (node.data as any)?.img,
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

  const onChangeImg = useCallback(
    (id: string, imgUrl: string) => {
      setNodes((nds) => {
        const updated = nds.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, img: imgUrl } }
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
          onChangeImg,
        },
      })),
    [nodes, onChangeColor, onChangeLabel, onChangeImg],
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
      onBlur?.(sanitizeNodes(updated));
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
