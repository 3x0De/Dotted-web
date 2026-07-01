import { useState, forwardRef } from "react";
import Titres from "./Titres";
import { Text } from "./Text";
import bin from "./assets/Img/bin.svg";
import drag from "./assets/Img/drag.svg";
import "./styles/Block.scss";
import { createPortal } from "react-dom";
import { type MakeState } from "./types/Set";
import { STATE, menu, type TYPE } from "./types/menu";
import type { EditorState, TextBlock } from "./types/Wrapper";
import { useDraggable, useDroppable } from "@dnd-kit/react";

interface BlockProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>, id: number) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, id: number) => void;
  children: EditorState;
  settype: MakeState<{ newType: TYPE; targetId: number }>;
  onAddItem: MakeState<number>;
  onRemoveItem: MakeState<number>;
  registerRef: (id: number, el: HTMLInputElement | null) => void;
}

const Block = forwardRef<HTMLDivElement, BlockProps>(
  function BlockComponent(props, forwardedRef) {
    const {
      onChange,
      onKeyDown,
      children: content,
      settype,
      onAddItem,
      onRemoveItem,
      registerRef,
    } = props;

    const [showMenu, setshowMenu] = useState<boolean>(false);

    const isContainer =
      content.type === STATE.col || content.type === STATE.row;

    const { isDropTarget, ref: dropRef } = useDroppable({
      id: content.id,
      data: {
        blockId: content.id,
        type: content.type,
      },
    });

    const {
      isDragging,
      handleRef,
      ref: dragRef,
    } = useDraggable({
      id: content.id,
      data: {
        blockId: content.id,
        type: content.type,
      },
    });

    const setElementRef = (el: HTMLDivElement | null) => {
      dragRef(el);
      dropRef(el);
      if (typeof forwardedRef === "function") forwardedRef(el);
      else if (forwardedRef) forwardedRef.current = el;
    };

    return (
      <div
        ref={setElementRef}
        className={`Block ${content.type === STATE.col ? "Colonne" : ""} ${content.type === STATE.row ? "Ligne" : ""} ${isDragging ? "dragging" : ""} ${isDropTarget ? "drag-over" : ""}`}
      >
        {isContainer ? (
          content.content.map((e: EditorState) => (
            <Block
              key={e.id}
              onChange={onChange}
              onKeyDown={onKeyDown}
              settype={settype}
              onAddItem={onAddItem}
              onRemoveItem={onRemoveItem}
              registerRef={registerRef}
            >
              {e}
            </Block>
          ))
        ) : (
          <>
            <div onClick={() => onRemoveItem(content.id)}>
              <img src={bin} alt="Delete" />
            </div>
            <div
              onPointerDown={() => setshowMenu((prev) => !prev)}
              ref={handleRef}
            >
              <img src={drag} alt="Drag" />
            </div>
            <Contenu
              registerRef={(el) => registerRef(content.id, el)}
              onChange={(e) => onChange(e, content.id)}
              onKeyDown={(e) => onKeyDown(e, content.id)}
            >
              {content as TextBlock}
            </Contenu>
            {showMenu &&
              createPortal(
                <Menu
                  leave={() => setshowMenu(false)}
                  settype={(newType: TYPE) =>
                    settype({ newType, targetId: content.id })
                  }
                />,
                document.body,
              )}
          </>
        )}
      </div>
    );
  },
);

function Contenu({
  children: contenu,
  onChange,
  onKeyDown,
  registerRef,
}: {
  children: TextBlock;
  onChange: MakeState<React.ChangeEvent<HTMLInputElement>>;
  onKeyDown: MakeState<React.KeyboardEvent<HTMLInputElement>>;
  registerRef: (el: HTMLInputElement | null) => void;
}) {
  const { type, content } = contenu;

  const props = { onChange, onKeyDown, registerRef };

  return type === STATE.h1 ? (
    <Titres.H1 {...props}>{content}</Titres.H1>
  ) : type === STATE.h2 ? (
    <Titres.H2 {...props}>{content}</Titres.H2>
  ) : type === STATE.h3 ? (
    <Titres.H3 {...props}>{content}</Titres.H3>
  ) : type === STATE.h4 ? (
    <Titres.H4 {...props}>{content}</Titres.H4>
  ) : type === STATE.h5 ? (
    <Titres.H5 {...props}>{content}</Titres.H5>
  ) : type === STATE.h6 ? (
    <Titres.H6 {...props}>{content}</Titres.H6>
  ) : (
    <Text placeholder='Appuyez sur "/" pour afficher les commandes' {...props}>
      {content}
    </Text>
  );
}

function Menu({
  settype,
  leave,
}: {
  settype: MakeState<TYPE>;
  leave?: MakeState<React.MouseEvent<HTMLUListElement>>;
}) {
  return (
    <div id="Menu">
      <ul onMouseLeave={leave}>
        {menu.map(([key, value]) => (
          <li
            key={key}
            onClick={() => settype(value)}
            style={{ listStyle: `url('/../src/assets/Img/${key}.svg')` }}
          >
            {value}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Block;
