import { useEffect, useState } from "react";
import openLien from "../../assets/Image/Block logo/Li1.svg";
import "../../Styles/main/Blocks/Lien.scss";

function Lien({ contenu }: { contenu?: string }) {
  const [iframe, iframeState] = useState<boolean>(false);

  function verifLien(cont: string | undefined): boolean {
    if (
      (cont?.includes("https://codepen.io/") && cont?.includes("/pen")) ||
      cont?.includes("https://open.spotify.com/embed") ||
      cont?.includes("https://www.youtube.com/embed/") ||
      cont?.includes("https://maps.google.com/maps")
    ) {
      return true;
    }
    return false;
  }

  useEffect(() => {
    iframeState(verifLien(contenu));
  }, [contenu]);

  return (
    <div className="lien">
      {iframe ? (
        <iframe
          src={contenu?.replaceAll("&amp;", "&").replace("/pen/", "/embed/")}
        />
      ) : (
        <>
          <a href={contenu} target="_blank">
            <img src={openLien} />
          </a>
          <p contentEditable="true" suppressContentEditableWarning={true}>
            {contenu}
          </p>
        </>
      )}
    </div>
  );
}

export default Lien;
