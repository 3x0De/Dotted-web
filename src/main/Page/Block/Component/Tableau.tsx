import "../../../../styles/main/Page/Block/Component/Tableau.scss";
import { Text } from "./ComponentDeBase/Text";
import Add from "../../../../assets/Img/Page/Block/Tableau/Add.svg";
import bin from "../../../../assets/Img/Page/Block/Tableau/bin.svg";
import page from "../../../../assets/Img/Page/Block/Tableau/Page.svg";
import Texte from "../../../../assets/Img/Page/Block/Tableau/Categories/text.svg";
import { useState, useEffect } from "react";
import {
  DataTypeTableau,
  type TableauType,
} from "../../../../types/MainTypes/BlockTypes/Tableau";
import type React from "react";
import type { MakeState } from "../../../../types/Set";

function Row({
  path,
  entete,
  onDelete,
}: {
  path: string;
  entete: TableauType["entete"];
  onDelete: () => void;
}) {
  const [icon, setIcon] = useState<string>("");
  const [title, settitle] = useState<string>("");
  const [cate, setcate] = useState<
    { nom: string; type: DataTypeTableau; value: string }[]
  >([]);

  useEffect(() => {
    if (!path) {
      setIcon("");
      settitle("");
      setcate([]);
      return;
    }

    let cancelled = false;

    async function getPageData() {
      try {
        const request = await fetch(
          `${import.meta.env.VITE_API_URL}/Page/${path}`,
          { credentials: "include" },
        );
        if (!request.ok) throw new Error(`Erreur ${request.status}`);
        const json = await request.json();
        if (!cancelled) {
          setIcon(json.icon ?? "");
          settitle(json.title ?? "");
        }
      } catch (err) {
        console.error(err);
      }
    }

    async function getCateData() {
      try {
        const request = await fetch(
          `${import.meta.env.VITE_API_URL}/Page/${path}/Categories`,
          { credentials: "include" },
        );
        if (!request.ok) throw new Error(`Erreur ${request.status}`);
        const refs: string[] = await request.json();

        const results = await Promise.all(
          refs.map(async (ref) => {
            try {
              const res = await fetch(
                `${import.meta.env.VITE_API_URL}/${ref}`,
                { credentials: "include" },
              );
              if (!res.ok) throw new Error(`Erreur ${res.status}`);
              return await res.json();
            } catch (err) {
              console.error(err);
              return null;
            }
          }),
        );

        if (!cancelled) setcate(results.filter(Boolean));
      } catch (err) {
        console.error(err);
      }
    }

    getPageData();
    getCateData();

    return () => {
      cancelled = true;
    };
  }, [path]);

  async function handleChange(e: string) {
    try {
      const request = await fetch(
        `${import.meta.env.VITE_API_URL}/Page/${path}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ type: "titre", nouveau: e }),
        },
      );
      if (!request.ok) throw new Error(`Erreur ${request.status}`);
      else settitle(e);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <td>
        <div className="title">
          <button onClick={onDelete}>
            <img src={bin} />
          </button>
          <Text
            placeholder="Titre..."
            onChange={(e) => handleChange(e.target.value)}
          >
            {title}
          </Text>
          {path && (
            <a href={path}>
              <img src={icon || "/Icons/logo_mini.svg"} />
            </a>
          )}
        </div>
      </td>
      {entete.map((col, i) => {
        const found = cate.find((c) => c.nom === col.nom);
        return (
          <td key={i}>
            {found ? (
              Number(found.type) == DataTypeTableau.Text ? (
                <Text
                  placeholder={col.nom}
                  onChange={(e: React.ChangeEvent<HTMLInputElement, Element>) =>
                    console.log(e)
                  }
                >
                  {found.value}
                </Text>
              ) : (
                <p>Incorrect</p>
              )
            ) : (
              <Text
                placeholder={col.nom}
                onChange={(e: React.ChangeEvent<HTMLInputElement, Element>) =>
                  console.log(e)
                }
              >
                {""}
              </Text>
            )}
          </td>
        );
      })}

      <td></td>
    </>
  );
}

function Tableau({
  children,
  onChange,
  registerRef,
}: {
  children: TableauType;
  onChange: MakeState<React.ChangeEvent<HTMLInputElement>>;
  registerRef?: (el: HTMLInputElement | null) => void;
}) {
  const [content, setcontent] = useState<TableauType>(children);

  function updateContent(newContent: TableauType) {
    setcontent(newContent);
    onChange({
      target: { value: newContent },
    } as unknown as React.ChangeEvent<HTMLInputElement>);
  }

  async function addPage() {
    try {
      const requete = await fetch(`${import.meta.env.VITE_API_URL}/Page`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visibilite: true,
          parent: window.location.pathname.slice(6),
        }),
      });

      if (!requete.ok) throw new Error(`Erreur ${requete.status}`);
      const data = await requete.json();

      await Promise.all(
        content.entete.map(async (el) => {
          const res = await fetch(
            `${import.meta.env.VITE_API_URL}/Page/${data.data}/Categories`,
            {
              method: "PUT",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...el, value: "" }),
            },
          );
          if (!res.ok) throw new Error(`Erreur ${res.status}`);
        }),
      );

      return data.data;
    } catch (err) {
      console.error(err);
      return "";
    }
  }

  return (
    <div className="Tableau" ref={registerRef}>
      <table>
        <thead>
          <tr>
            <th>
              <div className="propriete">
                <img src={page} />
                Page
              </div>
            </th>
            {content.entete.map((el, id) => (
              <th key={id}>
                <div className="propriete">
                  <img src={el.type == DataTypeTableau.Text ? Texte : Texte} />
                  <Text
                    onChange={(
                      e: React.ChangeEvent<HTMLInputElement, Element>,
                    ) => {
                      const newContent = {
                        ...content,
                        entete: content.entete.map((elt, i) =>
                          i === id ? { ...elt, nom: e.target.value } : elt,
                        ),
                      };
                      updateContent(newContent);
                    }}
                  >
                    {el.nom}
                  </Text>
                </div>
              </th>
            ))}
            <th>
              <button
                onClick={() => {
                  const newContent = {
                    ...content,
                    entete: [
                      ...content.entete,
                      { type: DataTypeTableau.Text, nom: "Propriété" },
                    ],
                  };
                  updateContent(newContent);
                }}
              >
                <img src={Add} alt="" /> Ajouter une propriété
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {content.Pages.map((el, idx) => (
            <tr key={idx}>
              <Row
                path={el}
                entete={content.entete}
                onDelete={() => {
                  const newContent = {
                    ...content,
                    Pages: content.Pages.filter((_, i) => i !== idx),
                  };
                  updateContent(newContent);
                }}
              />
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={content.entete.length + 2}>
              <button
                onClick={async () => {
                  const newPage = await addPage();
                  const newContent = {
                    ...content,
                    Pages: [...content.Pages, newPage],
                  };
                  updateContent(newContent);
                }}
              >
                <img src={Add} alt="" /> Ajouter une page
              </button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default Tableau;
