import { useState } from "react";

import { useNavigate } from "react-router-dom";

import Field from "./Field";

import logo from "/public/Icons/logo_max.svg";

import "../styles/auth/Auth.scss";

function SignUp() {
  const navigate = useNavigate();

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
        <img src={logo} alt="" />
      </div>
      <h1>Sign Up</h1>
      {error && <span>Ce nom est déjà pris</span>}
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
          <button id="submit">S'inscrire</button>
          <button onClick={() => navigate("/login")}>
            J'ai déjà un compte
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
