import { useNavigate } from "react-router-dom";

import logo from "/public/Icons/logo_max.svg";

import "../styles/error/Error.scss";

function Error({ msg }: { msg: string }) {
  const navigate = useNavigate();

  return (
    <div id="Error">
      <div className="logos">
        <div>
          <h1>Dotted</h1>
          <h2>Let's make point</h2>
        </div>
        <img src={logo} />
      </div>
      <h1>{msg}</h1>
      <div className="bouttons">
        <button>Aller a l'accueil</button>
        <button onClick={() => navigate("/login")}>Se connecter</button>
      </div>
    </div>
  );
}

export default Error;
