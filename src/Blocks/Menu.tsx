import "../Styles/Blocks/Menu.scss";
import type { TypeMenu } from "../Types";

interface ManagerProps {
  Content: (e: React.SyntheticEvent<HTMLDivElement>) => void;
  Clavier: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}

interface MenuProps {
  innerRef: React.RefObject<any>;
  oninput: ManagerProps;
  children?: React.ReactNode;
  contenu?: TypeMenu;
}

function Menu({ innerRef, oninput, children, contenu }: MenuProps) {
  const { Content, Clavier } = oninput;
  return (
    <details>
      <summary
        ref={innerRef}
        data-placeholder="Menu"
        contentEditable="true"
        suppressContentEditableWarning={true}
        onInput={(e: any) => {
          handleInput(e);
          Content(e);
        }}
        onKeyDown={Clavier}
      >
        {contenu?.titre}
      </summary>
      {children}
    </details>
  );
}

function handleInput(e: React.SyntheticEvent<HTMLElement>): void {
  const target = e.currentTarget;
  if (target.innerHTML === "<br>") {
    target.innerHTML = "";
  }
}

export default Menu;
