import { HotTable } from "@handsontable/react";
import { HyperFormula } from "hyperformula";
import { registerAllModules } from "handsontable/registry";

import "handsontable/styles/handsontable.css";
import "handsontable/styles/ht-theme-main.css";

import "../../Styles/main/Blocks/Tableur.scss";
import { useState } from "react";

registerAllModules();

interface Props {
  innerRef: React.RefObject<HTMLHeadingElement | null>;
  oninput: (e: React.KeyboardEvent<HTMLElement>) => void;
  onBlur?: (e: any) => void;
  contenu?: (boolean | number | string)[][];
}

function Tableur({ innerRef, oninput, onBlur, contenu }: Props) {
  const [lignes, setLignes] = useState<number>(2);
  const [colonnes, setColonnes] = useState<number>(2);
  const [col, setCol] = useState<boolean>(false);
  const [raw, setRaw] = useState<boolean>(false);

  return contenu && contenu.length >= 1 ? (
    <div className="spreadsheet-container" ref={innerRef} onKeyDown={oninput}>
      <HotTable
        data={contenu.slice(1)}
        formulas={{
          engine: HyperFormula,
        }}
        themeName="ht-theme-main"
        rowHeaders={contenu[0][0] as boolean}
        colHeaders={contenu[0][1] as boolean}
        height="auto"
        width="100%"
        stretchH="all"
        licenseKey="non-commercial-and-evaluation"
        manualRowResize={false}
        manualColumnResize={false}
      />
    </div>
  ) : (
    <form className="tableur" onKeyDown={oninput}>
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
        <input type="checkbox" name="raw" onChange={() => setRaw(!raw)} />
      </div>
      <div>
        <label htmlFor="col">Entêtes des colonnes : </label>
        <input type="checkbox" name="col" onChange={() => setCol(!col)} />
      </div>
      <button
        onClick={(e) => {
          e.preventDefault();
          const data: (boolean | number | string)[][] = [
            [raw, col],
            ...Array.from({ length: lignes }, () =>
              Array.from({ length: colonnes }, () => ""),
            ),
          ];
          onBlur?.(data);
        }}
      >
        Créer le tableau
      </button>
    </form>
  );
}

export default Tableur;
