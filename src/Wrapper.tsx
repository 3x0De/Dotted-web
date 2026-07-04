import Block from "./Block";
import {
  useReducer,
  type ChangeEvent,
  type KeyboardEvent,
  useRef,
} from "react";
import { STATE, type TYPE } from "./types/menu";
import type {
  EditorState,
  EditorAction,
  ColumnBlock,
  TextBlock,
} from "./types/Wrapper";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";

function updateBlock(
  state: EditorState,
  targetId: number,
  updater: (b: EditorState) => EditorState,
): EditorState {
  if (state.id === targetId) return updater(state);
  if (state.type === STATE.col || state.type === STATE.row) {
    return {
      ...state,
      content: (state.content as EditorState[]).map((child) =>
        updateBlock(child, targetId, updater),
      ),
    } as EditorState;
  }

  return state;
}

export function findSiblings(
  state: EditorState,
  targetId: number,
): EditorState[] | null {
  if (state.type !== STATE.col && state.type !== STATE.row) return null;
  const list = state.content as EditorState[];
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
  if (state.type !== STATE.col && state.type !== STATE.row) return state;
  const list = state.content as EditorState[];
  if (list.some((b) => b.id === targetId)) {
    return { ...state, content: updater(list) } as EditorState;
  }
  return {
    ...state,
    content: list.map((child) => updateParentList(child, targetId, updater)),
  } as EditorState;
}

function collapseEmpty(state: EditorState): EditorState {
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
): {
  tree: EditorState;
  removed: EditorState | null;
} {
  if (state.type !== STATE.col && state.type !== STATE.row) {
    return {
      tree: state,
      removed: null,
    };
  }

  let removed: EditorState | null = null;

  const newChildren: EditorState[] = [];

  for (const child of state.content as EditorState[]) {
    if (child.id === targetId) {
      removed = child;
      continue;
    }

    const result = removeBlock(child, targetId);

    if (result.removed) {
      removed = result.removed;
    }

    newChildren.push(result.tree);
  }

  return {
    tree: {
      ...state,
      content: newChildren,
    },
    removed,
  } as {
    tree: EditorState;
    removed: EditorState | null;
  };
}

function insertBlock(
  state: EditorState,
  parentId: number,
  block: EditorState,
): EditorState {
  if (
    state.id === parentId &&
    (state.type === STATE.col || state.type === STATE.row)
  ) {
    return {
      ...state,
      content: [...(state.content as EditorState[]), block],
    } as EditorState;
  }

  if (state.type === STATE.col || state.type === STATE.row) {
    return {
      ...state,
      content: (state.content as EditorState[]).map((child) =>
        insertBlock(child, parentId, block),
      ),
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

function reducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
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
            content: [{ Id: Math.random(), contenu: "" }],
          };
        }

        return { id: Math.random(), type: action.payload, content: "" };
      });

    case "SET_CONTENT":
      if (state.type === STATE.col || state.type === STATE.row) return state;
      return { ...state, content: action.payload } as TextBlock;

    case "CLEAR_TYPE":
      return updateBlock(state, action.targetId, (block) => ({
        ...block,
        type: null,
        content: "",
      }));

    case "HANDLE_CHANGE":
      return updateBlock(state, action.targetId, (block): EditorState => {
        if (block.type === STATE.col || block.type === STATE.row) return block;
        if (block.type === STATE.ul || block.type === STATE.ol)
          return {
            ...block,
            content: block.content.map((el) =>
              el.Id === action.itemId ? { ...el, contenu: action.payload } : el,
            ),
          };
        if (block.type === STATE.todo)
          return {
            ...block,
            content: block.content.map((el) =>
              el.Id === action.itemId ? { ...el, contenu: action.payload } : el,
            ),
          };

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
        } else if (/^.\s/.test(val))
          return {
            id: block.id,
            type: STATE.ul,
            content: [{ Id: Math.random(), contenu: "" }],
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

    default:
      return state;
  }
}

function Wrapper({ init }: { init: EditorState }) {
  const [state, dispatch] = useReducer(reducer, init);

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
          settype={({
            newType,
            targetId,
          }: {
            newType: TYPE;
            targetId: number;
          }) => dispatch({ type: "SET_TYPE", payload: newType, targetId })}
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
