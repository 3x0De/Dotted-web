import { useEffect, useRef, useState } from "react";
import "./styles/Texte.scss";
import type { MakeState } from "./types/Set";

export function Text({
  placeholder,
  ClassName,
  children: content = "",
  onChange,
  onKeyDown,
  registerRef,
}: {
  placeholder?: string;
  ClassName?: string;
  children: string;
  onChange: MakeState<React.ChangeEvent<HTMLInputElement>>;
  onKeyDown?: MakeState<React.KeyboardEvent<HTMLInputElement>>;
  registerRef?: (el: HTMLInputElement | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setfocused] = useState<boolean>(false);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [content]);

  return (
    <input
      ref={(el) => {
        inputRef.current = el;
        registerRef?.(el);
      }}
      placeholder={focused ? placeholder : ""}
      onFocus={() => setfocused(true)}
      onBlur={() => setfocused(false)}
      type="text"
      className={`inputText ${ClassName}`}
      value={content}
      onChange={onChange}
      onKeyDown={onKeyDown}
    />
  );
}
