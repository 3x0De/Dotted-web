import { useEffect, useRef } from "react";
import Block from "./Blocks/BlockManager";
import "./Styles/Page.scss";
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
  const h1Ref = useRef<HTMLHeadingElement>(null);

  const initialTitre = useRef(titre);

  useEffect(() => {
    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (link) link.href = icon || "/Logos/Dotted_mini.svg";
    document.title = titre ? `${titre} | Dotted` : "Dotted";
  }, [icon, titre]);

  return (
    <main>
      {banniere && (
        <div
          id="Baniere"
          style={
            { "--Baniere-Image": `url(${banniere})` } as React.CSSProperties
          }
        ></div>
      )}
      {icon && (
        <div
          id="Icon"
          style={{ "--Icon-Image": `url(${icon})` } as React.CSSProperties}
        ></div>
      )}
      <section>
        <h1
          ref={h1Ref}
          id="Titre"
          contentEditable="true"
          data-placeholder="Nouvelle page..."
          suppressContentEditableWarning={true}
          onInput={(e: React.FormEvent<HTMLHeadingElement>) => {
            handleInput(e);
            const target = e.currentTarget;
            if (titreState) {
              titreState(target.innerText);
            }
          }}
        >
          {initialTitre.current}
        </h1>
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
