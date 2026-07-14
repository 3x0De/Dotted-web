import type { Edge } from "@xyflow/react";
import type { InputNodeType } from "./BlockTypes/Graphe";
import type { Liste } from "./BlockTypes/Liste";
import type { TableurType } from "./BlockTypes/Tableur";
import { STATE, type TYPE } from "./BlockTypes/menu";

interface Block {
  id: number;
  type?: TYPE;
  content: any;
}

export interface RowBlock extends Block {
  id: number;
  type: STATE.row;
  content: ColumnBlock[];
}

export interface ColumnBlock extends Block {
  id: number;
  type: STATE.col;
  content: EditorState[];
}

export interface TextBlock extends Block {
  id: number;
  type:
    | STATE.h1
    | STATE.h2
    | STATE.h3
    | STATE.h4
    | STATE.h5
    | STATE.h6
    | null
    | STATE.cite;
  content: string;
}

export interface ListBlock extends Block {
  id: number;
  type: STATE.ol | STATE.ul | STATE.todo;
  content: Liste;
}

export interface MenuBlock extends Block {
  id: number;
  type: STATE.menu;
  content: { nom: string; content: EditorState[] };
}

export interface CadreBlock extends Block {
  id: number;
  type: STATE.cdr;
  content: EditorState[];
}

export interface EmptyBlock extends Block {
  id: number;
  type: STATE.sprt;
}

export interface LinkBlock extends Block {
  id: number;
  type: STATE.doc | STATE.link | STATE.img;
  content: string;
}

export interface TableurBlock extends Block {
  id: number;
  type: STATE.tbl;
  content: TableurType;
}

export interface GraphBlock extends Block {
  id: number;
  type: STATE.grph;
  content: { Node: InputNodeType[]; Edge: Edge[] };
}

export type EditorState =
  | RowBlock
  | ColumnBlock
  | TextBlock
  | ListBlock
  | MenuBlock
  | CadreBlock
  | EmptyBlock
  | LinkBlock
  | TableurBlock
  | GraphBlock;

export type EditorAction =
  | { type: "INIT"; payload: EditorState }
  | { type: "SET_TYPE"; payload: TYPE; targetId: number }
  | { type: "SET_CONTENT"; payload: string; targetId: number }
  | { type: "CLEAR_TYPE"; targetId: number }
  | {
      type: "HANDLE_CHANGE";
      payload: string;
      targetId: number;
      itemId?: number;
      itemState?: boolean;
      isCheckbox?: boolean;
    }
  | { type: "ADD_ITEM"; targetId: number; payload: EditorState }
  | { type: "ADD_LIST_ITEM"; blockId: number; afterId: number }
  | { type: "REMOVE_ITEM"; payload: number }
  | { type: "REMOVE_LIST_ITEM"; blockId: number; itemId: number }
  | { type: "CLEAR_ITEMS" }
  | { type: "MOVE_BLOCK"; targetId: number; sourceId: number }
  | { type: "UNDO"; payload?: EditorState };
