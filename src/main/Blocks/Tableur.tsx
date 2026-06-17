import { HotTable } from "@handsontable/react";
import { HyperFormula } from "hyperformula";
import { registerAllModules } from "handsontable/registry";

import "handsontable/styles/handsontable.css";
import "handsontable/styles/ht-theme-main.css";

import "../../Styles/main/Blocks/Tableur.scss";
import { useState } from "react";

registerAllModules();

function Tableur({ content }: { content?: any }) {
  const [lignes, setLignes] = useState<number>(2);
  const [colonnes, setColonnes] = useState<number>(2);

  return content ? (
    <div className="spreadsheet-container">
      <HotTable
        data={[
          [10, 2],
          [20, 2],
          ["=A1+A2", "=B1+B2"],
        ]}
        formulas={{
          engine: HyperFormula,
        }}
        themeName="ht-theme-main"
        rowHeaders
        colHeaders
        height="auto"
        width="100%"
        stretchH="all"
        licenseKey="non-commercial-and-evaluation"
        manualRowResize={false}
        manualColumnResize={false}
      />
    </div>
  ) : (
    <form className="tableur">
      <div>
        <label htmlFor="Lignes">Lignes : {lignes}</label>
        <input
          type="range"
          min="1"
          max="10"
          defaultValue={2}
          name="Lignes"
          onChange={(e) => setLignes(e.target.valueAsNumber)}
        />
      </div>
      <div>
        <label htmlFor="Colonnes">Colonnes : {colonnes}</label>
        <input
          type="range"
          min="1"
          max="10"
          defaultValue={2}
          name="Lignes"
          onChange={(e) => setColonnes(e.target.valueAsNumber)}
        />
      </div>
      <div>
        <label htmlFor="raw">Entêtes des lignes : </label>
        <input type="checkbox" name="raw" />
      </div>
      <div>
        <label htmlFor="col">Entêtes des lignes : </label>
        <input type="checkbox" name="col" />
      </div>
      <button>Créer le tableau</button>
    </form>
  );
}

export default Tableur;
