import "../../Styles/main/Blocks/F1le.scss";
import F1le from "../../assets/Image/Block logo/F1le.svg";

interface Props {
  innerRef: React.RefObject<HTMLHeadingElement | null>;
  oninput: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  onUpload?: (newContent: string) => void;
  contenu?: string;
}

function File({ innerRef, oninput, onUpload, contenu }: Props) {
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/File/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        console.error("Erreur upload fichier", response.status);
        return;
      }

      const json = await response.json();
      if (!json.ok || !json.name) {
        console.error("Réponse serveur invalide", json);
        return;
      }

      const fileUrl = `http://localhost:8000/File/charge/${json.name}`;
      onUpload?.(fileUrl);
    } catch (error) {
      console.error("Erreur pendant l'envoi du fichier", error);
    }
  }

  return (
    <div ref={innerRef} className="F1le" onKeyDown={oninput}>
      {contenu ? (
        <a href={contenu}>
          <img src={F1le} />
          <p>{contenu}</p>
        </a>
      ) : (
        <input type="file" onChange={handleFileChange} />
      )}
    </div>
  );
}

export default File;
