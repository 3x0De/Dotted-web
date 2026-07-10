export type Projet = { icon: string | null; title: string; lien: string };

export type CollectionHeader = [
  { Projets: Projet[]; visibilite: true },
  { Projets: Projet[]; visibilite: boolean },
];
