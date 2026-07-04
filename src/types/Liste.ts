export type OrdreListItem = { Id: number; contenu: string };

export type TodoLisItem = { Id: number; contenu: string; state: boolean };

export type ListeItem = OrdreListItem | TodoLisItem;

export type Listede<T extends ListeItem> = T[];

export type Liste = Listede<TodoLisItem> | Listede<OrdreListItem>;
