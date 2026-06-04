import { useEffect, useState, useRef } from "react";
import "./Styles/Header.scss";

function Header() {
  const [Bjr, BjrState] = useState("");
  const [Projets, ProjetsState] = useState<[number, string][]>([]);
  const editingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    if (editingRef.current) {
      moveCursorToEnd(editingRef.current);
    }
  }, [Projets]);

  const fetchNom = async () => {
    const response = await fetch("http://localhost:8000/");
    const data = await response.json();

    BjrState(data);
  };

  const fetchProj = async () => {
    const response = await fetch("http://localhost:8000/Racine");
    const data = await response.json();

    ProjetsState(data);
  };

  useEffect(() => {
    fetchNom();
    fetchProj();
  }, []);

  const addPage = async () => {
    await fetch("http://localhost:8000/initProj", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    fetchProj();
  };

  const delProj = async (proj: number) => {
    await fetch("http://localhost:8000/supprProj", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        proj: proj,
      }),
    });
    fetchProj();
  };

  const updateNom = async (id: number, newName: string) => {
    await fetch("http://localhost:8000/Change/Nom", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        nom: newName,
      }),
    });
    fetchProj();
  };

  const moveCursorToEnd = (el: HTMLElement) => {
    const range = document.createRange();
    const selection = window.getSelection();

    range.selectNodeContents(el);
    range.collapse(false);

    selection?.removeAllRanges();
    selection?.addRange(range);
  };

  return (
    <header>
      <h1>{Bjr}</h1>
      <ul className="PagesRacine">
        {Projets.map((Proj) => {
          return (
            <li key={Proj[0]}>
              <img
                style={{ cursor: "pointer" }}
                src="/src/assets/Image/Block logo/bin.svg"
                onClick={() => delProj(Proj[0])}
              />
              <h4
                contentEditable
                suppressContentEditableWarning
                data-placeholder="Titre..."
                onFocus={(e) => {
                  editingRef.current = e.currentTarget;
                }}
                onInput={(e) => {
                  handleInput(e);
                }}
                onBlur={(e) => {
                  updateNom(Proj[0], e.currentTarget.innerText);
                }}
              >
                {Proj[1]}
              </h4>
              <a href={"/Page/" + Proj[0]}>Ouvrir</a>
            </li>
          );
        })}
        <li onClick={addPage} style={{ cursor: "pointer" }}>
          <img src="/src/assets/Image/Block logo/bin.svg" />
          <h4>Ajouter</h4>
        </li>
      </ul>
    </header>
  );
}

function handleInput(e: React.SyntheticEvent<HTMLHeadingElement>): void {
  const target = e.currentTarget;
  if (target.innerHTML === "<br>") {
    target.innerHTML = "";
  }
}

export default Header;
