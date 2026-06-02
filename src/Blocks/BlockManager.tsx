import { useState, useRef, useEffect } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/react";
import "../Styles/Blocks/BlockManager.scss";
import type { BlockItem, TypeMenu } from "../Types";
import Titres from "./Titres";
import Listes from "./Listes";
import Menu from "./Menu";
import Cadre from "./Cadre";
import Cite from "./Cite";
import Separateur from "./Separateur";
import menuKebab from "../assets/Image/Block logo/kebabMenu.png";
import bin from "../assets/Image/Block logo/bin.png";

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
  const [ChoixEnCours, ChoixEnCoursState] = useState(false);
  const [ChoixEnCoursVide, ChoixEnCoursVideState] = useState(false);
  const [type, typeState] = useState(type1);
  const [indexSelectionne, indexSelectionneState] = useState(0);
  const [vraiContenu, vraiContenuState] = useState<any>(contenu);
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
    vraiContenuState(contenu);
  }, [contenu]);

  useEffect(() => {
    typeState(type1);
  }, [type1]);

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

  function handleSauvegardeGlobale(texte: string) {
    vraiContenuState(texte);
    if (onUpdate) {
      onUpdate(blockItem.id, type || "", texte);
    }
  }

  function ChangeType(newtype: string | null): void {
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
              { id: `b-${crypto.randomUUID()}`, type: "", content: "" },
            ],
          };
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
      if (onDelete) onDelete(blockItem);
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
          contenu={vraiContenu as string}
        />
      ) : type === "h2" ? (
        <Titres.H2
          innerRef={editableRef}
          oninput={{ Content, Clavier: gererClavier }}
          contenu={vraiContenu as string}
        />
      ) : type === "h3" ? (
        <Titres.H3
          innerRef={editableRef}
          oninput={{ Content, Clavier: gererClavier }}
          contenu={vraiContenu as string}
        />
      ) : type === "h4" ? (
        <Titres.H4
          innerRef={editableRef}
          oninput={{ Content, Clavier: gererClavier }}
          contenu={vraiContenu as string}
        />
      ) : type === "h5" ? (
        <Titres.H5
          innerRef={editableRef}
          oninput={{ Content, Clavier: gererClavier }}
          contenu={vraiContenu as string}
        />
      ) : type === "h6" ? (
        <Titres.H6
          innerRef={editableRef}
          oninput={{ Content, Clavier: gererClavier }}
          contenu={vraiContenu as string}
        />
      ) : type === "ul" ? (
        <Listes.ListePuces
          innerRef={editableRef}
          oninput={{ Content, Clavier: gererClavier }}
          contenu={vraiContenu as string[]}
        />
      ) : type === "ol" ? (
        <Listes.ListeNumerote
          innerRef={editableRef}
          oninput={{ Content, Clavier: gererClavier }}
          contenu={vraiContenu as string[]}
        />
      ) : type === "T0D0" ? (
        <Listes.ListeTODO
          innerRef={editableRef}
          oninput={{ Content, Clavier: gererClavier }}
          contenu={vraiContenu as { cont: string; etat: boolean }[]}
        />
      ) : type === "Menu" ? (
        <Menu
          innerRef={editableRef}
          oninput={{ Content, Clavier: gererClavier }}
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
          contenu={vraiContenu as string}
        />
      ) : type === "Sep4r4teur" ? (
        <Separateur />
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
                              : "Sep4r4teur"}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Block;
