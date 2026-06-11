import "../../Styles/main/Blocks/Document.scss";

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

  return (
    <span className="Doc">
      <div onClick={() => (window.location.href = "/" + contenu)}>
        <img src={`http://localhost:8000/Icon/Page/${contenu}`} />
      </div>
      <p
        ref={innerRef}
        data-placeholder="Titre..."
        contentEditable="true"
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
