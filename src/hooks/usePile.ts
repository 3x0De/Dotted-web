import { useState } from "react";

function usePile<T>(init: T[] = []) {
  const [pile, setPile] = useState(init);

  function empile(elt: T) {
    setPile((p) => [...p, elt]);
  }

  function depile(): T | undefined {
    if (estVide()) return undefined;

    const tete = top();
    setPile((p) => p.slice(0, -1));
    return tete;
  }

  function vide() {
    setPile([]);
  }

  function estVide(): boolean {
    return taille() === 0;
  }

  function taille(): number {
    return pile.length;
  }

  function top(): T | undefined {
    if (estVide()) return undefined;
    return pile[taille() - 1];
  }

  return { pile, empile, depile, vide, estVide, taille, top };
}

export default usePile;
