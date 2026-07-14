import type { Node } from "@xyflow/react";
import type React from "react";
import type { MakeState } from "../../Set";

type InputNodeData = {
  label: string;
  value: string;
  color: string;
  onChangeValue?: (id: string, value: string) => void;
  onChangeColor?: (id: string, color: string) => void;
  registerRef?: (el: HTMLInputElement | null) => void;
  onChange?: MakeState<React.ChangeEvent<HTMLInputElement>>;
};

export type InputNodeType = Node<InputNodeData, "inputNode">;
