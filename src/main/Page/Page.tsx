import React, { useEffect, useState, useRef } from "react";

import type { Categories } from "../../types/MainTypes/Categories";

import Wrapper from "./Wrapper";
import MenuIcons from "./MenuIcons";

import "/src/styles/main/Page/Page.scss";
import { DataTypeTableau } from "../../types/MainTypes/BlockTypes/Tableau";

function Page() {
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
  const [bannierePath, setbannierePath] = useState<string | undefined>();

  const hasLoadedTitre = useRef(false);

  useEffect(() => {
    const getData = async () => {
      const request = await fetch(
        `${import.meta.env.VITE_API_URL}${window.location.pathname}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      return await request.json();
    };

    getData().then((list) => {
      settitre(list.title ?? "");
      hasLoadedTitre.current = true;
      seticonPath(list.icon);
      setbannierePath(`${import.meta.env.VITE_API_URL}${list.banniere}`);
    });
  }, []);

  useEffect(() => {
    document.title = titre == "" ? "Dotted" : `${titre} | Dotted`;

    if (!hasLoadedTitre.current) return;

    const sendTitle = async () => {
      await fetch(
        `${import.meta.env.VITE_API_URL}${window.location.pathname}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ type: "titre", nouveau: titre }),
        },
      );
    };

    sendTitle();
  }, [titre]);

  useEffect(() => {
    const link = document.querySelector(
      "link[rel~='icon']",
    ) as HTMLLinkElement | null;
    if (link) {
      link.href = iconPath ? iconPath : "/Icons/logo_mini.svg";
    }
  }, [iconPath]);

  async function sendBanniere(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    const request = await fetch(`${import.meta.env.VITE_API_URL}/Image`, {
      method: "PUT",
      credentials: "include",
      body: formData,
    });

    if (request.status === 200) {
      const data = await request.json();
      await fetch(
        `${import.meta.env.VITE_API_URL}${window.location.pathname}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ type: "banniere", nouveau: data.data }),
        },
      );

      setbannierePath(`${import.meta.env.VITE_API_URL}${data.data}`);
    }
  }

  return (
    <header>
      <div
        id="Banniere"
        style={
          {
            "--Baniere-Image": `url('${bannierePath != `${import.meta.env.VITE_API_URL}null` ? bannierePath : "/Icons/logo_max.svg"}')`,
          } as React.CSSProperties
        }
        onClick={() => setafficheBanniere((e) => !e)}
      >
        {afficheBanniere && (
          <input
            onClick={(e) => e.stopPropagation()}
            type="file"
            accept="image/*"
            onChange={sendBanniere}
          />
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
  const [categories, setcategories] = useState<Categories>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Flag de sécurité si le composant est démonte pendant les requêtes
    let isMounted = true;

    const fetchCategories = async () => {
      try {
        setLoading(true);

        // 1. Première requête : récupérer la liste des slugs / noms
        const resp = await fetch(
          `${import.meta.env.VITE_API_URL}${window.location.pathname}/Categories`,
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          },
        );

        if (!resp.ok) {
          throw new Error(`Erreur HTTP: ${resp.status}`);
        }

        const categoryList: string[] = await resp.json();

        if (!Array.isArray(categoryList)) return;

        // 2. Préparation de toutes les requêtes secondaires en parallèle
        const categoryPromises = categoryList.map(async (el) => {
          try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/${el}`, {
              method: "GET",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
            });
            if (!res.ok) return null;
            return await res.json();
          } catch (err) {
            console.error(`Chargement de ${el} impossible`, err);
            return null;
          }
        });

        // 3. On attend que TOUTES les promesses soient résolues
        const results = await Promise.all(categoryPromises);

        // 4. On filtre les requêtes qui auraient échoué (les `null`)
        const validCategories = results.filter((item) => item !== null);

        // 5. Une seule mise à jour de state globale
        if (isMounted) {
          setcategories(validCategories);
        }
      } catch (error) {
        console.error("Erreur du chargement des catégories :", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCategories();

    return () => {
      isMounted = false; // Annulation propre si le composant est démonté
    };
  }, []);

  if (loading) {
    return <p>Chargement des catégories...</p>;
  }

  return (
    <table>
      <tbody>
        {categories.map((el, index) => {
          if (!el) return null;

          return (
            <tr key={index}>
              <td>
                {el.nom && (
                  <img
                    src={
                      el.type == DataTypeTableau.Text
                        ? "/src/assets/Img/Page/Block/Tableau/Categories/text.svg"
                        : "/Icons/logo_mini.svg"
                    }
                  />
                )}
              </td>
              <td>{el.nom ?? ""}</td>
              <td>
                <input
                  type={el.type == DataTypeTableau.Text ? "text" : "text"}
                  value={el.value ?? ""}
                  placeholder={`${el.nom ?? ""}...`}
                  onChange={(e) => {
                    const val = e.target.value;
                    setcategories((prev) =>
                      prev.map((item) =>
                        item.nom === el.nom ? { ...item, value: val } : item,
                      ),
                    );
                  }}
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
