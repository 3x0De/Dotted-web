import React, { useState, useRef, useEffect } from "react";
import "../../Styles/main/Blocks/Listes.scss";

interface ManagerProps {
  Content: (e: React.SyntheticEvent<HTMLDivElement>) => void;
  Clavier: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}

interface Puce {
  id: string;
  texte: string;
  fait: boolean;
}

interface Props {
  innerRef: React.RefObject<HTMLElement | null>;
  oninput: ManagerProps;
  contenu?: string[] | { cont: string; etat: boolean }[];
  onBlur?: (e: any) => void;
}

function ListePuces({ innerRef, oninput, contenu, onBlur }: Props) {
  const { Content, Clavier } = oninput;
  const [puces, setPuces] = useState<Puce[]>(
    contenu
      ? (contenu as string[]).map((cont, i) => ({
          id: (i + 1).toString(),
          texte:
            typeof cont === "string"
              ? cont
              : cont && typeof cont === "object" && "texte" in cont
                ? (cont as any).texte
                : "",
          fait: false,
        }))
      : [{ id: "1", texte: "", fait: false }],
  );
  const [idAFocuser, setIdAFocuser] = useState<string | null>(null);
  const elementsRef = useRef<{ [key: string]: HTMLLIElement | null }>({});

  const mettreCurseurALaFin = (el: HTMLLIElement) => {
    const range = document.createRange();
    const sel = window.getSelection();

    range.selectNodeContents(el);

    range.collapse(false);

    if (sel) {
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };

  useEffect(() => {
    const premierePuce = elementsRef.current["1"];
    if (premierePuce) {
      premierePuce.focus();
    }
  }, []);

  useEffect(() => {
    if (idAFocuser && elementsRef.current[idAFocuser]) {
      const el = elementsRef.current[idAFocuser];
      if (el) {
        el.focus();
        mettreCurseurALaFin(el);
      }
      setIdAFocuser(null);
    }
  }, [idAFocuser, puces]);

  const handleInput = (id: string, e: React.FormEvent<HTMLLIElement>) => {
    const target = e.currentTarget;

    if (target.innerHTML === "<br>") target.innerHTML = "";

    const nouveauTexte = target.innerText;

    setPuces((prev) =>
      prev.map((puce) =>
        puce.id === id ? { ...puce, texte: nouveauTexte } : puce,
      ),
    );

    setTimeout(() => {
      if (elementsRef.current[id]) {
        mettreCurseurALaFin(elementsRef.current[id]!);
      }
    }, 0);
  };

  const handleKeyDown = (
    id: string,
    index: number,
    e: React.KeyboardEvent<HTMLLIElement>,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const nouvelId = crypto.randomUUID();
      const nouvellePuce = { id: nouvelId, texte: "", fait: false };

      setPuces((prev) => {
        const copie = [...prev];
        copie.splice(index + 1, 0, nouvellePuce);
        return copie;
      });

      setIdAFocuser(nouvelId);
    }

    if (
      e.key === "Backspace" &&
      puces[index].texte === "" &&
      puces.length > 1
    ) {
      e.preventDefault();
      const indexPrecedent = index - 1;
      const idPrecedent = puces[indexPrecedent]?.id;

      setPuces((prev) => prev.filter((puce) => puce.id !== id));
      if (idPrecedent) setIdAFocuser(idPrecedent);
    }
  };

  return (
    <ul
      ref={innerRef as React.RefObject<HTMLUListElement>}
      onBlur={() => onBlur?.(puces.map((puce) => puce.texte))}
    >
      {puces.map((puce, index) => (
        <li
          key={puce.id}
          ref={(el) => {
            elementsRef.current[puce.id] = el;
          }}
          contentEditable="true"
          data-placeholder="Liste"
          onInput={(e: any) => {
            handleInput(puce.id, e);
            Content(e);
          }}
          onKeyDown={(e: any) => {
            handleKeyDown(puce.id, index, e);
            Clavier(e);
          }}
          suppressContentEditableWarning={true}
        >
          {puce.texte}
        </li>
      ))}
    </ul>
  );
}

function ListeNumerote({ innerRef, oninput, contenu, onBlur }: Props) {
  const { Content, Clavier } = oninput;
  const [puces, setPuces] = useState<Puce[]>(
    contenu
      ? (contenu as string[]).map((cont, i) => ({
          id: (i + 1).toString(),
          texte:
            typeof cont === "string"
              ? cont
              : cont && typeof cont === "object" && "texte" in cont
                ? (cont as any).texte
                : "",
          fait: false,
        }))
      : [{ id: "1", texte: "", fait: false }],
  );
  const [idAFocuser, setIdAFocuser] = useState<string | null>(null);
  const elementsRef = useRef<{ [key: string]: HTMLLIElement | null }>({});

  const mettreCurseurALaFin = (el: HTMLLIElement) => {
    const range = document.createRange();
    const sel = window.getSelection();

    range.selectNodeContents(el);

    range.collapse(false);

    if (sel) {
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };

  useEffect(() => {
    const premierePuce = elementsRef.current["1"];
    if (premierePuce) {
      premierePuce.focus();
    }
  }, []);

  useEffect(() => {
    if (idAFocuser && elementsRef.current[idAFocuser]) {
      const el = elementsRef.current[idAFocuser];
      if (el) {
        el.focus();
        mettreCurseurALaFin(el);
      }
      setIdAFocuser(null);
    }
  }, [idAFocuser, puces]);

  const handleInput = (id: string, e: React.FormEvent<HTMLLIElement>) => {
    const target = e.currentTarget;

    if (target.innerHTML === "<br>") target.innerHTML = "";

    const nouveauTexte = target.innerText;

    setPuces((prev) =>
      prev.map((puce) =>
        puce.id === id ? { ...puce, texte: nouveauTexte } : puce,
      ),
    );

    setTimeout(() => {
      if (elementsRef.current[id]) {
        mettreCurseurALaFin(elementsRef.current[id]!);
      }
    }, 0);
  };

  const handleKeyDown = (
    id: string,
    index: number,
    e: React.KeyboardEvent<HTMLLIElement>,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const nouvelId = crypto.randomUUID();
      const nouvellePuce = { id: nouvelId, texte: "", fait: false };

      setPuces((prev) => {
        const copie = [...prev];
        copie.splice(index + 1, 0, nouvellePuce);
        return copie;
      });

      setIdAFocuser(nouvelId);
    }

    if (
      e.key === "Backspace" &&
      puces[index].texte === "" &&
      puces.length > 1
    ) {
      e.preventDefault();
      const indexPrecedent = index - 1;
      const idPrecedent = puces[indexPrecedent]?.id;

      setPuces((prev) => prev.filter((puce) => puce.id !== id));
      if (idPrecedent) setIdAFocuser(idPrecedent);
    }
  };

  return (
    <ol
      ref={innerRef as React.RefObject<HTMLOListElement>}
      onBlur={() => onBlur?.(puces.map((puce) => puce.texte))}
    >
      {puces.map((puce, index) => (
        <li
          key={puce.id}
          ref={(el) => {
            elementsRef.current[puce.id] = el;
          }}
          contentEditable="true"
          data-placeholder="Liste"
          onInput={(e: any) => {
            handleInput(puce.id, e);
            Content(e);
          }}
          onKeyDown={(e: any) => {
            handleKeyDown(puce.id, index, e);
            Clavier(e);
          }}
          suppressContentEditableWarning={true}
        >
          {puce.texte}
        </li>
      ))}
    </ol>
  );
}

function ListeTODO({ innerRef, oninput, contenu, onBlur }: Props) {
  const { Content, Clavier } = oninput;
  const [puces, setPuces] = useState<Puce[]>(
    contenu
      ? (contenu as { cont: string; etat: boolean }[]).map((obj, i) => ({
          id: (i + 1).toString(),
          texte:
            obj && typeof obj === "object" && "cont" in obj
              ? obj.cont
              : typeof obj === "string"
                ? obj
                : "",
          fait:
            obj && typeof obj === "object" && "etat" in obj ? obj.etat : false,
        }))
      : [{ id: "1", texte: "", fait: false }],
  );
  const [idAFocuser, setIdAFocuser] = useState<string | null>(null);

  const elementsRef = useRef<{ [key: string]: HTMLSpanElement | null }>({});

  const mettreCurseurALaFin = (el: HTMLSpanElement) => {
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false);
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };

  useEffect(() => {
    const premierePuce = elementsRef.current["1"];
    if (premierePuce) {
      premierePuce.focus();
    }
  }, []);

  useEffect(() => {
    if (idAFocuser && elementsRef.current[idAFocuser]) {
      const el = elementsRef.current[idAFocuser];
      if (el) {
        el.focus();
        mettreCurseurALaFin(el);
      }
      setIdAFocuser(null);
    }
  }, [idAFocuser, puces]);

  const handleInput = (id: string, e: React.FormEvent<HTMLSpanElement>) => {
    const target = e.currentTarget;

    if (target.innerHTML === "<br>") target.innerHTML = "";

    const nouveauTexte = target.innerText;

    setPuces((prev) =>
      prev.map((puce) =>
        puce.id === id ? { ...puce, texte: nouveauTexte } : puce,
      ),
    );

    setTimeout(() => {
      if (elementsRef.current[id]) {
        mettreCurseurALaFin(elementsRef.current[id]!);
      }
    }, 0);
  };

  const handleKeyDown = (
    id: string,
    index: number,
    e: React.KeyboardEvent<HTMLSpanElement>,
  ) => {
    if (e.key === "ArrowDown") {
      if (index < puces.length - 1) {
        e.preventDefault();
        setIdAFocuser(puces[index + 1].id);
      }
      return;
    }

    if (e.key === "ArrowUp") {
      if (index > 0) {
        e.preventDefault();
        setIdAFocuser(puces[index - 1].id);
      }
      return;
    }

    if (e.key === "Escape") {
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const nouvelId = crypto.randomUUID();
      const nouvellePuce = { id: nouvelId, texte: "", fait: false };

      setPuces((prev) => {
        const copie = [...prev];
        copie.splice(index + 1, 0, nouvellePuce);
        return copie;
      });

      setIdAFocuser(nouvelId);
    }

    if (
      e.key === "Backspace" &&
      puces[index].texte === "" &&
      puces.length > 1
    ) {
      e.preventDefault();
      const indexPrecedent = index - 1;
      const idPrecedent = puces[indexPrecedent]?.id;

      setPuces((prev) => prev.filter((puce) => puce.id !== id));
      if (idPrecedent) setIdAFocuser(idPrecedent);
    }
  };

  const handleCheckboxChange = (id: string) => {
    setPuces((prev) =>
      prev.map((puce) =>
        puce.id === id ? { ...puce, fait: !puce.fait } : puce,
      ),
    );
  };

  return (
    <ul
      ref={innerRef as React.RefObject<HTMLUListElement>}
      className="liste-todo-conteneur"
      onBlur={() =>
        onBlur?.(puces.map((puce) => ({ cont: puce.texte, etat: puce.fait })))
      }
    >
      {puces.map((puce, index) => (
        <li key={puce.id} className={puce.fait ? "task-done" : ""}>
          <input
            type="checkbox"
            checked={puce.fait}
            onChange={() => handleCheckboxChange(puce.id)}
          />
          <span
            ref={(el) => {
              elementsRef.current[puce.id] = el;
            }}
            contentEditable="true"
            data-placeholder="Tâche"
            onInput={(e: any) => {
              handleInput(puce.id, e);
              Content(e);
            }}
            onKeyDown={(e: any) => {
              handleKeyDown(puce.id, index, e);
              Clavier(e);
            }}
            suppressContentEditableWarning={true}
          >
            {puce.texte}
          </span>
        </li>
      ))}
    </ul>
  );
}

const Listes = { ListePuces, ListeNumerote, ListeTODO };
export default Listes;
