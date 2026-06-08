import { useEffect, useState, useRef } from "react";
import "../Styles/main/Header.scss";

function Header() {
  const [Bjr, BjrState] = useState("");
  const [Projets, ProjetsState] = useState<[number, string][]>([]);
  const [ProjetsPv, ProjetsPvState] = useState<[number, string][]>([]);
  const [Pv, PvState] = useState<boolean>(false);
  const editingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    if (editingRef.current) {
      moveCursorToEnd(editingRef.current);
    }
  }, [Projets, ProjetsPv]);

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

  const fetchProjPv = async () => {
    const response = await fetch("http://localhost:8000/Racine/prive");
    const data = await response.json();

    ProjetsPvState(data);
  };

  useEffect(() => {
    fetchNom();
    fetchProj();
  }, []);

  useEffect(() => {
    if (Pv) fetchProjPv();
  }, [Pv]);

  const verifCon = async (e: any) => {
    const response = await fetch(
      "http://localhost:8000/con?mdp=" + e.currentTarget.value,
    );
    const data = await response.json();

    PvState(data);
    fetchProjPv();
  };

  const addPage = async () => {
    await fetch("http://localhost:8000/initProj", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    fetchProj();
  };

  const addPagePv = async () => {
    await fetch("http://localhost:8000/initProj/prive", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    fetchProjPv();
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
    fetchProjPv();
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
      <img
        src="/Logos/Dotted_full.svg"
        style={{
          width: "15vw",
          margin: "10px auto 0 auto",
        }}
        onClick={() => (window.location.href = "/")}
      />
      <h1>{Bjr}</h1>
      <h3>Projets</h3>
      <ul className="PagesRacine">
        {Projets.map((Proj) => {
          return (
            <li key={Proj[0]}>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => delProj(Proj[0])}
              >
                <img src="/src/assets/Image/Block logo/bin.svg" />
              </div>
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
                  editingRef.current = null;
                  updateNom(Proj[0], e.currentTarget.innerText);
                }}
              >
                {Proj[1]}
              </h4>
              <a href={"/" + Proj[0]}>Ouvrir</a>
            </li>
          );
        })}
        <li onClick={addPage} className="Add" style={{ cursor: "pointer" }}>
          <img src="/src/assets/Image/Block logo/Add.svg" />
          <h4>Ajouter</h4>
        </li>
      </ul>
      <input type="password" onChange={verifCon} />
      {Pv && (
        <>
          <h3>Projets Privés</h3>
          <ul className="PagesRacine">
            {ProjetsPv.map((Proj) => {
              return (
                <li key={Proj[0]}>
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => delProj(Proj[0])}
                  >
                    <img src="/src/assets/Image/Block logo/bin.svg" />
                  </div>
                  <h4
                    contentEditable
                    suppressContentEditableWarning
                    data-placeholder="T1tr3..."
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
            <li
              onClick={addPagePv}
              style={{ cursor: "pointer" }}
              className="Add"
            >
              <img src="/src/assets/Image/Block logo/Add.svg" />
              <h4>Ajouter</h4>
            </li>
          </ul>
        </>
      )}
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
