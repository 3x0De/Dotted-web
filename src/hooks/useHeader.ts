import { useState, useEffect } from "react";
import type { CollectionHeader, Projet } from "../types/MainTypes/Header";

async function GetData(prive: boolean): Promise<Projet[]> {
  const request = await fetch(`${import.meta.env.VITE_API_URL}/Page`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ racine: true, prive: prive }),
  });
  const data = await request.json();

  async function getPageData(el: string): Promise<Projet> {
    const request = await fetch(`${import.meta.env.VITE_API_URL}${el}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await request.json();
    return {
      title: data.title ?? "",
      icon: data.icon,
      lien: el,
    };
  }

  const projets: Projet[] = await Promise.all(
    data.map((el: string) => getPageData(el)),
  );

  return projets;
}

export function useHeader() {
  const init: CollectionHeader = [
    { Projets: [], visibilite: true },
    { Projets: [], visibilite: false },
  ];

  const [header, setheader] = useState<CollectionHeader>(init);

  useEffect(() => {
    GetData(false).then((projets) => {
      setheader((prev) => [{ ...prev[0], Projets: projets }, prev[1]]);
    });
    GetData(true).then((projets) => {
      setheader((prev) => [prev[0], { ...prev[1], Projets: projets }]);
    });
  }, []);

  const setVisibilite = (e: boolean) => {
    setheader((prev) => [prev[0], { ...prev[1], visibilite: e }]);
  };

  const setInput = async (cont: string, idx: string, invisible?: true) => {
    if (invisible)
      setheader((prev) => [
        prev[0],
        {
          Projets: prev[1].Projets.map((el) => ({
            ...el,
            title: el.lien.slice(6) === idx ? cont : el.title,
          })),
          visibilite: prev[1].visibilite,
        },
      ]);
    else
      setheader((prev) => [
        {
          Projets: prev[0].Projets.map((el) => ({
            ...el,
            title: el.lien.slice(6) === idx ? cont : el.title,
          })),
          visibilite: true,
        },
        prev[1],
      ]);

    await fetch(`${import.meta.env.VITE_API_URL}/Page/${idx}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: "titre", nouveau: cont }),
    });
  };

  const addPage = async (invisible: boolean) => {
    if (invisible) {
      const requete = await fetch(`${import.meta.env.VITE_API_URL}/Page`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ visibilite: false, parent: null }),
      });

      if (requete.status == 201) {
        const data = await requete.json();

        setheader((prev) => [
          prev[0],
          {
            ...prev[1],
            Projets: [
              ...prev[1].Projets,
              { icon: null, title: "", lien: data.data },
            ],
          },
        ]);
      }
    } else {
      const requete = await fetch(`${import.meta.env.VITE_API_URL}/Page`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ visibilite: true, parent: null }),
      });

      if (requete.status == 201) {
        const data = await requete.json();

        setheader((prev) => [
          {
            ...prev[0],
            Projets: [
              ...prev[0].Projets,
              { icon: null, title: "", lien: data.data },
            ],
          },
          prev[1],
        ]);
      }
    }
  };

  const delPage = async (invisible: boolean, idx: string) => {
    const requete = await fetch(`${import.meta.env.VITE_API_URL}/Page/${idx}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (requete.status == 200) {
      if (invisible) {
        setheader((prev) => [
          prev[0],
          {
            ...prev[1],
            Projets: prev[1].Projets.filter((el) => el.lien.slice(6) != idx),
          },
        ]);
      } else {
        setheader((prev) => [
          {
            ...prev[0],
            Projets: prev[0].Projets.filter((el) => el.lien.slice(6) != idx),
          },
          prev[1],
        ]);
      }
    }
  };

  return { header, setVisibilite, setInput, addPage, delPage };
}
