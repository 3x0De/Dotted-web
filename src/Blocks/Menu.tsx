import "../Styles/Blocks/Menu.scss";
import type { TypeMenu } from "../Types";

interface ManagerProps {
  Content: (e: React.SyntheticEvent<HTMLDivElement>) => void;
  Clavier: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}

interface MenuProps {
  innerRef: React.RefObject<any>;
  oninput: ManagerProps;
  onBlur?: (e: any) => void;
  children?: React.ReactNode;
  contenu?: TypeMenu;
}

function Menu({ innerRef, oninput, onBlur, children, contenu }: MenuProps) {
  const { Content, Clavier } = oninput;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === " " || e.code === "Space") {
      e.preventDefault();
      e.stopPropagation();
      if (document.queryCommandSupported("insertText")) {
        document.execCommand("insertText", false, " ");
      } else {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
          const range = sel.getRangeAt(0);
          range.deleteContents();
          range.insertNode(document.createTextNode(" "));
          range.collapse(false);
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
      return;
    }
    Clavier(e as unknown as React.KeyboardEvent<HTMLDivElement>);
  };

  return (
    <details>
      <summary
        ref={innerRef}
        data-placeholder="Menu"
        contentEditable="true"
        suppressContentEditableWarning={true}
        onPointerDown={(e: any) => {
          e.preventDefault();
          e.currentTarget.focus();
        }}
        onInput={(e: any) => {
          handleInput(e);
          Content(e);
        }}
        onBlur={(e: any) => onBlur?.(e.currentTarget.innerText)}
        onKeyDown={handleKeyDown}
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
