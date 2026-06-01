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
  image?: string;
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
  image,
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
      {image && (
        <div
          id="Baniere"
          style={{ "--Baniere-Image": `url(${image})` } as React.CSSProperties}
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
          {Blocks?.map((block) => (
            <Block
              key={block.id}
              type1={block.type}
              contenu={block.content}
              blockItem={block}
              onDelete={onDeleteBlock}
              onUpdate={onUpdate}
              addBlock={addBlock}
              autoFocus={idAFocus === block.id}
              onFocusDone={() => setIdAFocus(null)}
            />
          ))}
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
