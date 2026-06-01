import "./Styles/App.scss";
import Page from "./Page";
import { useState } from "react";
import type { BlockItem } from "./Types";

function App() {
  const [titlre, titlreState] = useState<string>("");

  const [blocks, setBlocks] = useState<BlockItem[]>([]);

  const [idAFocus, setIdAFocus] = useState<string | null>(null);

  const handleAddBlockAfter = (targetId: string) => {
    const newId = `b${crypto.randomUUID()}`;

    const newBlock: BlockItem = {
      id: newId,
      type: "",
      content: "",
    };

    const insertRecursive = (list: BlockItem[]): BlockItem[] => {
      const newList: BlockItem[] = [];
      for (const block of list) {
        newList.push(block);
        if (block.id === targetId) {
          newList.push(newBlock);
        } else if (block.type === "C4DR3" && Array.isArray(block.content)) {
          newList[newList.length - 1] = {
            ...block,
            content: insertRecursive([...(block.content as BlockItem[])]),
          };
        } else if (
          block.type === "Menu" &&
          block.content &&
          typeof block.content === "object" &&
          "enfants" in block.content
        ) {
          newList[newList.length - 1] = {
            ...block,
            content: {
              ...block.content,
              enfants: block.content.enfants
                ? insertRecursive([...block.content.enfants])
                : [],
            },
          };
        }
      }
      return newList;
    };

    setBlocks((prev) => insertRecursive([...prev]));
    setIdAFocus(newId);
  };

  const handleDeleteBlock = (blockToDelete: BlockItem) => {
    if (!blockToDelete) return;

    const removeRecursive = (list: BlockItem[]): BlockItem[] => {
      return list
        .filter((block) => block.id !== blockToDelete.id)
        .map((block) => {
          if (block.type === "C4DR3" && Array.isArray(block.content)) {
            return {
              ...block,
              content: removeRecursive([...(block.content as BlockItem[])]),
            };
          }
          if (
            block.type === "Menu" &&
            block.content &&
            typeof block.content === "object" &&
            "enfants" in block.content
          ) {
            return {
              ...block,
              content: {
                ...block.content,
                enfants: block.content.enfants
                  ? removeRecursive([...block.content.enfants])
                  : [],
              },
            };
          }
          return block;
        });
    };

    setBlocks((prev) => {
      const updated = removeRecursive([...prev]);
      return updated.length === 0
        ? [{ id: "fallback", type: "", content: "" }]
        : updated;
    });
  };

  const handleUpdateBlock = (id: string, newType: string, newContent: any) => {
    const updateRecursive = (list: BlockItem[]): BlockItem[] => {
      return list.map((block) => {
        if (block.id === id) {
          return { ...block, type: newType, content: newContent };
        }
        if (block.type === "C4DR3" && Array.isArray(block.content)) {
          return {
            ...block,
            content: updateRecursive([...(block.content as BlockItem[])]),
          };
        }
        if (
          block.type === "Menu" &&
          block.content &&
          typeof block.content === "object" &&
          "enfants" in block.content
        ) {
          return {
            ...block,
            content: {
              ...block.content,
              enfants: block.content.enfants
                ? updateRecursive([...block.content.enfants])
                : [],
            },
          };
        }
        return block;
      });
    };

    setBlocks((prev) => updateRecursive([...prev]));
  };

  return (
    <Page
      titre={titlre}
      titreState={titlreState}
      Blocks={blocks}
      onDeleteBlock={handleDeleteBlock}
      onUpdate={handleUpdateBlock}
      idAFocus={idAFocus}
      setIdAFocus={setIdAFocus}
      addBlock={handleAddBlockAfter}
    />
  );
}

export default App;
