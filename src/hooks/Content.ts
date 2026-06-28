import { useState, type ChangeEvent, type KeyboardEvent } from "react";
import type { MakeState } from "../types/Set";
import { STATE, type TYPE } from "../types/menu";

export function useContent(settype: MakeState<TYPE>, init: string = "") {
  const [content, setcontent] = useState<string>(init);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "" && content !== "") {
      settype(null);
    }
    if (/^#{1,6}\s/.test(val)) {
      if (/^#\s/.test(val)) settype(STATE.h1);
      if (/^#{2}\s/.test(val)) settype(STATE.h2);
      if (/^#{3}\s/.test(val)) settype(STATE.h3);
      if (/^#{4}\s/.test(val)) settype(STATE.h4);
      if (/^#{5}\s/.test(val)) settype(STATE.h5);
      if (/^#{6}\s/.test(val)) settype(STATE.h6);

      const cleanText = val.replace(/^#{1,6}\s/, "");
      setcontent(cleanText);
    } else {
      setcontent(val);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Backspace") return;

    if (content === "") {
      settype(null);
    }
  };

  return [content, handleChange, handleKeyDown] as [
    string,
    MakeState<ChangeEvent<HTMLInputElement>>,
    MakeState<KeyboardEvent<HTMLInputElement>>,
  ];
}
