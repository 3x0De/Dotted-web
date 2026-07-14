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

function Tableau() {
  const [content, setcontent] = useState<TableauType>({
    entete: [],
    Pages: [],
  });

  return (
    <div className="Tableau">
      <table>
        <thead>
          <tr>
            <th>
              <div className="propriete">
                <img src={page} />
                Page
              </div>
            </th>
            {content.entete.map((el) => (
              <th>
                <div className="propriete">
                  <img src={el.type == DataTypeTableau.Text ? Texte : Texte} />
                  <Text
                    onChange={(
                      e: React.ChangeEvent<HTMLInputElement, Element>,
                    ) => console.log(e)}
                  >
                    {el.nom}
                  </Text>
                </div>
              </th>
            ))}
            <th>
              <button
                onClick={() =>
                  setcontent((prev) => {
                    return {
                      ...prev,
                      entete: [
                        ...prev.entete,
                        { type: DataTypeTableau.Text, nom: "Data 2" },
                      ],
                    };
                  })
                }
              >
                <img src={Add} alt="" /> Ajouter une propriété
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {content.Pages.map((el, idx) => (
            <tr>
              <td>
                <div className="title">
                  <button>
                    <img
                      src={bin}
                      onClick={() =>
                        setcontent((prev) => ({
                          ...prev,
                          Pages: prev.Pages.filter((e, i) => i !== idx),
                        }))
                      }
                    />
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

              {content.entete.map((e) => (
                <td>
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
                  setcontent((prev) => {
                    return { ...prev, Pages: [...prev.Pages, "Titrce 6"] };
                  })
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
