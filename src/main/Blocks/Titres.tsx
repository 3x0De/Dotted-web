import React from "react";
import "../../Styles/main/Blocks/Titres.scss";

interface ManagerProps {
  Content: (e: React.SyntheticEvent<HTMLDivElement>) => void;
  Clavier: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}

interface TitreProps {
  innerRef: React.RefObject<HTMLHeadingElement | null>;
  oninput: ManagerProps;
  contenu?: string;
  onBlur?: (e: any) => void;
}

function H1({ innerRef, oninput, contenu, onBlur }: TitreProps) {
  const { Content, Clavier } = oninput;

  return (
    <h1
      ref={innerRef}
      contentEditable="true"
      suppressContentEditableWarning={true}
      data-placeholder="Titre 1"
      onInput={(e: any) => {
        handleInput(e);
        Content(e);
      }}
      onKeyDown={Clavier}
      onBlur={onBlur}
    >
      {contenu}
    </h1>
  );
}

function H2({ innerRef, oninput, contenu, onBlur }: TitreProps) {
  const { Content, Clavier } = oninput;

  return (
    <h2
      ref={innerRef}
      contentEditable="true"
      suppressContentEditableWarning={true}
      data-placeholder="Titre 2"
      onInput={(e: any) => {
        handleInput(e);
        Content(e);
      }}
      onKeyDown={Clavier}
      onBlur={onBlur}
    >
      {contenu}
    </h2>
  );
}

function H3({ innerRef, oninput, contenu, onBlur }: TitreProps) {
  const { Content, Clavier } = oninput;
  return (
    <h3
      ref={innerRef}
      contentEditable="true"
      suppressContentEditableWarning={true}
      data-placeholder="Titre 3"
      onInput={(e: any) => {
        handleInput(e);
        Content(e);
      }}
      onKeyDown={Clavier}
      onBlur={onBlur}
    >
      {contenu}
    </h3>
  );
}

function H4({ innerRef, oninput, contenu, onBlur }: TitreProps) {
  const { Content, Clavier } = oninput;
  return (
    <h4
      ref={innerRef}
      contentEditable="true"
      suppressContentEditableWarning={true}
      data-placeholder="Titre 4"
      onInput={(e: any) => {
        handleInput(e);
        Content(e);
      }}
      onKeyDown={Clavier}
      onBlur={onBlur}
    >
      {contenu}
    </h4>
  );
}

function H5({ innerRef, oninput, contenu, onBlur }: TitreProps) {
  const { Content, Clavier } = oninput;
  return (
    <h5
      ref={innerRef}
      contentEditable="true"
      suppressContentEditableWarning={true}
      data-placeholder="Titre 5"
      onInput={(e: any) => {
        handleInput(e);
        Content(e);
      }}
      onKeyDown={Clavier}
      onBlur={onBlur}
    >
      {contenu}
    </h5>
  );
}

function H6({ innerRef, oninput, contenu, onBlur }: TitreProps) {
  const { Content, Clavier } = oninput;
  return (
    <h6
      ref={innerRef}
      contentEditable="true"
      suppressContentEditableWarning={true}
      data-placeholder="Titre 6"
      onInput={(e: any) => {
        handleInput(e);
        Content(e);
      }}
      onKeyDown={Clavier}
      onBlur={onBlur}
    >
      {contenu}
    </h6>
  );
}

function handleInput(e: React.SyntheticEvent<HTMLHeadingElement>): void {
  const target = e.currentTarget;
  if (target.innerHTML === "<br>") {
    target.innerHTML = "";
  }
}

const Titres = { H1, H2, H3, H4, H5, H6 };
export default Titres;
