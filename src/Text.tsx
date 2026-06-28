import { useEffect, useRef } from "react";
import "./styles/Texte.scss";
import type { MakeState } from "./types/Set";

export function Text({
  placeholder,
  ClassName,
  children: content = "",
  onChange,
  onKeyDown,
}: {
  placeholder?: string;
  ClassName?: string;
  children: string;
  onChange: MakeState<React.ChangeEvent<HTMLInputElement>>;
  onKeyDown?: MakeState<React.KeyboardEvent<HTMLInputElement>>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [content]);

  return (
    <input
      ref={inputRef}
      placeholder={placeholder}
      type="text"
      className={`inputText ${ClassName}`}
      value={content}
      onChange={onChange}
      onKeyDown={onKeyDown}
    />
  );
}
