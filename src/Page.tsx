import { STATE } from "./types/menu";
import Wrapper from "./Wrapper";
import "./styles/Page.scss";

function Page() {
  return (
    <div id="Page">
      <Header />
      <Wrapper
        init={{
          id: 0,
          type: STATE.col,
          content: [
            { id: Math.random(), type: STATE.h1, content: "1" },
            { id: Math.random(), type: STATE.h1, content: "2" },
            {
              id: Math.random(),
              type: STATE.row,
              content: [
                {
                  id: Math.random(),
                  type: STATE.col,
                  content: [
                    { id: Math.random(), type: STATE.h1, content: "1" },
                    { id: Math.random(), type: STATE.h1, content: "2" },
                  ],
                },
                {
                  id: Math.random(),
                  type: STATE.col,
                  content: [
                    { id: Math.random(), type: STATE.h1, content: "1" },
                  ],
                },
              ],
            },
          ],
        }}
      />
    </div>
  );
}

function Header() {
  return (
    <header>
      <div
        id="Banniere"
        style={
          {
            "--Baniere-Image": `url('/Icons/logo_max.svg')`,
          } as React.CSSProperties
        }
      />
      <input id="Titre" type="text" placeholder="Nouvelle page..." />
      <div
        id="Icon"
        style={
          {
            "--Icon-Image": `url('/Icons/logo_mini.svg')`,
          } as React.CSSProperties
        }
      />
    </header>
  );
}

export default Page;
