import { useState } from "react";
import "./Styles/form/form.scss";
import eyeVisible from "./assets/Image/Form/eyeVisible.svg";
import eyeInvisible from "./assets/Image/Form/eyeInvisible.svg";

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
            style={{ height: "1rem", cursor: "pointer" }}
          />
        </div>
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

export default Field;
