import Page from "./Page";
import { useEffect, useState } from "react";
import type { BlockItem } from "./Types";
import { DragDropProvider } from "@dnd-kit/react";

function Wrapper() {
  const [titlre, titlreState] = useState<string>("");
  const [blocks, setBlocks] = useState<BlockItem[]>([
    {
      id: "b1",
      type: "",
      content: "",
    },
    {
      id: "b2",
      type: "",
      content: "",
    },
  ]);
  const [idAFocus, setIdAFocus] = useState<string | null>(null);

  async function fetchTitre() {
    const response = await fetch(
      "http://localhost:8000/titre" + window.location.pathname,
    );
    const data = await response.json();
    titlreState(data);
  }

  useEffect(() => {
    fetchTitre();
  }, [window.location.pathname]);

  const handleAddBlockAfter = (targetId: string) => {
    const newId = `b${crypto.randomUUID()}`;
    const newBlock: BlockItem = { id: newId, type: "", content: "" };

    const insertRecursive = (list: BlockItem[]): BlockItem[] => {
      const newList: BlockItem[] = [];
      for (const block of list) {
        newList.push(block);
        if (block.id === targetId) {
          newList.push(newBlock);
        } else if (block.type === "Colonnes" && Array.isArray(block.content)) {
          newList[newList.length - 1] = {
            ...block,
            content: (block.content as BlockItem[][]).map((col) =>
              insertRecursive([...col]),
            ),
          };
        } else if (block.type === "C4DR3" && Array.isArray(block.content)) {
          newList[newList.length - 1] = {
            ...block,
            content: insertRecursive([...(block.content as BlockItem[])]),
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
          if (block.type === "Colonnes" && Array.isArray(block.content)) {
            const nouvellesColonnes = (block.content as BlockItem[][])
              .map((col) => removeRecursive([...col]))
              .filter((col) => col.length > 0);

            return {
              ...block,
              content: nouvellesColonnes,
            };
          }

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
                enfants: removeRecursive(block.content?.enfants ?? []),
              },
            };
          }
          return block;
        })

        .filter((block) => {
          if (block.type === "Colonnes" && Array.isArray(block.content)) {
            return block.content.length > 0;
          }
          if (block.type === "C4DR3" && Array.isArray(block.content)) {
            return block.content.length > 0;
          }
          return true;
        });
    };

    setBlocks((prev) => {
      const updated = removeRecursive([...prev]);

      return updated.length === 0
        ? [{ id: `b-${crypto.randomUUID()}`, type: "", content: "" }]
        : updated;
    });
  };

  const handleUpdateBlock = (id: string, newType: string, newContent: any) => {
    const updateRecursive = (list: BlockItem[]): BlockItem[] => {
      return list.map((block) => {
        if (block.id === id)
          return { ...block, type: newType, content: newContent };
        if (block.type === "Colonnes" && Array.isArray(block.content)) {
          return {
            ...block,
            content: (block.content as BlockItem[][]).map((col) =>
              updateRecursive([...col]),
            ),
          };
        }
        if (block.type === "C4DR3" && Array.isArray(block.content)) {
          return {
            ...block,
            content: updateRecursive([...(block.content as BlockItem[])]),
          };
        }
        return block;
      });
    };
    setBlocks((prev) => updateRecursive([...prev]));
  };

  const handleDragEnd = (event: any) => {
    if (event.canceled) return;

    const sourceId = event.operation?.source?.id || event.active?.id;
    const targetId = event.operation?.target?.id || event.over?.id;

    if (!sourceId || !targetId || sourceId === targetId) {
      return;
    }

    const targetElement = document.getElementById(targetId);
    const targetRect = targetElement?.getBoundingClientRect();

    let dropX: number | undefined =
      event.operation?.pointer?.coordinates?.x || event.pointer?.coordinates?.x;
    let dropY: number | undefined =
      event.operation?.pointer?.coordinates?.y || event.pointer?.coordinates?.y;

    if (!dropX || !dropY) {
      const shape = event.operation?.source?.shape;
      if (shape) {
        dropX = shape.current.x + shape.current.width / 2;
        dropY = shape.current.y + shape.current.height / 2;
      }
    }

    if (!dropX || !dropY) {
      const nativeEvent = event.nativeEvent;
      if (nativeEvent) {
        dropX =
          nativeEvent.clientX ||
          (nativeEvent.touches && nativeEvent.touches[0]?.clientX);
        dropY =
          nativeEvent.clientY ||
          (nativeEvent.touches && nativeEvent.touches[0]?.clientY);
      }
    }

    let zoneDrop: "gauche" | "droite" | "haut" | "bas" = "bas";

    if (targetRect && dropX !== undefined && dropY !== undefined) {
      const largeurCible = targetRect.width;
      const hauteurCible = targetRect.height;
      const positionRelativeX = dropX - targetRect.left;
      const positionRelativeY = dropY - targetRect.top;

      const pourcentageX = positionRelativeX / largeurCible;
      const pourcentageY = positionRelativeY / hauteurCible;

      if (pourcentageX < 0.2) {
        zoneDrop = "gauche";
      } else if (pourcentageX > 0.8) {
        zoneDrop = "droite";
      } else {
        zoneDrop = pourcentageY < 0.5 ? "haut" : "bas";
      }
    } else {
      return;
    }

    setBlocks((prevBlocks) => {
      let draggedBlock: BlockItem | null = null;

      const removeBlockRecursive = (list: BlockItem[]): BlockItem[] => {
        return list
          .filter((b) => {
            if (b.id === sourceId) {
              draggedBlock = b;
              return false;
            }
            return true;
          })
          .map((b) => {
            if (b.type === "Colonnes" && Array.isArray(b.content)) {
              return {
                ...b,
                content: (b.content as BlockItem[][])
                  .map((col) => removeBlockRecursive(col))
                  .filter((col) => col.length > 0),
              };
            }
            if (b.type === "C4DR3" && Array.isArray(b.content)) {
              return {
                ...b,
                content: removeBlockRecursive(b.content as BlockItem[]),
              };
            }
            return b;
          });
      };

      const treeWithoutDragged = removeBlockRecursive([...prevBlocks]);

      if (!draggedBlock || !document.getElementById(targetId)) {
        console.warn(
          "Drag annulé : Source ou Cible introuvable dans l'arbre actuel.",
        );
        return prevBlocks;
      }

      const insertIntoList = (list: BlockItem[]): BlockItem[] => {
        const newList: BlockItem[] = [];

        for (const b of list) {
          if (b.id === targetId) {
            if (zoneDrop === "haut") {
              newList.push(draggedBlock!);
              newList.push(b);
            } else if (zoneDrop === "bas") {
              newList.push(b);
              newList.push(draggedBlock!);
            } else {
              newList.push({
                id: `b-${crypto.randomUUID()}`,
                type: "Colonnes",
                content:
                  zoneDrop === "gauche"
                    ? [[draggedBlock!], [b]]
                    : [[b], [draggedBlock!]],
              });
            }
          } else if (b.type === "Colonnes" && Array.isArray(b.content)) {
            const matrix = b.content as BlockItem[][];
            let targetColIndex = -1;

            matrix.forEach((colonne, idx) => {
              if (colonne.some((enfant) => enfant.id === targetId)) {
                targetColIndex = idx;
              }
            });

            if (targetColIndex !== -1) {
              if (zoneDrop === "gauche" || zoneDrop === "droite") {
                const newMatrix = [...matrix];
                const insertIdx =
                  zoneDrop === "gauche" ? targetColIndex : targetColIndex + 1;
                newMatrix.splice(insertIdx, 0, [draggedBlock!]);
                newList.push({ ...b, content: newMatrix });
              } else {
                const newMatrix = matrix.map((colonne, idx) => {
                  if (idx === targetColIndex) {
                    return insertIntoList(colonne);
                  }
                  return colonne;
                });
                newList.push({ ...b, content: newMatrix });
              }
            } else {
              newList.push({
                ...b,
                content: matrix.map((col) => insertIntoList(col)),
              });
            }
          } else if (b.type === "C4DR3" && Array.isArray(b.content)) {
            newList.push({
              ...b,
              content: insertIntoList(b.content as BlockItem[]),
            });
          } else {
            newList.push(b);
          }
        }
        return newList;
      };

      return insertIntoList(treeWithoutDragged);
    });
  };

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <Page
        banniere="/Logos/Dotted_full.svg"
        icon="/Logos/Dotted_mini.svg"
        titre={titlre}
        titreState={titlreState}
        Blocks={blocks}
        idAFocus={idAFocus}
        setIdAFocus={setIdAFocus}
        addBlock={handleAddBlockAfter}
        onDeleteBlock={handleDeleteBlock}
        onUpdate={handleUpdateBlock}
      />
    </DragDropProvider>
  );
}

export default Wrapper;
