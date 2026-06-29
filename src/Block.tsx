import { useState } from "react";
import Titres from "./Titres";
import { Text } from "./Text";
import bin from "./assets/Img/bin.svg";
import drag from "./assets/Img/drag.svg";
import "./styles/Block.scss";
import { createPortal } from "react-dom";
import { type MakeState } from "./types/Set";
import { STATE, menu, type TYPE } from "./types/menu";
import type { EditorState, TextBlock } from "./types/Wrapper";

function Block({
  onChange,
  onKeyDown,
  children: content,
  settype,
  onAddItem,
  onRemoveItem,
}: {
  onChange: (e: React.ChangeEvent<HTMLInputElement>, id: number) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, id: number) => void;
  children: EditorState;
  settype: MakeState<{ newType: TYPE; targetId: number }>;
  onAddItem: MakeState<number>;
  onRemoveItem: MakeState<number>;
}) {
  const [showMenu, setshowMenu] = useState<boolean>(false);

  return (
    <div className={`Block ${content.type == STATE.col ? "Colonne" : ""}`}>
      {content.type === STATE.col ? (
        content.content.map((e: EditorState) => {
          return (
            <Block
              key={e.id}
              onChange={onChange}
              onKeyDown={onKeyDown}
              settype={settype}
              onAddItem={onAddItem}
              onRemoveItem={onRemoveItem}
            >
              {e}
            </Block>
          );
        })
      ) : (
        <>
          <div>
            <img src={bin} alt="Delete" />
          </div>
          <div>
            <img src={drag} onClick={() => setshowMenu((prev) => !prev)} />
          </div>
          <Contenu
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
}

function Contenu({
  children: contenu,
  onChange,
  onKeyDown,
}: {
  children: TextBlock;
  onChange: MakeState<React.ChangeEvent<HTMLInputElement>>;
  onKeyDown: MakeState<React.KeyboardEvent<HTMLInputElement>>;
}) {
  const { type, content } = contenu;

  return type === STATE.h1 ? (
    <Titres.H1 onChange={onChange} onKeyDown={onKeyDown}>
      {content}
    </Titres.H1>
  ) : type === STATE.h2 ? (
    <Titres.H2 onChange={onChange} onKeyDown={onKeyDown}>
      {content}
    </Titres.H2>
  ) : type === STATE.h3 ? (
    <Titres.H3 onChange={onChange} onKeyDown={onKeyDown}>
      {content}
    </Titres.H3>
  ) : type === STATE.h4 ? (
    <Titres.H4 onChange={onChange} onKeyDown={onKeyDown}>
      {content}
    </Titres.H4>
  ) : type === STATE.h5 ? (
    <Titres.H5 onChange={onChange} onKeyDown={onKeyDown}>
      {content}
    </Titres.H5>
  ) : type === STATE.h6 ? (
    <Titres.H6 onChange={onChange} onKeyDown={onKeyDown}>
      {content}
    </Titres.H6>
  ) : (
    <Text
      placeholder='Appuyez sur "/" pour afficher les commandes'
      onChange={onChange}
      onKeyDown={onKeyDown}
    >
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
        {menu.map(([key, value]) => {
          return (
            <li
              key={key}
              onClick={() => settype(value)}
              style={{
                listStyle: `url('/../src/assets/Img/${key}.svg')`,
              }}
            >
              {value}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Block;
