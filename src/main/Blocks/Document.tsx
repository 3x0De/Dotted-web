import "../../Styles/main/Blocks/Document.scss";

function Document() {
  return (
    <span className="Doc">
      <div>
        <img src="src/assets/Image/Block logo/Document.svg" />
      </div>
      <p
        data-placeholder="Titre..."
        contentEditable="true"
        onInput={(e: any) => {
          handleInput(e);
          // Content(e);
        }}
        suppressContentEditableWarning={true}
      ></p>
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
