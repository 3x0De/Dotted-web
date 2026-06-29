import { STATE, type TYPE } from "./menu";

export interface ColumnBlock {
  id: number;
  type: STATE.col;
  content: EditorState[];
}

export interface TextBlock {
  id: number;
  type: Exclude<TYPE, STATE.col>;
  content: string;
}

export type EditorState = ColumnBlock | TextBlock;

export type EditorAction =
  | { type: "SET_TYPE"; payload: TYPE; targetId: number }
  | { type: "SET_CONTENT"; payload: string }
  | { type: "CLEAR_TYPE"; targetId: number }
  | { type: "HANDLE_CHANGE"; payload: string; targetId: number }
  | { type: "ADD_ITEM"; targetId: number; payload: EditorState }
  | { type: "REMOVE_ITEM"; payload: number }
  | { type: "CLEAR_ITEMS" };
