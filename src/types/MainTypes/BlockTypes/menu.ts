export const enum STATE {
  row = "row",
  col = "column",
  h1 = "Titre 1",
  h2 = "Titre 2",
  h3 = "Titre 3",
  h4 = "Titre 4",
  h5 = "Titre 5",
  h6 = "Titre 6",
  ul = "Liste Non Ordonée",
  ol = "Liste Ordonée",
  todo = "Todolist",
  menu = "Menu",
  cdr = "Cadre",
  cite = "Citation",
  sprt = "Séparateur",
  doc = "Document",
}

export type TYPE = STATE | null;

type MenuEntry = [Exclude<keyof typeof STATE, "col" | "row">, STATE];

export const menu: MenuEntry[] = [
  ["h1", STATE.h1],
  ["h2", STATE.h2],
  ["h3", STATE.h3],
  ["h4", STATE.h4],
  ["h5", STATE.h5],
  ["h6", STATE.h6],
  ["ul", STATE.ul],
  ["ol", STATE.ol],
  ["todo", STATE.todo],
  ["menu", STATE.menu],
  ["cdr", STATE.cdr],
  ["cite", STATE.cite],
  ["sprt", STATE.sprt],
  ["doc", STATE.doc],
];
