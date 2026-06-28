import { Text } from "./Text";
import "./styles/Titres.scss";
import type { MakeState } from "./types/Set";

function Titre({
  Size,
  children: content,
  onChange,
  onKeyDown,
}: {
  Size: string;
  children: string;
  onChange: MakeState<React.ChangeEvent<HTMLInputElement>>;
  onKeyDown?: MakeState<React.KeyboardEvent<HTMLInputElement>>;
}) {
  return (
    <Text
      placeholder={"Titre..."}
      ClassName={Size}
      onChange={onChange}
      onKeyDown={onKeyDown}
    >
      {content}
    </Text>
  );
}

function H1({
  children: content,
  onChange,
  onKeyDown,
}: {
  children: string;
  onChange: MakeState<React.ChangeEvent<HTMLInputElement>>;
  onKeyDown?: MakeState<React.KeyboardEvent<HTMLInputElement>>;
}) {
  return (
    <Titre Size={"h1"} onChange={onChange} onKeyDown={onKeyDown}>
      {content}
    </Titre>
  );
}

function H2({
  children: content,
  onChange,
  onKeyDown,
}: {
  children: string;
  onChange: MakeState<React.ChangeEvent<HTMLInputElement>>;
  onKeyDown?: MakeState<React.KeyboardEvent<HTMLInputElement>>;
}) {
  return (
    <Titre Size={"h2"} onChange={onChange} onKeyDown={onKeyDown}>
      {content}
    </Titre>
  );
}

function H3({
  children: content,
  onChange,
  onKeyDown,
}: {
  children: string;
  onChange: MakeState<React.ChangeEvent<HTMLInputElement>>;
  onKeyDown?: MakeState<React.KeyboardEvent<HTMLInputElement>>;
}) {
  return (
    <Titre Size={"h3"} onChange={onChange} onKeyDown={onKeyDown}>
      {content}
    </Titre>
  );
}

function H4({
  children: content,
  onChange,
  onKeyDown,
}: {
  children: string;
  onChange: MakeState<React.ChangeEvent<HTMLInputElement>>;
  onKeyDown?: MakeState<React.KeyboardEvent<HTMLInputElement>>;
}) {
  return (
    <Titre Size={"h4"} onChange={onChange} onKeyDown={onKeyDown}>
      {content}
    </Titre>
  );
}

function H5({
  children: content,
  onChange,
  onKeyDown,
}: {
  children: string;
  onChange: MakeState<React.ChangeEvent<HTMLInputElement>>;
  onKeyDown?: MakeState<React.KeyboardEvent<HTMLInputElement>>;
}) {
  return (
    <Titre Size={"h5"} onChange={onChange} onKeyDown={onKeyDown}>
      {content}
    </Titre>
  );
}

function H6({
  children: content,
  onChange,
  onKeyDown,
}: {
  children: string;
  onChange: MakeState<React.ChangeEvent<HTMLInputElement>>;
  onKeyDown?: MakeState<React.KeyboardEvent<HTMLInputElement>>;
}) {
  return (
    <Titre Size={"h6"} onChange={onChange} onKeyDown={onKeyDown}>
      {content}
    </Titre>
  );
}

const Titres = { H1, H2, H3, H4, H5, H6 };
export default Titres;
