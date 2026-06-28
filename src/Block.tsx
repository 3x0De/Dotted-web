import { useEffect, useState } from "react";
import Titres from "./Titres";
import { Text } from "./Text";
import bin from "./assets/Img/bin.svg";
import drag from "./assets/Img/drag.svg";
import "./styles/Block.scss";
import { createPortal } from "react-dom";

const enum STATE {
  h1 = "Titre 1",
  h2 = "Titre 2",
  h3 = "Titre 3",
  h4 = "Titre 4",
  h5 = "Titre 5",
  h6 = "Titre 6",
}

type MenuEntry = [keyof typeof STATE, STATE];

const menu: MenuEntry[] = [
  ["h1", STATE.h1],
  ["h2", STATE.h2],
  ["h3", STATE.h3],
  ["h4", STATE.h4],
  ["h5", STATE.h5],
  ["h6", STATE.h6],
];

function Block() {
  const [type, settype] = useState<STATE | null>(null);
  const [showMenu, setshowMenu] = useState<boolean>(false);

  useEffect(() => {
    document
      .getElementById("Menu")
      ?.addEventListener("mouseleave", () => setshowMenu(false));

    return document
      .getElementById("Menu")
      ?.removeEventListener("mouseleave", () => setshowMenu(false));
  }, [showMenu]);

  return (
    <div className="Block">
      <div>
        <img src={bin} />
      </div>
      <div>
        <img src={drag} onClick={() => setshowMenu((prev) => !prev)} />
      </div>
      <Contenu type={type} />
      {showMenu && createPortal(<Menu settype={settype} />, document.body)}
    </div>
  );
}

function Contenu({ type }: { type: STATE | null }) {
  return type == STATE.h1 ? (
    <Titres.H1 />
  ) : type == STATE.h2 ? (
    <Titres.H2 />
  ) : type == STATE.h3 ? (
    <Titres.H3 />
  ) : type == STATE.h4 ? (
    <Titres.H4 />
  ) : type == STATE.h5 ? (
    <Titres.H5 />
  ) : type == STATE.h6 ? (
    <Titres.H6 />
  ) : (
    <Text placeholder='Appuyez sur "/" pour afficher les commandes' />
  );
}

function Menu({ settype }: { settype: (e: STATE | null) => void }) {
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
