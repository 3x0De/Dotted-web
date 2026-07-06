import { useState, forwardRef } from "react";
import Titres from "./Titres";
import { Text } from "./Text";
import bin from "./assets/Img/bin.svg";
import drag from "./assets/Img/drag.svg";
import "./styles/Block.scss";
import { type MakeState } from "./types/Set";
import { STATE, menu, type TYPE } from "./types/menu";
import type {
  ColumnBlock,
  EditorState,
  RowBlock,
  TextBlock,
} from "./types/Wrapper";
import { useDraggable, useDroppable } from "@dnd-kit/react";
import Listes from "./Liste";
import SelectionMenu from "./Menu";
import Cadre from "./Cadre";
import Cite from "./Cite";
import Separateur from "./Separateur";

interface BlockProps {
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number,
    itemId?: number,
  ) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, id: number) => void;
  children: EditorState;
  settype: MakeState<{ newType: TYPE; targetId: number }>;
  onAddItem: MakeState<number>;
  onRemoveItem: MakeState<number>;
  registerRef: (id: number, el: HTMLInputElement | null) => void;
  onAddListItem: (blockId: number, afterId: number) => void;
  onRemoveListItem: (blockId: number, itemId: number) => void;
}

export const Block = forwardRef<HTMLDivElement, BlockProps>(
  function BlockComponent(props, forwardedRef) {
    const {
      onChange,
      onKeyDown,
      children: content,
      settype,
      onAddItem,
      onRemoveItem,
      registerRef,
      onAddListItem,
      onRemoveListItem,
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
              onAddListItem={onAddListItem}
              onRemoveListItem={onRemoveListItem}
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
              registerRef={registerRef}
              onChange={onChange}
              onKeyDown={onKeyDown}
              onAddListItem={onAddListItem}
              onRemoveListItem={onRemoveListItem}
              settype={settype}
              onAddItem={onAddItem}
              onRemoveItem={onRemoveItem}
            >
              {content as TextBlock}
            </Contenu>
            {showMenu && (
              <Menu
                leave={() => setshowMenu(false)}
                settype={(newType: TYPE) =>
                  settype({ newType, targetId: content.id })
                }
              />
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
  onAddListItem,
  onRemoveListItem,
  settype,
  onAddItem,
  onRemoveItem,
}: {
  children: Exclude<EditorState, RowBlock | ColumnBlock>;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number,
    itemId?: number,
  ) => void;
  onKeyDown: (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: number,
    itemId?: number,
  ) => void;
  registerRef: (id: number, el: HTMLInputElement | null) => void;
  onAddListItem?: (blockId: number, afterId: number) => void;
  onRemoveListItem?: (blockId: number, itemId: number) => void;
  settype: MakeState<{ newType: TYPE; targetId: number }>;
  onAddItem: MakeState<number>;
  onRemoveItem: MakeState<number>;
}) {
  const { id, type, content } = contenu;

  const props = {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(e, id),
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => onKeyDown(e, id),
    registerRef: (el: HTMLInputElement | null) => registerRef(id, el),
  };

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
  ) : type === STATE.ul ? (
    <Listes.Ul
      id={id}
      onChange={(e, id, itemId) => onChange(e, id, itemId)}
      onKeyDown={(e, itemId) => onKeyDown(e, id, itemId)}
      registerRef={(_, el) => registerRef(id, el)}
      onAddItem={(afterId: number) => onAddListItem?.(id, afterId)}
      onRemoveItem={(blockId: number, itemId: number) =>
        onRemoveListItem?.(blockId, itemId)
      }
    >
      {content}
    </Listes.Ul>
  ) : type === STATE.ol ? (
    <Listes.Ol
      id={id}
      onChange={(e, id, itemId) => onChange(e, id, itemId)}
      onKeyDown={(e, itemId) => onKeyDown(e, id, itemId)}
      registerRef={(_, el) => registerRef(id, el)}
      onAddItem={(afterId: number) => onAddListItem?.(id, afterId)}
      onRemoveItem={(blockId: number, itemId: number) =>
        onRemoveListItem?.(blockId, itemId)
      }
    >
      {content}
    </Listes.Ol>
  ) : type === STATE.todo ? (
    <Listes.Todo
      id={id}
      onChange={(e, id, itemId) => onChange(e, id, itemId)}
      onKeyDown={(e, itemId) => onKeyDown(e, id, itemId)}
      registerRef={(_, el) => registerRef(id, el)}
      onAddItem={(afterId: number) => onAddListItem?.(id, afterId)}
      onRemoveItem={(blockId: number, itemId: number) =>
        onRemoveListItem?.(blockId, itemId)
      }
    >
      {content.map((item) => ({
        Id: item.Id,
        contenu: item.contenu,
        state: (item as any).state ?? false,
      }))}
    </Listes.Todo>
  ) : type === STATE.menu ? (
    <SelectionMenu
      id={id}
      registerRef={registerRef}
      onChange={onChange}
      onKeyDown={onKeyDown}
      settype={settype}
      onAddItem={onAddItem}
      onRemoveItem={onRemoveItem}
      onAddListItem={onAddListItem}
      onRemoveListItem={onRemoveListItem}
    >
      {content}
    </SelectionMenu>
  ) : type === STATE.cdr ? (
    <Cadre
      id={id}
      registerRef={registerRef}
      onChange={onChange}
      onKeyDown={onKeyDown}
      settype={settype}
      onAddItem={onAddItem}
      onRemoveItem={onRemoveItem}
      onAddListItem={onAddListItem}
      onRemoveListItem={onRemoveListItem}
    >
      {content}
    </Cadre>
  ) : type === STATE.cite ? (
    <Cite {...props}>{content}</Cite>
  ) : type === STATE.sprt ? (
    <Separateur />
  ) : (
    <Text placeholder='Appuyez sur "/" pour afficher les commandes' {...props}>
      {content as string}
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
