import { useState } from "react";
import type { CollectionHeader } from "../types/MainTypes/Header";

export function useHeader(init: CollectionHeader) {
  const [header, setheader] = useState<CollectionHeader>(init);

  const setVisibilite = (e: boolean) => {
    setheader((prev) => [prev[0], { ...prev[1], visibilite: e }]);
  };

  const setInput = (cont: string, idx: number, invisible?: true) => {
    if (invisible)
      setheader((prev) => [
        prev[0],
        {
          Projets: prev[1].Projets.map((el, id) => ({
            ...el,
            title: id === idx ? cont : el.title,
          })),
          visibilite: prev[1].visibilite,
        },
      ]);
    else
      setheader((prev) => [
        {
          Projets: prev[0].Projets.map((el, id) => ({
            ...el,
            title: id === idx ? cont : el.title,
          })),
          visibilite: true,
        },
        prev[1],
      ]);
  };

  const addPage = (invisible?: true) => {
    if (invisible)
      setheader((prev) => [
        prev[0],
        {
          ...prev[1],
          Projets: [...prev[1].Projets, { icon: null, title: "", lien: "" }],
        },
      ]);
    else
      setheader((prev) => [
        {
          ...prev[0],
          Projets: [...prev[0].Projets, { icon: null, title: "", lien: "" }],
        },
        prev[1],
      ]);
  };

  return { header, setVisibilite, setInput, addPage };
}
