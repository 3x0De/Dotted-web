import { useState, useRef } from "react";
import { HyperFormula } from "hyperformula";
import { registerAllModules } from "handsontable/registry";
import { HotTable } from "@handsontable/react";

import "handsontable/styles/handsontable.css";
import "handsontable/styles/ht-theme-main.css";
import type { TableurType } from "../../../../types/MainTypes/BlockTypes/Tableur";
import type React from "react";
import type { MakeState } from "../../../../types/Set";

registerAllModules();

const areTablesEqual = (arr1: any[][], arr2: any[][]) => {
  if (!arr1 || !arr2) return false;
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i].length !== arr2[i].length) return false;
    for (let j = 0; j < arr1[i].length; j++) {
      if (arr1[i][j] !== arr2[i][j]) return false;
    }
  }
  return true;
};

function Tableur({
  children,
  onChange,
  registerRef,
}: {
  children: TableurType;
  onChange: MakeState<React.ChangeEvent<HTMLInputElement>>;
  registerRef?: (el: HTMLInputElement | null) => void;
}) {
  const hotRef = useRef<any>(null);

  const [hyperInstance] = useState(() =>
    HyperFormula.buildEmpty({
      licenseKey: "internal-use-in-handsontable",
    }),
  );

  return (
    <div
      className="Tableur-wrapper"
      ref={registerRef}
      style={{ width: "100%" }}
    >
      <HotTable
        ref={hotRef}
        data={children}
        formulas={{
          engine: hyperInstance,
        }}
        themeName="ht-theme-main"
        rowHeaders={true}
        colHeaders={true}
        height="auto"
        width="100%"
        stretchH="all"
        licenseKey="non-commercial-and-evaluation"
        manualRowResize={true}
        manualColumnResize={true}
        contextMenu={true}
        afterChange={(_, source) => {
          if (source === "loadData") return;

          if (hotRef.current) {
            const hotInstance = hotRef.current.hotInstance;

            const currentTableData = hotInstance.getSourceData();

            if (areTablesEqual(children, currentTableData)) {
              return;
            }

            onChange({
              target: {
                value: currentTableData,
              },
            } as unknown as React.ChangeEvent<HTMLInputElement>);
          }
        }}
      />
    </div>
  );
}

export default Tableur;
