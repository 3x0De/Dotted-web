import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useHeader } from "../../hooks/useHeader";

import "/src/styles/main/Header/Header.scss";

import add from "/src/assets/Img/Header/Add.svg";
import logo from "/Icons/logo_max.svg";
import left from "/src/assets/Img/Header/LeftDoubleArrow.svg";
import right from "/src/assets/Img/Header/RightDoubleArrow.svg";

function Header() {
  const navigate = useNavigate();

  const { header: collection, setInput, setVisibilite, addPage } = useHeader();

  const [visible, setvisible] = useState<boolean>(true);

  const [bonjour, setbonjour] = useState<string>("eeee");

  useEffect(() => {
    async function handleBonjour() {
      const request = await fetch(
        `${import.meta.env.VITE_API_URL}/User/bonjour`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = await request.json();

      if (request.status === 404) navigate("/404");
      else setbonjour(data.message);
    }

    handleBonjour();
  }, []);

  async function diconnect() {
    await fetch(`${import.meta.env.VITE_API_URL}/User/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    navigate("/login");
  }

  return (
    <div id="Header" style={{ minWidth: visible ? "25vw" : "10px" }}>
      {visible && (
        <>
          <a href="#">
            <img src={logo} />
          </a>
          <h1>{bonjour}</h1>
          <span>Projets</span>
          <ul>
            {collection[0].Projets.map((el, idx) => (
              <li key={idx}>
                <input
                  type="text"
                  value={el.title}
                  placeholder="Nom du Projet..."
                  onChange={(e) => setInput(e.target.value, el.lien.slice(6))}
                />
                <a href={el.lien}>
                  <img src={el.icon ? el.icon : "/Icons/logo_mini.svg"} />
                </a>
              </li>
            ))}
            <li onClick={() => addPage(false)}>
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
                      onChange={(e) =>
                        setInput(e.target.value, el.lien.slice(6), true)
                      }
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
          <button onClick={diconnect}>Se déconnecter</button>
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
