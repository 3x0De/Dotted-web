import React, { useEffect, useState } from "react";

import type { Categories } from "../../types/MainTypes/Categories";
import { STATE } from "../../types/MainTypes/BlockTypes/menu";

import Wrapper from "./Wrapper";
import MenuIcons from "./MenuIcons";

import "/src/styles/main/Page/Page.scss";

function Page() {
  return (
    <div id="Page">
      <Header />
      <Wrapper
        init={{
          id: 0,
          type: STATE.col,
          content: [
            { id: Math.random(), type: STATE.h1, content: "1" },
            { id: Math.random(), type: STATE.h1, content: "2" },
            {
              id: Math.random(),
              type: STATE.row,
              content: [
                {
                  id: Math.random(),
                  type: STATE.col,
                  content: [
                    { id: Math.random(), type: STATE.h1, content: "1" },
                    { id: Math.random(), type: STATE.h1, content: "2" },
                  ],
                },
                {
                  id: Math.random(),
                  type: STATE.col,
                  content: [
                    { id: Math.random(), type: STATE.h1, content: "1" },
                  ],
                },
              ],
            },
            {
              id: Math.random(),
              type: STATE.ul,
              content: [{ Id: Math.random(), contenu: "d" }],
            },
          ],
        }}
      />
    </div>
  );
}

function Header() {
  const [titre, settitre] = useState<string>("");
  const [afficheBanniere, setafficheBanniere] = useState<boolean>(false);
  const [afficheIcons, setafficheIcons] = useState<boolean>(false);
  const [iconPath, seticonPath] = useState<string | undefined>();

  useEffect(() => {
    document.title = titre == "" ? "Dotted" : `${titre} | Dotted`;
  }, [titre]);

  useEffect(() => {
    const link = document.querySelector(
      "link[rel~='icon']",
    ) as HTMLLinkElement | null;
    if (link) {
      link.href = iconPath ? iconPath : "/Icons/logo_mini.svg";
    }
  }, [iconPath]);

  return (
    <header>
      <div
        id="Banniere"
        style={
          {
            "--Baniere-Image": `url('/Icons/logo_max.svg')`,
          } as React.CSSProperties
        }
        onClick={() => setafficheBanniere((e) => !e)}
      >
        {afficheBanniere && (
          <input onClick={(e) => e.stopPropagation()} type="file" />
        )}
      </div>
      <input
        id="Titre"
        type="text"
        placeholder="Nouvelle page..."
        value={titre}
        onChange={(e) => settitre(e.currentTarget.value)}
      />
      <Categories />
      <Path titre={titre} />
      <div
        id="Icon"
        style={
          {
            "--Icon-Image": `url(${iconPath ? iconPath : "/Icons/logo_mini.svg"})`,
          } as React.CSSProperties
        }
        onClick={() => setafficheIcons((e) => !e)}
        onMouseLeave={() => setafficheIcons(false)}
      >
        {afficheIcons && <MenuIcons seticonPath={seticonPath} />}
      </div>
    </header>
  );
}

function Path({ titre }: { titre: string }) {
  const path = [
    { nom: "a", path: "google.com" },
    { nom: "b", path: "google.com" },
    { nom: "", path: "https://google.com" },
  ];

  const displayedPath = path.map((el, idx) =>
    idx === path.length - 1 ? { ...el, nom: titre } : el,
  );

  return (
    <p>
      {displayedPath.map((el, idx) => {
        return (
          <React.Fragment key={idx}>
            {" "}
            <a href={el.path} key={idx}>
              {el.nom}
            </a>
            {idx != path.length - 1 ? "/" : ""}
          </React.Fragment>
        );
      })}
    </p>
  );
}

function Categories() {
  const [categories, setcategories] = useState<Categories>([
    {
      icon: "/Icons/logo_mini.svg",
      categorie: "Categorie1",
      type: "Texte",
      value: "ACAB",
    },
    {
      icon: "/Icons/logo_mini.svg",
      categorie: "Categorie2",
      type: "Texte",
      value: "",
    },
  ]);

  return (
    <table>
      <tbody>
        {categories.map((el) => {
          return (
            <tr key={el.categorie}>
              <td>
                <img src={el.icon} />
              </td>
              <td>{el.categorie}</td>
              <td>
                <input
                  type={el.type}
                  value={el.value}
                  placeholder={`${el.type}...`}
                  onChange={(e) =>
                    setcategories((prev) =>
                      prev.map((elt) =>
                        elt.categorie == el.categorie
                          ? { ...el, value: e.target.value }
                          : elt,
                      ),
                    )
                  }
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default Page;
