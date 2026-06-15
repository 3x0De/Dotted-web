import Page from "./Page";
import { useEffect, useRef, useState, useCallback } from "react";
import type { BlockItem } from "./Types";
import { DragDropProvider } from "@dnd-kit/react";

function Wrapper() {
  const [titlre, titlreState] = useState<string>("");
  const [blocks, setBlocks] = useState<BlockItem[]>([]);
  const [idAFocus, setIdAFocus] = useState<string | null>(null);
  const isInitialMount = useRef(true);
  const historyRef = useRef<BlockItem[][]>([]);
  const pile2 = useRef<BlockItem[][]>([]);

  const pushHistory = (previousBlocks: BlockItem[]) => {
    pile2.current = [];
    historyRef.current = [
      ...historyRef.current,
      structuredClone(previousBlocks),
    ];
  };

  const undo = useCallback(() => {
    if (historyRef.current.length === 0) return;

    const previous = historyRef.current[historyRef.current.length - 1];

    pile2.current.push(structuredClone(blocks));

    historyRef.current = historyRef.current.slice(0, -1);
    setBlocks(previous);
  }, [blocks]);

  const redo = useCallback(() => {
    if (pile2.current.length === 0) return;

    const next = pile2.current[pile2.current.length - 1];

    historyRef.current.push(structuredClone(blocks));

    pile2.current = pile2.current.slice(0, -1);
    setBlocks(next);
  }, [blocks]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        e.key.toLowerCase() === "z" &&
        !e.shiftKey
      ) {
        e.preventDefault();
        undo();
      } else if (
        (e.ctrlKey || e.metaKey) &&
        (e.key.toLowerCase() === "y" ||
          (e.shiftKey && e.key.toLowerCase() === "z"))
      ) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  async function fetchTitre() {
    const response = await fetch(
      "http://localhost:8000/titre" + window.location.pathname,
    );
    const data = await response.json();
    titlreState(data);
  }

  async function fetchCont() {
    const response = await fetch(
      "http://localhost:8000/Cont" + window.location.pathname,
    );
    const data = await response.json();
    setBlocks(data);
  }

  useEffect(() => {
    fetchTitre();
    fetchCont();
  }, [window.location.pathname]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (blocks.length === 0) return;

    const saveBlocks = async () => {
      try {
        await fetch(
          "http://localhost:8000/Modif/Cont" + window.location.pathname,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ page: blocks }),
          },
        );
      } catch (error) {
        console.error("Erreur de sauvegarde des blocs :", error);
      }
    };
    saveBlocks();
  }, [blocks]);

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
              enfants: insertRecursive(block.content.enfants ?? []),
            },
          };
        }
      }
      return newList;
    };

    setBlocks((prev) => {
      pushHistory(prev);
      return insertRecursive([...prev]);
    });
    setIdAFocus(newId);
  };

  const handleDeleteBlock = (blockToDelete: BlockItem) => {
    if (!blockToDelete) return;

    const removeRecursive = (list: BlockItem[]): BlockItem[] => {
      return list
        .filter((block) => block.id !== blockToDelete.id)
        .map((block) => {
          if (block.type === "Colonnes" && Array.isArray(block.content)) {
            return {
              ...block,
              content: (block.content as BlockItem[][])
                .map((col) => removeRecursive([...col]))
                .filter((col) => col.length > 0),
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
          if (
            (block.type === "Colonnes" || block.type === "C4DR3") &&
            Array.isArray(block.content)
          )
            return block.content.length > 0;
          return true;
        });
    };

    setBlocks((prev) => {
      pushHistory(prev);
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
              enfants: updateRecursive(block.content.enfants ?? []),
            },
          };
        }
        return block;
      });
    };
    setBlocks((prev) => {
      pushHistory(prev);
      return updateRecursive([...prev]);
    });
  };

  const handleDragEnd = (event: any) => {
    if (event.canceled) return;
    const sourceId = event.operation?.source?.id || event.active?.id;
    const targetId = event.operation?.target?.id || event.over?.id;
    if (!sourceId || !targetId || sourceId === targetId) return;

    const targetElement = document.getElementById(targetId);
    const targetRect = targetElement?.getBoundingClientRect();

    let dropX =
      event.operation?.pointer?.coordinates?.x || event.pointer?.coordinates?.x;
    let dropY =
      event.operation?.pointer?.coordinates?.y || event.pointer?.coordinates?.y;

    if (!dropX || !dropY) {
      const shape = event.operation?.source?.shape;
      if (shape) {
        dropX = shape.current.x + shape.current.width / 2;
        dropY = shape.current.y + shape.current.height / 2;
      } else {
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
    }

    let zoneDrop: "gauche" | "droite" | "haut" | "bas" = "bas";
    if (targetRect && dropX !== undefined && dropY !== undefined) {
      const pX = (dropX - targetRect.left) / targetRect.width;
      const pY = (dropY - targetRect.top) / targetRect.height;
      if (pX < 0.2) zoneDrop = "gauche";
      else if (pX > 0.8) zoneDrop = "droite";
      else zoneDrop = pY < 0.5 ? "haut" : "bas";
    } else return;

    setBlocks((prevBlocks) => {
      pushHistory(prevBlocks);
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
            if (b.type === "Colonnes" && Array.isArray(b.content))
              return {
                ...b,
                content: (b.content as BlockItem[][])
                  .map((col) => removeBlockRecursive(col))
                  .filter((col) => col.length > 0),
              };
            if (b.type === "C4DR3" && Array.isArray(b.content))
              return {
                ...b,
                content: removeBlockRecursive(b.content as BlockItem[]),
              };
            if (
              b.type === "Menu" &&
              b.content &&
              typeof b.content === "object" &&
              "enfants" in b.content
            )
              return {
                ...b,
                content: {
                  ...b.content,
                  enfants: removeBlockRecursive(b.content?.enfants ?? []),
                },
              };
            return b;
          });
      };
      const treeWithoutDragged = removeBlockRecursive([...prevBlocks]);
      if (!draggedBlock || !document.getElementById(targetId))
        return prevBlocks;

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
            matrix.forEach((col, idx) => {
              if (col.some((enfant) => enfant.id === targetId))
                targetColIndex = idx;
            });
            if (targetColIndex !== -1) {
              if (zoneDrop === "gauche" || zoneDrop === "droite") {
                const newM = [...matrix];
                newM.splice(
                  zoneDrop === "gauche" ? targetColIndex : targetColIndex + 1,
                  0,
                  [draggedBlock!],
                );
                newList.push({ ...b, content: newM });
              } else {
                newList.push({
                  ...b,
                  content: matrix.map((col, idx) =>
                    idx === targetColIndex ? insertIntoList(col) : col,
                  ),
                });
              }
            } else
              newList.push({
                ...b,
                content: matrix.map((col) => insertIntoList(col)),
              });
          } else if (b.type === "C4DR3" && Array.isArray(b.content)) {
            newList.push({
              ...b,
              content: insertIntoList(b.content as BlockItem[]),
            });
          } else if (
            b.type === "Menu" &&
            b.content &&
            typeof b.content === "object" &&
            "enfants" in b.content
          ) {
            newList.push({
              ...b,
              content: {
                ...b.content,
                enfants: insertIntoList(b.content?.enfants ?? []),
              },
            });
          } else newList.push(b);
        }
        return newList;
      };
      return insertIntoList(treeWithoutDragged);
    });
  };

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <Page
        banniere={
          "http://localhost:8000/Banniere/Page" + window.location.pathname
        }
        icon={"http://localhost:8000/Icon/Page" + window.location.pathname}
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
