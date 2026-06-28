import { useContent } from "./hooks/Content";
import Block from "./Block";
import { useState } from "react";
import { type TYPE } from "./types/menu";

function App() {
  const [type, settype] = useState<TYPE>(null);
  const [contenu, setcontenu, setKeyDown] = useContent(settype);

  return (
    <>
      <Block
        onChange={setcontenu}
        onKeyDown={setKeyDown}
        type={type}
        settype={settype}
      >
        {contenu}
      </Block>
    </>
  );
}

export default App;
