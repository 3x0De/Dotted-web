import React, { useEffect, useState, useRef } from "react";
import Block from "./Blocks/BlockManager";
import FolderScanner from "./FoldScan";
import "../Styles/main/Page.scss";
import type { BlockItem } from "./Types";

interface CategorieItem {
  img: string;
  id: string;
  nom: string;
}

interface Props {
  banniere?: string;
  icon?: string;
  titre?: string;
  titreState?: React.Dispatch<React.SetStateAction<string>>;
  categories?: CategorieItem[];
  Blocks?: BlockItem[];
  onDeleteBlock?: (block: BlockItem) => void;
  onUpdate?: (id: string, newType: string, newContent: any) => void;
  addBlock?: (targetId: string) => void;
  idAFocus: string | null;
  setIdAFocus: React.Dispatch<React.SetStateAction<string | null>>;
}

function Page({
  banniere,
  icon,
  titre,
  titreState,
  categories,
  Blocks,
  onDeleteBlock,
  onUpdate,
  addBlock,
  idAFocus,
  setIdAFocus,
}: Props) {
  const [afficheMenuIcon, afficheMenuIconState] = useState<boolean>(false);
  const [afficheMenuBanniere, afficheMenuBanniereState] =
    useState<boolean>(false);

  const updateNom = async (e: any) => {
    const id = Number(window.location.href.split("/").pop());
    await fetch("http://localhost:8000/Change/Nom", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        nom: e.currentTarget.innerHTML,
      }),
    });
  };

  useEffect(() => {
    document.title = titre ? `${titre} | Dotted` : "Dotted";
  }, [titre]);

  const changeTitre = (e: any) => {
    const value = e.currentTarget.innerText;

    document.title = value ? `${value} | Dotted` : "Dotted";
  };

  async function uploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    console.log("fichier:", file.name);

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "id",
      String(window.location.pathname.split("/").filter(Boolean).at(-1)),
    );

    const res = await fetch("http://localhost:8000/Banniere/change", {
      method: "POST",
      body: formData,
    });
    await res.json();
    window.location.href = window.location.pathname + "?t=" + Date.now();
  }

  async function delImage() {
    const res = await fetch("http://localhost:8000/Banniere/del", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: Number(window.location.pathname.split("/").filter(Boolean).at(-1)),
      }),
    });
    await res.json();
    window.location.href = window.location.pathname + "?t=" + Date.now();
  }

  const menuBanniereRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        menuBanniereRef.current &&
        !menuBanniereRef.current.contains(e.target as Node)
      ) {
        afficheMenuBanniereState(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <main>
      {banniere && (
        <div
          id="Baniere"
          ref={menuBanniereRef}
          style={
            { "--Baniere-Image": `url(${banniere})` } as React.CSSProperties
          }
          onClick={() => afficheMenuBanniereState((prev) => !prev)}
        >
          {afficheMenuBanniere && (
            <div className="Menu" onClick={(e) => e.stopPropagation()}>
              <img
                src="src/assets/Image/Block logo/bin.svg"
                onClick={delImage}
              />
              <input type="file" accept="image/*" onChange={uploadImage} />
            </div>
          )}
        </div>
      )}
      {icon && (
        <div
          id="Icon"
          style={{ "--Icon-Image": `url(${icon})` } as React.CSSProperties}
          onClick={() => afficheMenuIconState(!afficheMenuIcon)}
          onMouseLeave={() => afficheMenuIconState(false)}
        >
          {afficheMenuIcon && <FolderScanner path="src/assets/Image/Icons" />}
        </div>
      )}
      <section>
        <h1
          contentEditable
          suppressContentEditableWarning
          data-placeholder="Nouvelle page..."
          onInput={(e) => {
            changeTitre(e);
            handleInput(e);
          }}
          onBlur={(e) => {
            titreState?.(e.currentTarget.innerText);
            updateNom(e);
          }}
          dangerouslySetInnerHTML={{
            __html: titre || "",
          }}
        />
        <div id="Categories">
          <ul>
            {categories?.map((categorie) => (
              <li key={categorie.id}>
                <div>
                  <div className="id">
                    <img src={categorie.img} />
                    <p>{categorie.id}</p>
                  </div>
                  <div
                    contentEditable="true"
                    suppressContentEditableWarning={true}
                    data-placeholder={categorie.id + "..."}
                    onInput={handleInput}
                  >
                    {categorie.nom}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div id="wrapper">
          {(() => {
            const elements: React.ReactNode[] = [];
            let currentLineBlocks: BlockItem[] = [];

            const flushLine = (key: string | number) => {
              if (currentLineBlocks.length > 0) {
                elements.push(
                  <div className="ligne" key={`ligne-${key}`}>
                    {currentLineBlocks.map((block) => {
                      if (typeof block.content === "string") {
                        return (
                          <Block
                            key={block.id}
                            contenu={block.content}
                            blockItem={block}
                            idAFocus={idAFocus}
                            setIdAFocus={setIdAFocus}
                            addBlock={addBlock}
                            onDelete={onDeleteBlock}
                            onUpdate={onUpdate}
                          />
                        );
                      } else {
                        return (
                          <Block
                            key={block.id}
                            type1={block.type}
                            contenu={block.content}
                            blockItem={block}
                            idAFocus={idAFocus}
                            setIdAFocus={setIdAFocus}
                            addBlock={addBlock}
                            onDelete={onDeleteBlock}
                            onUpdate={onUpdate}
                          />
                        );
                      }
                    })}
                  </div>,
                );
                currentLineBlocks = [];
              }
            };

            (Blocks as BlockItem[]).forEach((block, index) => {
              if (block.type === "Colonnes") {
                flushLine(index);

                elements.push(
                  <div
                    className="ligne bloc-colonnes"
                    key={`ligne-col-${block.id}`}
                  >
                    {(block.content as BlockItem[][])?.map(
                      (colonne, colIndex) => (
                        <div key={colIndex} className="colonne-item">
                          {colonne.map((enfant) => (
                            <Block
                              key={enfant.id}
                              type1={enfant.type}
                              contenu={enfant.content}
                              blockItem={enfant}
                              idAFocus={idAFocus}
                              setIdAFocus={setIdAFocus}
                              addBlock={addBlock}
                              onDelete={onDeleteBlock}
                              onUpdate={onUpdate}
                            />
                          ))}
                        </div>
                      ),
                    )}
                  </div>,
                );
              } else {
                flushLine(index);
                currentLineBlocks.push(block);
                flushLine(`single-${block.id}`);
              }
            });

            return elements;
          })()}
        </div>
      </section>
    </main>
  );
}

function handleInput(e: React.SyntheticEvent<HTMLHeadingElement>): void {
  const target = e.currentTarget;
  if (target.innerHTML === "<br>") {
    target.innerHTML = "";
  }
}

export default Page;
