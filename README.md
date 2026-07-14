# Dotted-web

Interface web de [Dotted](https://github.com/3x0De/Dotted-docs), développée avec Vite, React, TypeScript et Sass.

## Stack

| Techno                                                                | Usage                      |
| --------------------------------------------------------------------- | -------------------------- |
| [Vite](https://vite.dev/)                                             | Bundler / dev server       |
| [React](https://fr.react.dev/)                                        | UI                         |
| [TypeScript](https://www.typescriptlang.org/)                         | Typage                     |
| [Sass](https://sass-lang.com/)                                        | Styles                     |
| [@dnd-kit](https://dndkit.com/)                                       | Drag & drop des blocs      |
| [@handsontable/react](https://handsontable.com/docs/react-data-grid/) | Tableurs (blocs `Tableur`) |
| [@xyflow/react](https://reactflow.dev/)                               | Graphes (blocs `Graphe`)   |

## Prérequis

- Node.js
- npm

L'app est accessible sur http://localhost:5173

## Fonctionnement de l'éditeur

- Le composant `Wrapper` centralise l'état de l'éditeur via `useReducer`.
- Chaque bloc de contenu (`Block`) peut être de type texte, titre, liste, image, tableau, graphe, etc.
- Les blocs sont réorganisables par drag & drop (`@dnd-kit`).
- Un système d'undo/redo est géré via une pile d'états (`usePile`).
- La sauvegarde se fait automatiquement vers l'API backend à chaque changement d'état.

## Notes

- Le typage des blocs (`EditorState`) est central : chaque type de bloc (titre, liste, graphe, ...) a sa propre forme de `content`.
- Les composants de blocs suivent une convention commune de props (`onChange`, `onKeyDown`, `registerRef`) pour s'intégrer au système de focus/navigation clavier de l'éditeur.

## Documentation

- [Architecture globale](https://github.com/3x0De/Dotted-docs/blob/main/ARCHITECTURE.md)
- [Installation détaillée](https://github.com/3x0De/Dotted-docs/blob/main/INSTALLATION.md)
- [Changelog](./CHANGELOG.md)
