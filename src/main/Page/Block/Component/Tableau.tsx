import "../../../../styles/main/Page/Block/Component/Tableau.scss";
import { Text } from "./ComponentDeBase/Text";
import Add from "../../../../assets/Img/Page/Block/Tableau/Add.svg";
import bin from "../../../../assets/Img/Page/Block/Tableau/bin.svg";
import page from "../../../../assets/Img/Page/Block/Tableau/Page.svg";
import Texte from "../../../../assets/Img/Page/Block/Tableau/Categories/text.svg";

function Tableau() {
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
            <th>
              <div className="propriete">
                <img src={Texte} />
                <Text
                  onChange={(e: React.ChangeEvent<HTMLInputElement, Element>) =>
                    console.log(e)
                  }
                >
                  Propriete
                </Text>
              </div>
            </th>
            <th>
              <button>
                <img src={Add} alt="" /> Ajouter une propriété
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div className="title">
                <button>
                  <img src={bin} />
                </button>
                <Text
                  placeholder="Titre..."
                  onChange={(e: React.ChangeEvent<HTMLInputElement, Element>) =>
                    console.log(e)
                  }
                >
                  Page 1
                </Text>
                <a href="">
                  <img src="/Icons/logo_mini.svg" />
                </a>
              </div>
            </td>
            <td>
              <Text
                placeholder="Propriete"
                onChange={(e: React.ChangeEvent<HTMLInputElement, Element>) =>
                  console.log(e)
                }
              >
                {""}
              </Text>
            </td>
            <td></td>
          </tr>
          <tr>
            <td>
              <div className="title">
                <button>
                  <img src={bin} />
                </button>
                <Text
                  placeholder="Titre..."
                  onChange={(e: React.ChangeEvent<HTMLInputElement, Element>) =>
                    console.log(e)
                  }
                >
                  Page 2
                </Text>
                <a href="">
                  <img src="/Icons/logo_mini.svg" />
                </a>
              </div>
            </td>
            <td>
              <Text
                placeholder="Propriete"
                onChange={(e: React.ChangeEvent<HTMLInputElement, Element>) =>
                  console.log(e)
                }
              >
                Page 2
              </Text>
            </td>
            <td></td>
          </tr>
          <tr>
            <td>
              <div className="title">
                <button>
                  <img src={bin} />
                </button>
                <Text
                  placeholder="Titre..."
                  onChange={(e: React.ChangeEvent<HTMLInputElement, Element>) =>
                    console.log(e)
                  }
                >
                  {""}
                </Text>
                <a href="">
                  <img src="/Icons/logo_mini.svg" />
                </a>
              </div>
            </td>
            <td>
              <Text
                placeholder="Propriete"
                onChange={(e: React.ChangeEvent<HTMLInputElement, Element>) =>
                  console.log(e)
                }
              >
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vero
                officia voluptatem dolorem? Ipsum, eum commodi est mollitia cum
                quidem sunt.
              </Text>
            </td>
            <td></td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3}>
              <button>
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
