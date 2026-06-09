import { useState } from "react";
import eyeVisible from "../assets/Image/Form/eyeVisible.svg";
import eyeInvisible from "../assets/Image/Form/eyeInvisible.svg";

function Field({
  htmlFor,
  children,
  type,
  val,
  change,
}: {
  htmlFor: string;
  children?: string;
  type: string;
  val: string;
  change: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const [eye, eyeState] = useState<boolean>(false);

  return (
    <div>
      <label htmlFor={htmlFor}>{children}</label>
      {type === "password" ? (
        <>
          <input
            type={eye ? "password" : "text"}
            name={htmlFor}
            id={htmlFor}
            value={val}
            onChange={change}
            required
          />
          <img
            src={eye ? eyeVisible : eyeInvisible}
            onClick={() => eyeState(!eye)}
            style={{ height: "1rem" }}
          />
        </>
      ) : (
        <>
          <input
            type={type}
            name={htmlFor}
            id={htmlFor}
            value={val}
            onChange={change}
            required
          />
        </>
      )}
    </div>
  );
}

function SignUp() {
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
        <button id="submit">Envoyer</button>
      </div>
    </form>
  );
}

export default SignUp;
