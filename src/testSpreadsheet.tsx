import { HotTable } from "@handsontable/react";
import { HyperFormula } from "hyperformula";
import { registerAllModules } from "handsontable/registry";

import "handsontable/styles/handsontable.css";
import "handsontable/styles/ht-theme-main.css";

registerAllModules();

export default function Test() {
  return (
    <div
      className="spreadsheet-container"
      style={{ background: "red", position: "relative" }}
    >
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
        height="300"
        licenseKey="non-commercial-and-evaluation"
        manualRowResize={false}
        manualColumnResize={false}
      />
    </div>
  );
}
