export type OrdreListItem = { Id: number; contenu: string };

export type TodoListItem = { Id: number; contenu: string; state: boolean };

export type ListeItem = OrdreListItem | TodoListItem;

export type Listede<T extends ListeItem> = T[];

export type Liste = Listede<TodoListItem> | Listede<OrdreListItem>;
