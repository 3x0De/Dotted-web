import { Text } from "./Text";
import "./styles/Titres.scss";

function Titre({ Size }: { Size: string }) {
  return <Text placeholder={"Titre..."} ClassName={Size} />;
}

function H1() {
  return <Titre Size={"h1"} />;
}

function H2() {
  return <Titre Size={"h2"} />;
}

function H3() {
  return <Titre Size={"h3"} />;
}

function H4() {
  return <Titre Size={"h4"} />;
}

function H5() {
  return <Titre Size={"h5"} />;
}

function H6() {
  return <Titre Size={"h6"} />;
}

const Titres = { H1, H2, H3, H4, H5, H6 };
export default Titres;
