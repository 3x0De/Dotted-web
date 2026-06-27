import "./styles/Texte.scss";

export function Text({
  placeholder,
  ClassName,
}: {
  placeholder?: string;
  ClassName?: string;
}) {
  return (
    <input
      placeholder={placeholder}
      type="text"
      className={`inputText ${ClassName}`}
    />
  );
}
