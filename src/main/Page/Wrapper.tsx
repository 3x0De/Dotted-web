import {
  type ChangeEvent,
  type KeyboardEvent,
  useEffect,
  useReducer,
  useRef,
} from "react";

import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";

import type {
  EditorState,
  EditorAction,
  ColumnBlock,
  TextBlock,
} from "../../types/MainTypes/Wrapper";
import { STATE, type TYPE } from "../../types/MainTypes/BlockTypes/menu";

import usePile from "../../hooks/usePile";

import Block from "./Block/Block";
import type { InputNodeType } from "../../types/MainTypes/BlockTypes/Graphe";
import type { Edge } from "@xyflow/react";
import type { TableauType } from "../../types/MainTypes/BlockTypes/Tableau";

function updateBlock(
  state: EditorState,
  targetId: number,
  updater: (b: EditorState) => EditorState,
): EditorState {
  if (state.id === targetId) return updater(state);

  if (
    state.type === STATE.col ||
    state.type === STATE.row ||
    state.type === STATE.cdr
  ) {
    return {
      ...state,
      content: (state.content as EditorState[]).map((child) =>
        updateBlock(child, targetId, updater),
      ),
    } as EditorState;
  }

  if (state.type === STATE.menu) {
    const menuContent = state.content as {
      nom: string;
      content: EditorState[];
    };
    return {
      ...state,
      content: {
        ...menuContent,
        content: menuContent.content.map((child) =>
          updateBlock(child, targetId, updater),
        ),
      },
    } as EditorState;
  }

  return state;
}

export function findSiblings(
  state: EditorState,
  targetId: number,
): EditorState[] | null {
  let list: EditorState[] | null = null;

  if (
    state.type === STATE.col ||
    state.type === STATE.row ||
    state.type === STATE.cdr
  ) {
    list = state.content as EditorState[];
  } else if (state.type === STATE.menu) {
    list = (state.content as { nom: string; content: EditorState[] }).content;
  } else {
    return null;
  }

  if (list.some((b) => b.id === targetId)) return list;
  for (const child of list) {
    const found = findSiblings(child, targetId);
    if (found) return found;
  }
  return null;
}

function updateParentList(
  state: EditorState,
  targetId: number,
  updater: (list: EditorState[]) => EditorState[],
): EditorState {
  if (
    state.type === STATE.col ||
    state.type === STATE.row ||
    state.type === STATE.cdr
  ) {
    const list = state.content as EditorState[];
    if (list.some((b) => b.id === targetId)) {
      return { ...state, content: updater(list) } as EditorState;
    }
    return {
      ...state,
      content: list.map((child) => updateParentList(child, targetId, updater)),
    } as EditorState;
  }

  if (state.type === STATE.menu) {
    const menuContent = state.content as {
      nom: string;
      content: EditorState[];
    };
    const list = menuContent.content;
    if (list.some((b) => b.id === targetId)) {
      return {
        ...state,
        content: { ...menuContent, content: updater(list) },
      } as EditorState;
    }
    return {
      ...state,
      content: {
        ...menuContent,
        content: list.map((child) =>
          updateParentList(child, targetId, updater),
        ),
      },
    } as EditorState;
  }

  return state;
}

function collapseEmpty(state: EditorState): EditorState {
  if (state.type === STATE.menu) {
    const menuContent = state.content as {
      nom: string;
      content: EditorState[];
    };
    return {
      ...state,
      content: {
        ...menuContent,
        content: menuContent.content.map(collapseEmpty),
      },
    } as EditorState;
  }

  if (state.type !== STATE.col && state.type !== STATE.row) return state;

  const children = (state.content as EditorState[]).map(collapseEmpty);

  if (state.type === STATE.row) {
    const alive = children.filter(
      (b) => b.type === STATE.col && (b.content as EditorState[]).length > 0,
    );

    if (alive.length === 0) {
      return { id: state.id, type: null, content: "" };
    }
    return { ...state, content: alive } as EditorState;
  }

  if (children.length === 0 && state.id === 0) {
    return {
      ...state,
      content: [{ id: Math.random(), type: null, content: "" }],
    } as EditorState;
  }

  return { ...state, content: children } as EditorState;
}

function removeBlock(
  state: EditorState,
  targetId: number,
): { tree: EditorState; removed: EditorState | null } {
  const isRowCol = state.type === STATE.col || state.type === STATE.row;
  const isMenu = state.type === STATE.menu;

  if (!isRowCol && !isMenu) {
    return { tree: state, removed: null };
  }

  const menuContent = isMenu
    ? (state.content as { nom: string; content: EditorState[] })
    : null;
  const children = isMenu
    ? menuContent!.content
    : (state.content as EditorState[]);

  let removed: EditorState | null = null;
  const newChildren: EditorState[] = [];

  for (const child of children) {
    if (child.id === targetId) {
      removed = child;
      continue;
    }
    const result = removeBlock(child, targetId);
    if (result.removed) removed = result.removed;
    newChildren.push(result.tree);
  }

  const tree = isMenu
    ? { ...state, content: { ...menuContent!, content: newChildren } }
    : { ...state, content: newChildren };

  return { tree: tree as EditorState, removed };
}

function insertBlock(
  state: EditorState,
  parentId: number,
  block: EditorState,
): EditorState {
  if (state.id === parentId) {
    if (state.type === STATE.col || state.type === STATE.row) {
      return {
        ...state,
        content: [...(state.content as EditorState[]), block],
      } as EditorState;
    }
    if (state.type === STATE.menu) {
      const menuContent = state.content as {
        nom: string;
        content: EditorState[];
      };
      return {
        ...state,
        content: { ...menuContent, content: [...menuContent.content, block] },
      } as EditorState;
    }
  }

  if (state.type === STATE.col || state.type === STATE.row) {
    return {
      ...state,
      content: (state.content as EditorState[]).map((child) =>
        insertBlock(child, parentId, block),
      ),
    } as EditorState;
  }

  if (state.type === STATE.menu) {
    const menuContent = state.content as {
      nom: string;
      content: EditorState[];
    };
    return {
      ...state,
      content: {
        ...menuContent,
        content: menuContent.content.map((child) =>
          insertBlock(child, parentId, block),
        ),
      },
    } as EditorState;
  }

  return state;
}

function findNode(state: EditorState, targetId: number): EditorState | null {
  if (state.id === targetId) return state;

  if (state.type === STATE.col || state.type === STATE.row) {
    for (const child of state.content as EditorState[]) {
      const found = findNode(child, targetId);
      if (found) return found;
    }
  }

  if (state.type === STATE.menu) {
    const list = (state.content as { nom: string; content: EditorState[] })
      .content;
    for (const child of list) {
      const found = findNode(child, targetId);
      if (found) return found;
    }
  }

  return null;
}

function wrapInColumns(
  state: EditorState,
  targetId: number,
  moved: EditorState,
): EditorState {
  return updateBlock(state, targetId, (target) => ({
    id: Math.random(),
    type: STATE.row,
    content: [
      { id: Math.random(), type: STATE.col, content: [target] },
      { id: Math.random(), type: STATE.col, content: [moved] },
    ],
  }));
}

async function createNewDocument() {
  const requete = await fetch(`${import.meta.env.VITE_API_URL}/Page`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      visibilite: true,
      parent: window.location.pathname.slice(6),
    }),
  });

  const data = await requete.json();

  return data.data;
}

function reducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case "INIT":
      return action.payload;

    case "SET_TYPE":
      return updateBlock(state, action.targetId, (block): EditorState => {
        if (action.payload === STATE.col) {
          return {
            id: block.id,
            type: STATE.col,
            content: [] as EditorState[],
          };
        }
        if (action.payload === STATE.row) {
          return {
            id: block.id,
            type: STATE.row,
            content: [] as ColumnBlock[],
          };
        }

        if (action.payload === STATE.ul || action.payload === STATE.ol) {
          return {
            id: block.id,
            type: action.payload,
            content: [{ Id: Math.random(), contenu: "" }],
          };
        }
        if (action.payload === STATE.todo) {
          return {
            id: block.id,
            type: action.payload,
            content: [{ Id: Math.random(), contenu: "", state: false }],
          };
        }
        if (action.payload == STATE.menu) {
          return {
            id: block.id,
            type: action.payload,
            content: {
              nom: "",
              content: [{ id: Math.random(), type: null, content: "" }],
            },
          };
        }
        if (action.payload == STATE.cdr) {
          return {
            id: block.id,
            type: action.payload,
            content: [{ id: Math.random(), type: null, content: "" }],
          };
        }
        if (action.payload == STATE.doc) {
          return {
            id: block.id,
            type: action.payload,
            content: "",
          };
        }
        if (action.payload == STATE.img) {
          return {
            id: block.id,
            type: action.payload,
            content: "",
          };
        }
        if (action.payload == STATE.tbl) {
          return {
            id: block.id,
            type: action.payload,
            content: [
              ["", ""],
              ["", ""],
            ],
          };
        }

        if (action.payload == STATE.grph) {
          return {
            id: block.id,
            type: action.payload,
            content: { Node: [], Edge: [] },
          };
        }

        if (action.payload == STATE.tabl) {
          return {
            id: block.id,
            type: action.payload,
            content: { entete: [], Pages: [""] },
          };
        }

        return { id: Math.random(), type: action.payload, content: "" };
      });

    case "SET_CONTENT":
      return updateBlock(state, action.targetId, (block): EditorState => {
        return { ...block, content: action.payload } as EditorState;
      });

    case "CLEAR_TYPE":
      return updateBlock(state, action.targetId, (block) => ({
        ...block,
        type: null,
        content: "",
      }));

    case "HANDLE_CHANGE":
      return updateBlock(state, action.targetId, (block): EditorState => {
        if (
          block.type === STATE.col ||
          block.type === STATE.row ||
          block.type === STATE.cdr ||
          block.type === STATE.doc
        )
          return block;

        if (block.type === STATE.menu) {
          return {
            ...block,
            content: {
              ...block.content,
              nom: action.payload,
            },
          } as EditorState;
        }

        if (block.type === STATE.ul || block.type === STATE.ol)
          return {
            ...block,
            content: (block.content as any[]).map((el) =>
              el.Id === action.itemId ? { ...el, contenu: action.payload } : el,
            ),
          };

        if (block.type === STATE.todo) {
          return {
            ...block,
            content: (block.content as any[]).map((el) =>
              el.Id === action.itemId
                ? {
                    ...el,
                    contenu: action.payload,
                    state: action.isCheckbox ? action.itemState : el.state,
                  }
                : el,
            ),
          };
        }

        if (block.type === STATE.grph) {
          return {
            ...block,
            content: action.payload as unknown as {
              Node: InputNodeType[];
              Edge: Edge[];
            },
          } as EditorState;
        }

        if (block.type === STATE.tabl) {
          return {
            ...block,
            content: action.payload as unknown as TableauType,
          };
        }

        const val = action.payload;
        if (val === "" && block.content !== "")
          return { ...block, content: "" } as TextBlock;

        if (/^#{1,6}\s/.test(val)) {
          if (/^#\s/.test(val))
            return { id: block.id, type: STATE.h1, content: "" };
          if (/^#{2}\s/.test(val))
            return { id: block.id, type: STATE.h2, content: "" };
          if (/^#{3}\s/.test(val))
            return { id: block.id, type: STATE.h3, content: "" };
          if (/^#{4}\s/.test(val))
            return { id: block.id, type: STATE.h4, content: "" };
          if (/^#{5}\s/.test(val))
            return { id: block.id, type: STATE.h5, content: "" };
          if (/^#{6}\s/.test(val))
            return { id: block.id, type: STATE.h6, content: "" };
        }
        if (/^[.\+\-*]\s/.test(val))
          return {
            id: block.id,
            type: STATE.ul,
            content: [{ Id: Math.random(), contenu: "" }],
          };
        if (/^([0-9]+\.|\$\.?)\s/.test(val))
          return {
            id: block.id,
            type: STATE.ol,
            content: [{ Id: Math.random(), contenu: "" }],
          };
        if (/^\[\]\s/.test(val))
          return {
            id: block.id,
            type: STATE.todo,
            content: [{ Id: Math.random(), contenu: "", state: false }],
          };
        if (/^\>\s/.test(val))
          return {
            id: block.id,
            type: STATE.menu,
            content: {
              nom: "",
              content: [{ id: Math.random(), type: null, content: "" }],
            },
          };
        if (/^\{\}\s/.test(val))
          return {
            id: block.id,
            type: STATE.cdr,
            content: [{ id: block.id, type: null, content: "" }],
          };
        if (/^(\||"|')\s/.test(val))
          return {
            id: block.id,
            type: STATE.cite,
            content: "",
          };
        if (/^\/\/\s/.test(val))
          return {
            id: block.id,
            type: STATE.link,
            content: "",
          };
        else if (/^(_{1,3}|-{1,3})\s/.test(val))
          return {
            id: block.id,
            type: STATE.sprt,
            content: undefined,
          };

        return { ...block, content: val } as TextBlock;
      });

    case "ADD_ITEM": {
      const list = findSiblings(state, action.targetId);
      if (!list) return state;
      return updateParentList(state, action.targetId, (siblings) => {
        const idx = siblings.findIndex((b) => b.id === action.targetId);
        const insertAt = idx === -1 ? siblings.length : idx + 1;
        return [
          ...siblings.slice(0, insertAt),
          action.payload,
          ...siblings.slice(insertAt),
        ];
      });
    }

    case "ADD_LIST_ITEM":
      return updateBlock(state, action.blockId, (block): EditorState => {
        if (
          block.type !== STATE.ul &&
          block.type !== STATE.ol &&
          block.type !== STATE.todo
        )
          return block;

        const items = block.content as { Id: number; contenu: string }[];
        const idx = items.findIndex((el) => el.Id === action.afterId);
        const insertAt = idx === -1 ? items.length : idx + 1;

        return {
          ...block,
          content: [
            ...items.slice(0, insertAt),
            { Id: Math.random(), contenu: "" },
            ...items.slice(insertAt),
          ],
        } as EditorState;
      });

    case "REMOVE_ITEM": {
      const afterRemoval = updateParentList(state, action.payload, (siblings) =>
        siblings.filter((b) => b.id !== action.payload),
      );
      return collapseEmpty(afterRemoval);
    }

    case "REMOVE_LIST_ITEM":
      return updateBlock(state, action.blockId, (block): EditorState => {
        if (
          block.type !== STATE.ul &&
          block.type !== STATE.ol &&
          block.type !== STATE.todo
        )
          return block;

        const items = block.content as { Id: number; contenu: string }[];
        const updatedItems = items.filter((el) => el.Id !== action.itemId);

        return {
          ...block,
          content: updatedItems,
        } as EditorState;
      });

    case "CLEAR_ITEMS":
      if (state.type !== STATE.col) return state;
      return { ...state, content: [] };

    case "MOVE_BLOCK": {
      if (action.sourceId === action.targetId) return state;

      const { tree, removed } = removeBlock(state, action.sourceId);
      if (!removed) return state;

      const targetNode = findNode(tree, action.targetId);
      if (!targetNode) return state;

      let result: EditorState;

      if (targetNode.type === STATE.row) {
        const newCol: EditorState = {
          id: Math.random(),
          type: STATE.col,
          content: [removed],
        };
        result = insertBlock(tree, action.targetId, newCol);
      } else if (targetNode.type === STATE.col) {
        result = insertBlock(tree, action.targetId, removed);
      } else {
        result = wrapInColumns(tree, action.targetId, removed);
      }

      return collapseEmpty(result);
    }

    case "UNDO":
      return action.payload ?? state;

    default:
      return state;
  }
}

async function getInit() {
  const request = await fetch(
    `${import.meta.env.VITE_API_URL}${window.location.pathname}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const data = await request.json();

  return data.contenu;
}

async function save(nouveau: EditorState) {
  await fetch(`${import.meta.env.VITE_API_URL}${window.location.pathname}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ type: "contenu", nouveau: nouveau }),
  });
}

function Wrapper() {
  const [state, dispatch] = useReducer(reducer, {
    id: 0,
    type: STATE.col,
    content: [{ id: Math.random(), type: null, content: "" }],
  });

  const hasLoaded = useRef(false);

  useEffect(() => {
    getInit().then((data: EditorState) => {
      dispatch({ type: "INIT", payload: data });
      hasLoaded.current = true;
    });
  }, []);

  useEffect(() => {
    if (!hasLoaded.current) return;
    save(state);
  }, [state]);

  const { empile: actionEmpile, depile: actionDepile } = usePile<EditorState>();
  const {
    empile: redoEmpile,
    depile: redoDepile,
    vide: redoVide,
  } = usePile<EditorState>();

  const lastStateRef = useRef(state);
  const isUndoingRef = useRef(false);

  useEffect(() => {
    if (isUndoingRef.current) {
      isUndoingRef.current = false;
      lastStateRef.current = state;
      return;
    }

    if (lastStateRef.current !== state) {
      actionEmpile(lastStateRef.current);
      redoVide();
      lastStateRef.current = state;
    }
  }, [state, actionEmpile, redoVide]);

  const depileRef = useRef(actionDepile);
  useEffect(() => {
    depileRef.current = actionDepile;
  });

  useEffect(() => {
    const handleUndo = (e: globalThis.KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();

        const previousState = depileRef.current();
        if (previousState) {
          redoEmpile(state);

          isUndoingRef.current = true;
          dispatch({ type: "UNDO", payload: previousState });
        }
      }
    };

    const handleRedo = (e: globalThis.KeyboardEvent) => {
      if (
        (e.ctrlKey && e.key.toLowerCase() === "y") ||
        (e.ctrlKey && e.shiftKey && e.key.toLocaleLowerCase() === "z")
      ) {
        e.preventDefault();

        const nextState = redoDepile();
        if (nextState) {
          actionEmpile(state);

          isUndoingRef.current = true;
          dispatch({ type: "UNDO", payload: nextState });
        }
      }
    };

    window.addEventListener("keydown", handleUndo);
    window.addEventListener("keydown", handleRedo);
    return () => {
      window.removeEventListener("keydown", handleUndo);
      window.removeEventListener("keydown", handleRedo);
    };
  }, [state, actionEmpile, redoEmpile, redoDepile]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    targetId: number,
    itemId?: number,
  ) => {
    dispatch({
      type: "HANDLE_CHANGE",
      payload: e.target.value,
      targetId,
      itemId,
      itemState: e.target.checked,
      isCheckbox: e.target.type === "checkbox",
    });
  };

  const inputRefs = useRef<Map<number, HTMLInputElement>>(new Map());

  const registerRef = (id: number, el: HTMLInputElement | null) => {
    if (el) inputRefs.current.set(id, el);
    else inputRefs.current.delete(id);
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    targetId: number,
  ) => {
    if (e.key === "Backspace") {
      const blocks = findSiblings(state, targetId);
      if (!blocks) return;
      const target = blocks.find((b) => b.id === targetId);

      if (target && target.content === "") {
        const currentIdx = blocks.findIndex((b) => b.id === targetId);
        const prevBlock = currentIdx > 0 ? blocks[currentIdx - 1] : null;

        if (target.type == null) {
          dispatch({ type: "REMOVE_ITEM", payload: targetId });
          if (prevBlock !== null) {
            setTimeout(() => inputRefs.current.get(prevBlock.id)?.focus(), 0);
          }
        } else {
          dispatch({ type: "CLEAR_TYPE", targetId });
        }
      }
    }

    if (e.key === "Enter") {
      dispatch({
        type: "ADD_ITEM",
        targetId,
        payload: { id: Math.random(), type: null, content: "" },
      });
    }

    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      const blocks = findSiblings(state, targetId);
      if (!blocks) return;
      const currentIdx = blocks.findIndex((b) => b.id === targetId);
      if (currentIdx === -1) return;

      const targetIdx = e.key === "ArrowUp" ? currentIdx - 1 : currentIdx + 1;
      const neighbor = blocks[targetIdx];

      if (neighbor) {
        e.preventDefault();
        inputRefs.current.get(neighbor.id)?.focus();
      }
    }
  };

  return (
    <div id="Wrapper">
      <DragDropProvider
        onDragEnd={(e: DragEndEvent) => {
          const sourceId = e.operation.source?.data.blockId;
          const targetId = e.operation.target?.data.blockId;

          if (!targetId) return;

          dispatch({
            type: "MOVE_BLOCK",
            sourceId,
            targetId,
          });
        }}
      >
        <Block
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          settype={async ({
            newType,
            targetId,
          }: {
            newType: TYPE;
            targetId: number;
          }) => {
            dispatch({ type: "SET_TYPE", payload: newType, targetId });
            if (newType === STATE.doc) {
              try {
                const result = await createNewDocument();

                dispatch({ type: "SET_CONTENT", targetId, payload: result });
              } catch (error) {
                console.error("Échec de la création du document", error);
              }
            }
          }}
          onAddItem={(targetId: number) =>
            dispatch({
              type: "ADD_ITEM",
              targetId,
              payload: { id: Math.random(), type: null, content: "" },
            })
          }
          onRemoveItem={(blockId: number) =>
            dispatch({ type: "REMOVE_ITEM", payload: blockId })
          }
          registerRef={registerRef}
          onAddListItem={(blockId: number, afterId: number) => {
            dispatch({ type: "ADD_LIST_ITEM", blockId, afterId });
          }}
          onRemoveListItem={(blockId: number, itemId: number) => {
            dispatch({ type: "REMOVE_LIST_ITEM", blockId, itemId });
          }}
        >
          {state}
        </Block>
      </DragDropProvider>
    </div>
  );
}

export default Wrapper;
