import React, { useEffect, useState } from "react";

import type { Categories } from "../../types/MainTypes/Categories";

import Wrapper from "./Wrapper";
import MenuIcons from "./MenuIcons";

import "/src/styles/main/Page/Page.scss";
import { data, useNavigate } from "react-router-dom";

function Page() {
  const navigate = useNavigate();

  useEffect(() => {
    async function getPages() {
      const request = await fetch(`${import.meta.env.VITE_API_URL}/Page`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prive: true, racine: false }),
      });

      return await request.json();
    }

    getPages().then((list) => {
      if (
        !list.includes(window.location.pathname) &&
        window.location.pathname !== "/"
      )
        navigate("/404");
    });
  }, []);

  return (
    <div id="Page">
      <Header />
      <Wrapper />
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
  const [path, setPath] = useState<{ name: string; path: string }[]>([]);

  useEffect(() => {
    async function getPath() {
      const request = await fetch(
        `${import.meta.env.VITE_API_URL}${window.location.pathname}/Path`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (request.status === 200) {
        const data = await request.json();
        setPath(data);
      }
    }

    getPath();
  }, []);

  const displayedPath = path.map((el, idx) =>
    idx === path.length - 1 ? { ...el, name: titre } : el,
  );

  return (
    <p>
      {displayedPath.map((el, idx) => (
        <React.Fragment key={idx}>
          <a href={el.path}>{el.name}</a>
          {idx !== displayedPath.length - 1 ? "/" : ""}
        </React.Fragment>
      ))}
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
