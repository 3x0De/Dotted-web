import type { DataTypeTableau } from "./BlockTypes/Tableau";

type typesCate = { type: DataTypeTableau; value: string };

export type Categories = ({
  nom: string;
} & typesCate)[];
