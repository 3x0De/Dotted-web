import Block from "./Block";
import { useReducer, type ChangeEvent, type KeyboardEvent } from "react";
import { STATE, type TYPE } from "./types/menu";
import { type EditorState, type EditorAction } from "./types/Wrapper";

function updateBlock(
  state: EditorState,
  targetId: number,
  updater: (b: EditorState) => EditorState,
): EditorState {
  if (state.id === targetId) return updater(state);
  if (state.type === STATE.col) {
    return {
      ...state,
      content: (state.content as EditorState[]).map((child) =>
        updateBlock(child, targetId, updater),
      ),
    };
  }
  return state;
}

function reducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case "SET_TYPE":
      return updateBlock(state, action.targetId, (block) => {
        if (action.payload === STATE.col) {
          return { ...block, type: STATE.col, content: [] };
        }
        return {
          ...block,
          id: Math.random(),
          type: action.payload,
          content: "",
        };
      });

    case "SET_CONTENT":
      if (state.type === STATE.col) return state;
      return { ...state, content: action.payload };

    case "CLEAR_TYPE":
      return updateBlock(state, action.targetId, (block) => ({
        ...block,
        type: null,
        content: "",
      }));

    case "HANDLE_CHANGE":
      return updateBlock(state, action.targetId, (block) => {
        if (block.type === STATE.col) return block;

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

    case "ADD_ITEM":
      if (state.type !== STATE.col) return state;
      const idx = (state.content as EditorState[]).findIndex(
        (b) => b.id === action.targetId,
      );
      const insertAt = idx === -1 ? state.content.length : idx + 1;
      return {
        ...state,
        content: [
          ...state.content.slice(0, insertAt),
          action.payload,
          ...state.content.slice(insertAt),
        ],
      };

    case "REMOVE_ITEM":
      if (state.type !== STATE.col) return state;
      return {
        ...state,
        content: state.content.filter((_, idx) => idx !== action.payload),
      };

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
      { id: Math.random(), type: STATE.h1, content: "" },
      { id: Math.random(), type: STATE.h1, content: "fds" },
    ],
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>, targetId: number) => {
    dispatch({ type: "HANDLE_CHANGE", payload: e.target.value, targetId });
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    targetId: number,
  ) => {
    if (e.key === "Backspace") {
      const target = (state.content as EditorState[]).find(
        (b) => b.id === targetId,
      );
      if (target && target.content === "") {
        dispatch({ type: "CLEAR_TYPE", targetId });
      }
    }
    if (e.key === "Enter") {
      dispatch({
        type: "ADD_ITEM",
        targetId,
        payload: { id: Math.random(), type: null, content: "" },
      });
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
      onRemoveItem={(index: number) =>
        dispatch({ type: "REMOVE_ITEM", payload: index })
      }
    >
      {state}
    </Block>
  );
}

export default Wrapper;
