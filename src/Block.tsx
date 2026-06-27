import { useState } from "react";
import Titres from "./Titres";
import { Text } from "./Text";
import bin from "./assets/Img/bin.svg";
import drag from "./assets/Img/drag.svg";
import "./styles/Block.scss";

const enum STATE {
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
}

function Block() {
  const [type, settype] = useState<STATE | null>(null);

  return (
    <div className="Block">
      <img src={bin} />
      <img src={drag} />
      {type == STATE.h1 ? (
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
      )}
    </div>
  );
}

export default Block;
