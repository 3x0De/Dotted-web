import { useState } from "react";
import Field from "../Form";
import logo from "/Logos/Dotted_full.svg";

function Login() {
  const [formInput, formInputState] = useState<{ name: string; mdp: string }>({
    name: "",
    mdp: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.name;
    const value = e.target.value;
    formInputState((prev) => ({ ...prev, [name]: value }));
  }

  function submitInfo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.table(formInput);
    formInputState({
      name: "",
      mdp: "",
    });
  }

  return (
    <div id="SignUp">
      <div className="logos">
        <div>
          <h1>Dotted</h1>
          <h2>Let's make point</h2>
        </div>
        <img src={logo} alt="" />
      </div>
      <h1>Log In</h1>
      {true && <span>Mauvais mot de passe ou mauvais nom d'utilisateur</span>}
      <form onSubmit={submitInfo}>
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
        </div>
      </form>
    </div>
  );
}

export default Login;
