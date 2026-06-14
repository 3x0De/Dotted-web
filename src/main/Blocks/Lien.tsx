import { useEffect, useState } from "react";
import openLien from "../../assets/Image/Block logo/Li1.svg";
import "../../Styles/main/Blocks/Lien.scss";

interface ManagerProps {
  Content: (e: React.SyntheticEvent<HTMLDivElement>) => void;
  Clavier: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}

interface Props {
  innerRef: React.RefObject<HTMLHeadingElement | null>;
  oninput: ManagerProps;
  onBlur?: (e: any) => void;
  contenu?: string;
}

function Lien({ innerRef, oninput, onBlur, contenu }: Props) {
  const { Content, Clavier } = oninput;
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
    <div className="lien" ref={innerRef}>
      {iframe ? (
        <iframe
          src={contenu?.replaceAll("&amp;", "&").replace("/pen/", "/embed/")}
        />
      ) : (
        <>
          <a href={contenu} target="_blank">
            <img src={openLien} />
          </a>
          <p
            data-placeholder="Li1..."
            contentEditable="true"
            suppressContentEditableWarning={true}
            onInput={(e: any) => {
              handleInput(e);
              Content(e);
            }}
            onBlur={(e: any) => onBlur?.(e.currentTarget.innerText)}
            onKeyDown={Clavier}
          >
            {contenu}
          </p>
        </>
      )}
    </div>
  );
}

function handleInput(e: React.SyntheticEvent<HTMLHeadingElement>): void {
  const target = e.currentTarget;
  if (target.innerHTML === "<br>") {
    target.innerHTML = "";
  }
}

export default Lien;
