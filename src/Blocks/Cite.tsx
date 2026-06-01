import "../Styles/Blocks/Cite.scss";

interface ManagerProps {
  Content: (e: React.SyntheticEvent<HTMLDivElement>) => void;
  Clavier: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}

interface Props {
  innerRef: React.RefObject<HTMLHeadingElement | null>;
  oninput: ManagerProps;
  contenu?: string;
}

function Cite({ innerRef, oninput, contenu }: Props) {
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
      onKeyDown={Clavier}
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
