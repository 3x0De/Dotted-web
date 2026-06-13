import "../../Styles/main/Blocks/Picture.scss";
import bin from "../../assets/Image/Block logo/bin.svg";
import scale from "../../assets/Image/Block logo/scale.svg";

interface Props {
  innerRef: React.RefObject<HTMLHeadingElement | null>;
  oninput: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  onUpload?: (newContent: {
    img: string;
    size?: { height: number; width: number };
  }) => void;
  contenu?: { img: string; size?: { height: number; width: number } };
}

function Picture({ innerRef, oninput, onUpload, contenu }: Props) {
  async function uploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://localhost:8000/Image/get", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      console.error("Erreur upload image", response.status);
      return;
    }

    const data = await response.json();
    if (!data.ok || !data.path) {
      console.error("Réponse serveur image invalide", data);
      return;
    }

    const fileName = data.name || data.path.split("/").pop();
    if (!fileName) {
      console.error("Impossible de retrouver le nom de fichier image");
      return;
    }

    const imageUrl = `http://localhost:8000/Image/charge/${fileName}`;
    onUpload?.({ img: imageUrl });
  }

  const imageUrl = contenu?.img
    ? contenu.img.startsWith("http")
      ? contenu.img
      : `http://localhost:8000/Image/charge/${contenu.img.split("/").pop()}`
    : undefined;

  return (
    <div className="Picture" ref={innerRef} onKeyDown={oninput}>
      {imageUrl ? (
        <>
          <img
            src={imageUrl}
            width={contenu?.size?.width}
            height={contenu?.size?.height}
            alt="Uploaded"
          />
          <img src={bin} alt="Supprimer" />
          <img src={scale} alt="Redimensionner" />
        </>
      ) : (
        <input type="file" accept="image/*" onChange={uploadImage} />
      )}
    </div>
  );
}

export default Picture;
