import { useState } from "react";

import { useHeader } from "/src/hooks/useHeader";

import "/src/styles/main/Header/Header.scss";

import add from "/src/assets/Img/Header/Add.svg";
import logo from "/Icons/logo_max.svg";
import left from "/src/assets/Img/Header/LeftDoubleArrow.svg";
import right from "/src/assets/Img/Header/RightDoubleArrow.svg";

function Header() {
  const {
    header: collection,
    setInput,
    setVisibilite,
    addPage,
  } = useHeader([
    {
      Projets: [
        { icon: null, title: "z", lien: "z" },
        {
          icon: "chrome://branding/content/about-logo@2x.png",
          title: "",
          lien: "z",
        },
      ],
      visibilite: true,
    },
    {
      Projets: [
        { icon: null, title: "z", lien: "z" },
        {
          icon: "chrome://branding/content/about-logo@2x.png",
          title: "",
          lien: "z",
        },
      ],
      visibilite: false,
    },
  ]);

  const [visible, setvisible] = useState<boolean>(true);

  let userName = "MMM";

  return (
    <div id="Header" style={{ minWidth: visible ? "25vw" : "10px" }}>
      {visible && (
        <>
          <a href="#">
            <img src={logo} />
          </a>
          <h1>Bonjour {userName}</h1>
          <span>Projets</span>
          <ul>
            {collection[0].Projets.map((el, idx) => (
              <li key={idx}>
                <input
                  type="text"
                  value={el.title}
                  placeholder="Nom du Projet..."
                  onChange={(e) => setInput(e.target.value, idx)}
                />
                <a href={el.lien}>
                  <img src={el.icon ? el.icon : "/Icons/logo_mini.svg"} />
                </a>
              </li>
            ))}
            <li onClick={() => addPage()}>
              <img src={add} />
            </li>
          </ul>
          <input
            type="password"
            onChange={() => setVisibilite(!collection[1].visibilite)}
          />
          {collection[1].visibilite && (
            <>
              <span>Pr0j3ts</span>
              <ul>
                {collection[1].Projets.map((el, idx) => (
                  <li key={idx}>
                    <input
                      type="text"
                      value={el.title}
                      placeholder="N0m dU Pr0j3t..."
                      onChange={(e) => setInput(e.target.value, idx, true)}
                    />
                    <a href={el.lien}>
                      <img src={el.icon ? el.icon : "/Icons/logo_mini.svg"} />
                    </a>
                  </li>
                ))}
                <li onClick={() => addPage(true)}>
                  <img src={add} />
                </li>
              </ul>
            </>
          )}
          <button>Se déconnecter</button>
        </>
      )}
      <img
        src={visible ? left : right}
        className="DoubleArrow"
        onClick={() => setvisible((e) => !e)}
        style={{ left: visible ? "25vw" : "10px" }}
      />
    </div>
  );
}

export default Header;
