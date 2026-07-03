import useFolder from "./hooks/useFolder";
import "./styles/MenuIcons.scss";
import type { MakeState } from "./types/Set";

function MenuIcons({
  seticonPath,
}: {
  seticonPath: MakeState<string | undefined>;
}) {
  const { courant } = useFolder("/src/assets/Icons");

  return (
    <nav>
      <div className="bin" onClick={() => seticonPath(undefined)}>
        <img src="/src/assets/Img/bin.svg" />
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
                          seticonPath(`/src/assets/Icons/${el.name}/${elt}`)
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
