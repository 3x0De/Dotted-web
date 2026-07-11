import type { MakeState } from "../../types/Set";

import useFolder from "../../hooks/useFolder";

import "/src/styles/main/Page/MenuIcons.scss";

function MenuIcons({
  seticonPath,
}: {
  seticonPath: MakeState<string | undefined>;
}) {
  const { courant } = useFolder("/src/assets/Icons");

  async function sendIcon(path: string) {
    await fetch(`${import.meta.env.VITE_API_URL}${window.location.pathname}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: "icon", nouveau: path }),
    });

    seticonPath(path);
  }

  return (
    <nav>
      <div className="bin" onClick={() => seticonPath(undefined)}>
        <img src="/src/assets/Img/Page/Block/bin.svg" />
      </div>
      {courant?.inside?.map(
        (el) =>
          typeof el == "object" && (
            <div key={el.name}>
              <h1>{el.name}</h1>
              <div>
                {el.inside?.map(
                  (elt) =>
                    typeof elt == "string" && (
                      <img
                        src={`/src/assets/Icons/${el.name}/${elt}`}
                        key={elt}
                        onClick={() =>
                          sendIcon(`/src/assets/Icons/${el.name}/${elt}`)
                        }
                      />
                    ),
                )}
              </div>
            </div>
          ),
      )}
    </nav>
  );
}

export default MenuIcons;
