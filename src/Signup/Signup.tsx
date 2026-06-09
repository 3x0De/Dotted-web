import { useState } from "react";
import Field from "../Form";
import logo from "/Logos/Dotted_full.svg";
function SignUp() {
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

  async function submitInfo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const response = await fetch(
      "http://localhost:8000/signUp?Nom=" +
        formInput.name +
        "&Mdp=" +
        formInput.mdp,
    );

    if (response.ok) {
      window.location.href = "/1";
    } else {
      console.table(formInput);
      formInputState({ name: formInput.name, mdp: "" });
      errorState(true);
    }
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
      <h1>Sign Up</h1>
      {error && <span>Ce nom est déjà pris</span>}
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
          <button id="submit">S'inscrire</button>
          <button onClick={() => (window.location.href = "/logIn")}>
            J'ai déjà un compte
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
