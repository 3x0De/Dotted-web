import { useState } from "react";

import Field from "./Field";

import logo from "/public/Icons/logo_max.svg";

import "../styles/auth/Login.scss";

function Login() {
  const [formInput, formInputState] = useState<{ name: string; mdp: string }>({
    name: "",
    mdp: "",
  });
  const [error, errorState] = useState<boolean>(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.name;
    const value = e.target.value;
    formInputState((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div className="Auth">
      <div className="logos">
        <div>
          <h1>Dotted</h1>
          <h2>Let's make point</h2>
        </div>
        <img src={logo} />
      </div>
      <h1>Log In</h1>
      {error && <span>Mauvais mot de passe ou mauvais nom d'utilisateur</span>}
      <form>
        <Field
          htmlFor="name"
          type="text"
          val={formInput.name}
          change={handleChange}
        >
          Nom :
        </Field>
        <Field
          htmlFor="mdp"
          type="password"
          val={formInput.mdp}
          change={handleChange}
        >
          Mot de passe :
        </Field>
        <div>
          <button id="submit">Se connecter</button>
          <button>Créer un compte</button>
        </div>
      </form>
    </div>
  );
}

export default Login;
