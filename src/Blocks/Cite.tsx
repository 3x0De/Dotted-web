import "../Styles/Blocks/Cite.scss";

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

function Cite({ innerRef, oninput, onBlur, contenu }: Props) {
  const { Content, Clavier } = oninput;

  return (
    <p
      ref={innerRef}
      contentEditable="true"
      data-placeholder="Citation..."
      className="cite"
      onInput={(e: any) => {
        handleInput(e);
        Content(e);
      }}
      onBlur={(e: any) => onBlur?.(e.currentTarget.innerText)}
      onKeyDown={Clavier}
      suppressContentEditableWarning={true}
    >
      {contenu}
    </p>
  );
}

function handleInput(e: React.SyntheticEvent<HTMLHeadingElement>): void {
  const target = e.currentTarget;
  if (target.innerHTML === "<br>") {
    target.innerHTML = "";
  }
}

export default Cite;
