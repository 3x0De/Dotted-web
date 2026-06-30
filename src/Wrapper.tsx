import Block from "./Block";
import {
  useReducer,
  type ChangeEvent,
  type KeyboardEvent,
  useRef,
} from "react";
import { STATE, type TYPE } from "./types/menu";
import type { EditorState, EditorAction, ColumnBlock } from "./types/Wrapper";

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

function findSiblings(
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

function reducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case "SET_TYPE":
      return updateBlock(state, action.targetId, (block) => {
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
        return { id: Math.random(), type: action.payload, content: "" };
      });

    case "SET_CONTENT":
      if (state.type === STATE.col || state.type === STATE.row) return state;
      return { ...state, content: action.payload };

    case "CLEAR_TYPE":
      return updateBlock(state, action.targetId, (block) => ({
        ...block,
        type: null,
        content: "",
      }));

    case "HANDLE_CHANGE":
      return updateBlock(state, action.targetId, (block) => {
        if (block.type === STATE.col || block.type === STATE.row) return block;

        const val = action.payload;
        if (val === "" && block.content !== "")
          return { ...block, content: "" };

        if (/^#{1,6}\s/.test(val)) {
          if (/^#\s/.test(val))
            return { id: Math.random(), type: STATE.h1, content: "" };
          if (/^#{2}\s/.test(val))
            return { id: Math.random(), type: STATE.h2, content: "" };
          if (/^#{3}\s/.test(val))
            return { id: Math.random(), type: STATE.h3, content: "" };
          if (/^#{4}\s/.test(val))
            return { id: Math.random(), type: STATE.h4, content: "" };
          if (/^#{5}\s/.test(val))
            return { id: Math.random(), type: STATE.h5, content: "" };
          if (/^#{6}\s/.test(val))
            return { id: Math.random(), type: STATE.h6, content: "" };
        }
        return { ...block, content: val };
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

    case "REMOVE_ITEM": {
      const afterRemoval = updateParentList(state, action.payload, (siblings) =>
        siblings.filter((b) => b.id !== action.payload),
      );
      return collapseEmpty(afterRemoval);
    }

    case "CLEAR_ITEMS":
      if (state.type !== STATE.col) return state;
      return { ...state, content: [] };

    default:
      return state;
  }
}

function Wrapper() {
  const [state, dispatch] = useReducer(reducer, {
    id: 0,
    type: STATE.col,
    content: [
      { id: Math.random(), type: STATE.h1, content: "1" },
      { id: Math.random(), type: STATE.h1, content: "2" },
      {
        id: Math.random(),
        type: STATE.row,
        content: [
          {
            id: Math.random(),
            type: STATE.col,
            content: [
              { id: Math.random(), type: STATE.h1, content: "1" },
              { id: Math.random(), type: STATE.h1, content: "2" },
            ],
          },
          {
            id: Math.random(),
            type: STATE.col,
            content: [{ id: Math.random(), type: STATE.h1, content: "1" }],
          },
        ],
      },
    ],
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>, targetId: number) => {
    dispatch({ type: "HANDLE_CHANGE", payload: e.target.value, targetId });
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
    <Block
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      settype={({ newType, targetId }: { newType: TYPE; targetId: number }) =>
        dispatch({ type: "SET_TYPE", payload: newType, targetId })
      }
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
    >
      {state}
    </Block>
  );
}

export default Wrapper;
