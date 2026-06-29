import { STATE, type TYPE } from "./menu";

export interface ColumnBlock {
  id: number;
  type: STATE.col;
  content: EditorState[]; // Les colonnes ont des sous-éléments
}

export interface TextBlock {
  id: number;
  type: Exclude<TYPE, STATE.col>; // h1, h2, h3... ou null
  content: string; // Les textes ont une chaîne de caractères
}

export type EditorState = ColumnBlock | TextBlock;

export type EditorAction =
  | { type: "SET_TYPE"; payload: TYPE; targetId: number }
  | { type: "SET_CONTENT"; payload: string }
  | { type: "CLEAR_TYPE"; targetId: number }
  | { type: "HANDLE_CHANGE"; payload: string; targetId: number }
  | { type: "ADD_ITEM"; payload: EditorState }
  | { type: "REMOVE_ITEM"; payload: number }
  | { type: "CLEAR_ITEMS" };
