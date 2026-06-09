import "../Styles/401/401.scss";
import logo from "/Logos/Dotted_full.svg";

function Error() {
  return (
    <div id="er401">
      <div className="logos">
        <div>
          <h1>Dotted</h1>
          <h2>Let's make point</h2>
        </div>
        <img src={logo} />
      </div>
      <h1>Erreur 401 - Unauthorized</h1>
      <div className="bouttons">
        <button onClick={() => (window.location.href = "/1")}>
          Aller a l'accueil
        </button>
        <button onClick={() => (window.location.href = "/Login")}>
          Se connecter
        </button>
      </div>
    </div>
  );
}

export default Error;
