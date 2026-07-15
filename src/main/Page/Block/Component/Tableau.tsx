import "../../../../styles/main/Page/Block/Component/Tableau.scss";
import { Text } from "./ComponentDeBase/Text";
import Add from "../../../../assets/Img/Page/Block/Tableau/Add.svg";
import bin from "../../../../assets/Img/Page/Block/Tableau/bin.svg";
import page from "../../../../assets/Img/Page/Block/Tableau/Page.svg";
import Texte from "../../../../assets/Img/Page/Block/Tableau/Categories/text.svg";
import { useState } from "react";
import {
  DataTypeTableau,
  type TableauType,
} from "../../../../types/MainTypes/BlockTypes/Tableau";
import type React from "react";
import type { MakeState } from "../../../../types/Set";

function Tableau({
  children,
  onChange,
  registerRef,
}: {
  children: TableauType;
  onChange: MakeState<React.ChangeEvent<HTMLInputElement>>;
  registerRef?: (el: HTMLInputElement | null) => void;
}) {
  const [content, setcontent] = useState<TableauType>(children);

  function handleChange(param: any) {
    onChange({
      target: {
        value: param,
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>);
    return param;
  }

  return (
    <div className="Tableau" ref={registerRef}>
      <table>
        <thead>
          <tr>
            <th>
              <div className="propriete">
                <img src={page} />
                Page
              </div>
            </th>
            {content.entete.map((el, id) => (
              <th key={id}>
                <div className="propriete">
                  <img src={el.type == DataTypeTableau.Text ? Texte : Texte} />
                  <Text
                    onChange={(
                      e: React.ChangeEvent<HTMLInputElement, Element>,
                    ) =>
                      setcontent((prev) =>
                        handleChange({
                          ...prev,
                          entete: prev.entete.map((elt, i) =>
                            i === id ? { ...elt, nom: e.target.value } : elt,
                          ),
                        }),
                      )
                    }
                  >
                    {el.nom}
                  </Text>
                </div>
              </th>
            ))}
            <th>
              <button
                onClick={() =>
                  setcontent((prev) =>
                    handleChange({
                      ...prev,
                      entete: [
                        ...prev.entete,
                        { type: DataTypeTableau.Text, nom: "Propriété" },
                      ],
                    }),
                  )
                }
              >
                <img src={Add} alt="" /> Ajouter une propriété
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {content.Pages.map((el, idx) => (
            <tr key={idx}>
              <td>
                <div className="title">
                  <button
                    onClick={() =>
                      setcontent((prev) =>
                        handleChange({
                          ...prev,
                          Pages: prev.Pages.filter((_, i) => i !== idx),
                        }),
                      )
                    }
                  >
                    <img src={bin} />
                  </button>
                  <Text
                    placeholder="Titre..."
                    onChange={(
                      e: React.ChangeEvent<HTMLInputElement, Element>,
                    ) => console.log(e)}
                  >
                    {el}
                  </Text>
                  <a href={el}>
                    <img src={el} />
                  </a>
                </div>
              </td>

              {content.entete.map((e, i) => (
                <td key={i}>
                  <Text
                    placeholder={e.nom}
                    onChange={(
                      e: React.ChangeEvent<HTMLInputElement, Element>,
                    ) => console.log(e)}
                  >
                    {""}
                  </Text>
                </td>
              ))}

              <td></td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={content.entete.length + 2}>
              <button
                onClick={() =>
                  setcontent((prev) =>
                    handleChange({ ...prev, Pages: [...prev.Pages, ""] }),
                  )
                }
              >
                <img src={Add} alt="" /> Ajouter une page
              </button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default Tableau;
