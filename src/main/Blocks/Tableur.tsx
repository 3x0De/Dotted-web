import { HotTable } from "@handsontable/react";
import { HyperFormula } from "hyperformula";
import { registerAllModules } from "handsontable/registry";

import "handsontable/styles/handsontable.css";
import "handsontable/styles/ht-theme-main.css";

import "../../Styles/main/Blocks/Tableur.scss";

registerAllModules();

function Tableur() {
  return (
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
  );
}

export default Tableur;
