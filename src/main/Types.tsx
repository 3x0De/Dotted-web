export interface TypeMenu {
  titre?: string;
  enfants?: BlockItem[];
}

export interface BlockItem {
  id: string;
  type?: string;
  content?:
    | string
    | string[]
    | { cont: string; etat: boolean }[]
    | TypeMenu
    | BlockItem[]
    | BlockItem[][]
    | Number
    | { img: string; size?: { height: number; width: number } }
    | (boolean | number | string)[][]
    | [
        {
          id: string;
          position: {
            x: number;
            y: number;
          };
          data: {
            label: string;
          };
        }[],
        {
          id: string;
          source: string;
          target: string;
        }[],
      ];
}
