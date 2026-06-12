import { useEffect, useState } from "react";
import "../../Styles/main/Blocks/Document.scss";
import icon from "../../assets/Image/Block logo/Document.svg";

interface ManagerProps {
  Content: (e: React.SyntheticEvent<HTMLDivElement>) => void;
  Clavier: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}

interface Props {
  innerRef: React.RefObject<HTMLHeadingElement | null>;
  oninput: ManagerProps;
  onBlur?: (e: any) => void;
  contenu?: number;
}

function Document({ innerRef, oninput, onBlur, contenu }: Props) {
  const { Content, Clavier } = oninput;

  const [titre, titreState] = useState<string>("");

  useEffect(() => {
    if (!contenu) {
      titreState("");
      return;
    }

    async function getTitre() {
      try {
        const response = await fetch(`http://localhost:8000/titre/${contenu}`);

        if (!response.ok) {
          console.warn(`Erreur serveur : ${response.status}`);
          return;
        }
        const data = await response.json();
        console.log("Données reçues de l'API :", data);
        titreState(
          typeof data === "object" && data.titre ? data.titre : String(data),
        );
      } catch (error) {
        console.error("Erreur réseau :", error);
      }
    }

    getTitre();
  }, [contenu]);

  const updateNom = async (e: any) => {
    const id = contenu;
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

  return (
    <span className="Doc">
      <div
        onClick={() => {
          console.log("cont:", contenu);

          window.location.href = "/" + contenu;
        }}
      >
        <img
          src={contenu ? `http://localhost:8000/Icon/Page/${contenu}` : icon}
        />
      </div>
      <p
        ref={innerRef}
        data-placeholder="Titre..."
        contentEditable="true"
        onInput={(e: any) => {
          handleInput(e);
          Content(e);
        }}
        onBlur={(e) => {
          onBlur?.(e.currentTarget.innerText);
          updateNom(e);
        }}
        onKeyDown={Clavier}
        suppressContentEditableWarning={true}
      >
        {titre}
      </p>
    </span>
  );
}

function handleInput(e: React.SyntheticEvent<HTMLHeadingElement>): void {
  const target = e.currentTarget;
  if (target.innerHTML === "<br>") {
    target.innerHTML = "";
  }
}

export default Document;
