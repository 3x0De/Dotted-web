import { STATE } from "./types/menu";
import Wrapper from "./Wrapper";
import "./styles/Page.scss";
import { useState } from "react";
import type { Categories } from "./types/Categories";

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
          ],
        }}
      />
    </div>
  );
}

function Header() {
  return (
    <header>
      <div
        id="Banniere"
        style={
          {
            "--Baniere-Image": `url('/Icons/logo_max.svg')`,
          } as React.CSSProperties
        }
      />
      <input id="Titre" type="text" placeholder="Nouvelle page..." />
      <Categories />
      <div
        id="Icon"
        style={
          {
            "--Icon-Image": `url('/Icons/logo_mini.svg')`,
          } as React.CSSProperties
        }
      />
    </header>
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
