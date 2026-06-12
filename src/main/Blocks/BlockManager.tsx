import { useState, useRef, useEffect } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/react";
import "../../Styles/main/Blocks/BlockManager.scss";
import type { BlockItem, TypeMenu } from "../Types";
import Titres from "./Titres";
import Listes from "./Listes";
import Menu from "./Menu";
import Cadre from "./Cadre";
import Cite from "./Cite";
import Separateur from "./Separateur";
import Document from "./Document";
import Picture from "./Picture";
import menuKebab from "../../assets/Image/Block logo/kebabMenu.svg";
import bin from "../../assets/Image/Block logo/bin.svg";

function mergeRefs(...refs: Array<React.Ref<any> | undefined>) {
  return (element: any) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === "function") {
        ref(element);
      } else if (ref && "current" in ref) {
        (ref as any).current = element;
      }
    });
  };
}

function createDefaultCadreContent(contenu?: any) {
  if (Array.isArray(contenu) && contenu.length > 0) {
    return contenu;
  }

  return [
    {
      id: `b-${crypto.randomUUID()}`,
      type: "",
      content: "",
    },
  ];
}

function getInitialContent(type?: string, contenu?: any) {
  return type === "C4DR3" ? createDefaultCadreContent(contenu) : contenu;
}

interface Props {
  autoFocus?: boolean;
  type1?: string;
  contenu?: any;
  blockItem: BlockItem;
  onDelete?: (block: BlockItem) => void;
  onUpdate?: (id: string, newType: string, newContent: any) => void;
  addBlock?: (id: string) => void;
  onFocusDone?: () => void;
  idAFocus?: string | null;
  setIdAFocus?: React.Dispatch<React.SetStateAction<string | null>>;
}

function Block({
  autoFocus,
  type1,
  contenu,
  blockItem,
  onDelete,
  onUpdate,
  addBlock,
  onFocusDone,
  idAFocus,
  setIdAFocus,
}: Props) {
  async function sendNewPage() {
    await fetch("http://localhost:8000/initProj/enfant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parent: Number(
          window.location.pathname.split("/").filter(Boolean).at(-1),
        ),
      }),
    });
    const response = await fetch("http://localhost:8000/maxId");
    return await response.json();
  }

  const resolvedType = type1 ?? blockItem.type;
  const resolvedContenu = contenu ?? blockItem.content;

  const [ChoixEnCours, ChoixEnCoursState] = useState(false);
  const [ChoixEnCoursVide, ChoixEnCoursVideState] = useState(false);
  const [type, typeState] = useState(resolvedType);
  const [indexSelectionne, indexSelectionneState] = useState(0);
  const [vraiContenu, vraiContenuState] = useState<any>(() =>
    getInitialContent(resolvedType, resolvedContenu),
  );
  const editableRef = useRef<any>(null);

  const {
    isDragging,
    handleRef,
    ref: dragRef,
  } = useDraggable({ id: blockItem.id });
  const { ref: dropRef, isDropTarget } = useDroppable({
    id: blockItem.id,
    data: { currentBlock: blockItem },
  });

  const setCombinedRef = mergeRefs(dragRef, dropRef);

  useEffect(() => {
    vraiContenuState(getInitialContent(resolvedType, resolvedContenu));
  }, [resolvedType, resolvedContenu]);

  useEffect(() => {
    typeState(resolvedType);
  }, [resolvedType]);

  useEffect(() => {
    if (type && editableRef.current) editableRef.current.focus();
  }, [type]);

  useEffect(() => {
    if (!ChoixEnCours) indexSelectionneState(0);
  }, [ChoixEnCours]);

  useEffect(() => {
    const shouldFocus = autoFocus || idAFocus === blockItem.id;

    if (shouldFocus && editableRef.current) {
      const timer = setTimeout(() => {
        if (editableRef.current) {
          editableRef.current.focus();
          const range = document.createRange();
          const sel = window.getSelection();
          range.selectNodeContents(editableRef.current);
          range.collapse(false);
          sel?.removeAllRanges();
          sel?.addRange(range);
        }
      }, 0);

      if (onFocusDone) onFocusDone();
      if (setIdAFocus && idAFocus === blockItem.id) setIdAFocus(null);

      return () => clearTimeout(timer);
    }
  }, [autoFocus, idAFocus, blockItem.id, onFocusDone, setIdAFocus]);

  const listeTypes = [
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "ul",
    "ol",
    "T0D0",
    "Menu",
    "C4DR3",
    "C1T4Tion",
    "Sep4r4teur",
    "Document",
    "P1ctuRe",
  ];

  function Content(e: React.SyntheticEvent<HTMLDivElement>): void {
    const target = e.currentTarget;
    if (target.innerHTML === "<br>") {
      target.innerHTML = "";
    } else if (
      target.innerHTML.includes("<br>") &&
      type !== "ul" &&
      type !== "T0D0" &&
      type !== "li" &&
      addBlock
    ) {
      target.innerHTML = target.innerText;

      if (onUpdate) onUpdate(blockItem.id, type || "", target.innerText);
      addBlock(blockItem.id);
      return;
    }

    if (target.innerHTML === "#&nbsp;") ChangeType("h1");
    else if (target.innerHTML === "##&nbsp;") ChangeType("h2");
    else if (target.innerHTML === "###&nbsp;") ChangeType("h3");
    else if (target.innerHTML === "####&nbsp;") ChangeType("h4");
    else if (target.innerHTML === "#####&nbsp;") ChangeType("h5");
    else if (target.innerHTML === "######&nbsp;") ChangeType("h6");
    else if (
      target.innerHTML === "+&nbsp;" ||
      target.innerHTML === "-&nbsp;" ||
      target.innerHTML === ".&nbsp;"
    )
      ChangeType("ul");
    else if (target.innerHTML === "1.&nbsp;") ChangeType("ol");
    else if (target.innerHTML === "[]&nbsp;") ChangeType("T0D0");
    else if (target.innerHTML === "&gt;&nbsp;") ChangeType("Menu");
    else if (target.innerHTML === "{}&nbsp;") ChangeType("C4DR3");
    else if (target.innerHTML === "|&nbsp;" || target.innerHTML === '"&nbsp;')
      ChangeType("C1T4Tion");
    else if (target.innerHTML === "__&nbsp;") ChangeType("Sep4r4teur");

    if (target.innerHTML === "/") {
      ChoixEnCoursState(true);
      ChoixEnCoursVideState(true);
    } else if (target.innerHTML[0] === "/") {
      ChoixEnCoursState(true);
      ChoixEnCoursVideState(false);
    } else {
      ChoixEnCoursState(false);
      ChoixEnCoursVideState(false);
    }
  }

  function handleSauvegardeGlobale(donnees: any) {
    vraiContenuState(donnees);
    if (onUpdate) {
      onUpdate(blockItem.id, type || "", donnees);
    }
  }

  async function ChangeType(newtype: string | null): Promise<void> {
    ChoixEnCoursState(false);
    ChoixEnCoursVideState(false);

    if (newtype != null) {
      let calculeContenu = vraiContenu;
      let texteExtrait = "";

      if (type === "C4DR3" && Array.isArray(vraiContenu)) {
        const premierEnfant = vraiContenu[0];
        if (premierEnfant)
          texteExtrait =
            typeof premierEnfant.content === "string"
              ? premierEnfant.content
              : "";
      } else if (
        type === "Menu" &&
        vraiContenu &&
        typeof vraiContenu === "object" &&
        "titre" in vraiContenu
      ) {
        texteExtrait = vraiContenu.titre || "";
      } else {
        texteExtrait = typeof vraiContenu === "string" ? vraiContenu : "";
      }

      if (newtype === "ul" || newtype === "ol") {
        if (type === "C4DR3" || !Array.isArray(vraiContenu))
          calculeContenu = [texteExtrait];
      } else if (newtype === "T0D0") {
        if (
          type === "C4DR3" ||
          !Array.isArray(vraiContenu) ||
          (vraiContenu.length > 0 && !("cont" in vraiContenu[0]))
        ) {
          calculeContenu = [{ cont: texteExtrait, etat: false }];
        }
      } else if (newtype === "C4DR3") {
        if (type !== "C4DR3") {
          calculeContenu = [
            {
              id: `b-${crypto.randomUUID()}`,
              type: "h1",
              content: texteExtrait,
            },
          ];
        }
      } else if (newtype === "Menu") {
        if (type !== "Menu") {
          calculeContenu = {
            titre: texteExtrait,
            enfants: [
              { id: `b-${crypto.randomUUID()}`, type: "", content: " " },
            ],
          };
        }
      } else if (newtype === "Document") {
        if (type !== "Document") {
          const newPageId = await sendNewPage();
          if (typeof newPageId === "number" && !Number.isNaN(newPageId)) {
            calculeContenu = newPageId;
          } else {
            console.error(
              "Impossible de récupérer l'identifiant de la nouvelle page Document.",
            );
          }
        }
      } else {
        if (Array.isArray(vraiContenu)) calculeContenu = texteExtrait;
      }

      vraiContenuState(calculeContenu);
      typeState(newtype);
      if (onUpdate) onUpdate(blockItem.id, newtype, calculeContenu);
    }
  }

  function gererClavier(e: React.KeyboardEvent<HTMLDivElement>): void {
    if (e.key === "Backspace" && editableRef.current?.textContent === "") {
      const selection = window.getSelection();
      const isSelectionCollapsed = selection?.isCollapsed ?? false;
      const isDefaultEmptyBlock =
        (!type || type === "") &&
        (contenu === undefined ||
          contenu === "" ||
          (Array.isArray(contenu) && contenu.length === 0));

      if (!isDefaultEmptyBlock && isSelectionCollapsed) {
        if (onDelete) onDelete(blockItem);
      }
    }
    if (ChoixEnCours) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        indexSelectionneState((prev) =>
          prev < listeTypes.length - 1 ? prev + 1 : 0,
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        indexSelectionneState((prev) =>
          prev > 0 ? prev - 1 : listeTypes.length - 1,
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        ChangeType(listeTypes[indexSelectionne]);
      } else if (e.key === "Escape") {
        ChoixEnCoursState(false);
      }
    }
  }

  return (
    <div
      ref={setCombinedRef}
      id={blockItem.id}
      className={`Block ${isDragging ? "dragging" : ""} ${isDropTarget ? "drag-over" : ""}`}
    >
      {type === "h1" ? (
        <Titres.H1
          innerRef={editableRef}
          oninput={{ Content, Clavier: gererClavier }}
          onBlur={(e) => handleSauvegardeGlobale(e.currentTarget.innerText)}
          contenu={vraiContenu as string}
        />
      ) : type === "h2" ? (
        <Titres.H2
          innerRef={editableRef}
          oninput={{ Content, Clavier: gererClavier }}
          onBlur={(e) => handleSauvegardeGlobale(e.currentTarget.innerText)}
          contenu={vraiContenu as string}
        />
      ) : type === "h3" ? (
        <Titres.H3
          innerRef={editableRef}
          oninput={{ Content, Clavier: gererClavier }}
          onBlur={(e) => handleSauvegardeGlobale(e.currentTarget.innerText)}
          contenu={vraiContenu as string}
        />
      ) : type === "h4" ? (
        <Titres.H4
          innerRef={editableRef}
          oninput={{ Content, Clavier: gererClavier }}
          onBlur={(e) => handleSauvegardeGlobale(e.currentTarget.innerText)}
          contenu={vraiContenu as string}
        />
      ) : type === "h5" ? (
        <Titres.H5
          innerRef={editableRef}
          oninput={{ Content, Clavier: gererClavier }}
          onBlur={(e) => handleSauvegardeGlobale(e.currentTarget.innerText)}
          contenu={vraiContenu as string}
        />
      ) : type === "h6" ? (
        <Titres.H6
          innerRef={editableRef}
          oninput={{ Content, Clavier: gererClavier }}
          onBlur={(e) => handleSauvegardeGlobale(e.currentTarget.innerText)}
          contenu={vraiContenu as string}
        />
      ) : type === "ul" ? (
        <Listes.ListePuces
          innerRef={editableRef}
          oninput={{ Content, Clavier: gererClavier }}
          onBlur={handleSauvegardeGlobale}
          contenu={
            Array.isArray(vraiContenu)
              ? (vraiContenu as any[]).map((item) =>
                  typeof item === "string"
                    ? item
                    : item && typeof item === "object" && "texte" in item
                      ? item.texte
                      : "",
                )
              : []
          }
        />
      ) : type === "ol" ? (
        <Listes.ListeNumerote
          innerRef={editableRef}
          oninput={{ Content, Clavier: gererClavier }}
          onBlur={handleSauvegardeGlobale}
          contenu={vraiContenu as string[]}
        />
      ) : type === "T0D0" ? (
        <Listes.ListeTODO
          innerRef={editableRef}
          oninput={{ Content, Clavier: gererClavier }}
          onBlur={handleSauvegardeGlobale}
          contenu={vraiContenu as { cont: string; etat: boolean }[]}
        />
      ) : type === "Menu" ? (
        <Menu
          innerRef={editableRef}
          oninput={{ Content, Clavier: gererClavier }}
          onBlur={(nouveauTitre: string) => {
            const current = (vraiContenu as TypeMenu) || {
              titre: "",
              enfants: [],
            };
            const updated = { ...current, titre: nouveauTitre } as TypeMenu;
            handleSauvegardeGlobale(updated);
          }}
          contenu={vraiContenu as TypeMenu}
        >
          {(vraiContenu as TypeMenu)?.enfants?.map((enfant) => (
            <Block
              key={enfant.id}
              type1={enfant.type}
              contenu={enfant.content}
              blockItem={enfant}
              onDelete={onDelete}
              onUpdate={onUpdate}
              addBlock={addBlock}
              idAFocus={idAFocus}
              setIdAFocus={setIdAFocus}
            />
          ))}
        </Menu>
      ) : type === "Colonnes" ? (
        <div className="bloc-colonnes">
          {(vraiContenu as BlockItem[][])?.map((colonne, colIndex) => (
            <div key={colIndex} className="colonne-item">
              {colonne.map((enfant) => (
                <Block
                  key={enfant.id}
                  type1={enfant.type}
                  contenu={enfant.content}
                  blockItem={enfant}
                  onDelete={onDelete}
                  onUpdate={onUpdate}
                  addBlock={addBlock}
                  idAFocus={idAFocus}
                  setIdAFocus={setIdAFocus}
                />
              ))}
            </div>
          ))}
        </div>
      ) : type === "C4DR3" ? (
        <Cadre innerRef={editableRef}>
          {(vraiContenu as BlockItem[])?.map((enfant) => (
            <Block
              key={enfant.id}
              type1={enfant.type}
              contenu={enfant.content}
              blockItem={enfant}
              onDelete={onDelete}
              onUpdate={onUpdate}
              addBlock={addBlock}
              idAFocus={idAFocus}
              setIdAFocus={setIdAFocus}
            />
          ))}
        </Cadre>
      ) : type === "C1T4Tion" ? (
        <Cite
          innerRef={editableRef}
          oninput={{ Content, Clavier: gererClavier }}
          onBlur={handleSauvegardeGlobale}
          contenu={vraiContenu as string}
        />
      ) : type === "Sep4r4teur" ? (
        <Separateur />
      ) : type === "Document" ? (
        <Document
          innerRef={editableRef}
          oninput={{ Content, Clavier: gererClavier }}
          contenu={vraiContenu as number}
        />
      ) : type === "P1ctuRe" ? (
        <Picture
          content={{
            img: "data:image/jpeg;base64,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",
            size: { height: 200, width: 200 },
          }}
        />
      ) : (
        <div
          ref={editableRef as React.RefObject<HTMLDivElement>}
          contentEditable="true"
          suppressContentEditableWarning={true}
          data-placeholder={
            ChoixEnCours
              ? " Choisissez votre bloc préféré"
              : ' Appuyez sur "/" pour afficher les commandes'
          }
          onKeyDown={gererClavier}
          className={
            ChoixEnCours
              ? ChoixEnCoursVide
                ? "choix-en-cours-vide choix-en-cours"
                : "choix-en-cours"
              : ""
          }
          onInput={Content}
          onBlur={(e) => handleSauvegardeGlobale(e.currentTarget.innerText)}
          dangerouslySetInnerHTML={{ __html: contenu as string }}
        />
      )}

      <div
        ref={handleRef}
        className="handle"
        onPointerDown={(e) => {
          e.stopPropagation();

          const typesTextuelsSimples = [
            "",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "C1T4Tion",
          ];
          if (
            editableRef.current &&
            typesTextuelsSimples.includes(type || "")
          ) {
            handleSauvegardeGlobale(editableRef.current.innerText);
          }

          ChoixEnCoursState(!ChoixEnCours);
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <img src={menuKebab} alt="Menu" />
      </div>

      <div
        className="delete-btn"
        onClick={() => {
          if (onDelete) onDelete(blockItem);
        }}
      >
        <img src={bin} alt="Supprimer" />
      </div>

      {ChoixEnCours && (
        <div id="Menu">
          <ul>
            {listeTypes.map((t, index) => (
              <li
                key={t}
                className={index === indexSelectionne ? "selectionne" : ""}
                onMouseDown={(e) => {
                  e.preventDefault();
                  ChangeType(t);
                }}
                onMouseEnter={() => indexSelectionneState(index)}
                ref={(elementAffiche) => {
                  if (index === indexSelectionne && elementAffiche) {
                    elementAffiche.scrollIntoView({
                      behavior: "smooth",
                      block: "nearest",
                    });
                  }
                }}
              >
                {index < 6
                  ? `Texte ${index + 1}`
                  : index === 6
                    ? "Liste à puces"
                    : index === 7
                      ? "Liste numéroté"
                      : index === 8
                        ? "Liste T0D0"
                        : index === 9
                          ? "Menu"
                          : index === 10
                            ? "C4DR3"
                            : index === 11
                              ? "C1T4Tion"
                              : index === 12
                                ? "Sep4r4teur"
                                : index === 13
                                  ? "Document"
                                  : "P1ctuRe"}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Block;
