export const enum DataTypeTableau {
  Text,
}

export type TableauType = {
  entete: { nom: string; type: DataTypeTableau }[];
  Pages: string[];
};
