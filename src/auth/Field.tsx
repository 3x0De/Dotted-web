import { useState } from "react";

import eyeVisible from "../assets/Img/Fields/eyeVisible.svg";
import eyeInvisible from "../assets/Img/Fields/eyeInvisible.svg";

import "../styles/auth/Field.scss";

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
    <div className="input">
      <label htmlFor={htmlFor}>{children}</label>
      {type === "password" ? (
        <div>
          <input
            type={eye ? "text" : "password"}
            name={htmlFor}
            id={htmlFor}
            value={val}
            onChange={change}
            required
          />
          <img
            src={eye ? eyeVisible : eyeInvisible}
            onClick={() => eyeState(!eye)}
          />
        </div>
      ) : (
        <input
          type={type}
          name={htmlFor}
          id={htmlFor}
          value={val}
          onChange={change}
          required
        />
      )}
    </div>
  );
}

export default Field;
