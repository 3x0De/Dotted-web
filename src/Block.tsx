import { useState } from "react";
import Titres from "./Titres";
import { Text } from "./Text";
import bin from "./assets/Img/bin.svg";
import drag from "./assets/Img/drag.svg";
import "./styles/Block.scss";
import { createPortal } from "react-dom";
import { type MakeState } from "./types/Set";
import { STATE, menu, type TYPE } from "./types/menu";

function Block({
  children: content,
  onChange,
  onKeyDown,
  type,
  settype,
}: {
  children: string;
  onChange: MakeState<React.ChangeEvent<HTMLInputElement>>;
  onKeyDown: MakeState<React.KeyboardEvent<HTMLInputElement>>;
  type: TYPE;
  settype: MakeState<TYPE>;
}) {
  const [showMenu, setshowMenu] = useState<boolean>(false);

  return (
    <div className="Block">
      <div>
        <img src={bin} />
      </div>
      <div>
        <img src={drag} onClick={() => setshowMenu((prev) => !prev)} />
      </div>
      <Contenu type={type} onChange={onChange} onKeyDown={onKeyDown}>
        {content}
      </Contenu>
      {showMenu && createPortal(<Menu settype={settype} />, document.body)}
    </div>
  );
}

function Contenu({
  type,
  children: content,
  onChange,
  onKeyDown,
}: {
  type: TYPE;
  children: string;
  onChange: MakeState<React.ChangeEvent<HTMLInputElement>>;
  onKeyDown: MakeState<React.KeyboardEvent<HTMLInputElement>>;
}) {
  return type == STATE.h1 ? (
    <Titres.H1 onChange={onChange} onKeyDown={onKeyDown}>
      {content}
    </Titres.H1>
  ) : type == STATE.h2 ? (
    <Titres.H2 onChange={onChange} onKeyDown={onKeyDown}>
      {content}
    </Titres.H2>
  ) : type == STATE.h3 ? (
    <Titres.H3 onChange={onChange} onKeyDown={onKeyDown}>
      {content}
    </Titres.H3>
  ) : type == STATE.h4 ? (
    <Titres.H4 onChange={onChange} onKeyDown={onKeyDown}>
      {content}
    </Titres.H4>
  ) : type == STATE.h5 ? (
    <Titres.H5 onChange={onChange} onKeyDown={onKeyDown}>
      {content}
    </Titres.H5>
  ) : type == STATE.h6 ? (
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

function Menu({ settype }: { settype: MakeState<TYPE> }) {
  return (
    <div id="Menu">
      <ul>
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
