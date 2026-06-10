import Wrapper from "./Wrapper";
import Header from "./Header";
import "./Styles/App.scss";
import { useEffect, useState, Fragment } from "react";

function App() {
  const [path, pathState] = useState<{ nom: string; path: number }[]>([]);

  async function fetchPath() {
    const response = await fetch(
      "http://localhost:8000/Path" + window.location.pathname,
    );
    const data = await response.json();
    pathState(data.reverse());
  }

  useEffect(() => {
    fetchPath();
  }, []);

  return (
    <div id="App">
      <Header></Header>
      <div id="Right">
        <h2>
          {path.map((el, index) => {
            return (
              <Fragment key={el.path}>
                <a href={"/" + String(el.path)}>{el.nom}</a>
                {index + 1 != path.length ? "/" : ""}
              </Fragment>
            );
          })}
        </h2>
        <Wrapper></Wrapper>
      </div>
    </div>
  );
}

export default App;
