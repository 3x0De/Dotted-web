import { HyperFormula } from "hyperformula";
import { registerAllModules } from "handsontable/registry";
import { HotTable, HotTableClass } from "@handsontable/react";
import "handsontable/styles/handsontable.css";
import "handsontable/styles/ht-theme-main.css";
import "../../Styles/main/Blocks/Tableur.scss";
import { useState, useRef, useEffect } from "react";

registerAllModules();

interface Props {
  innerRef: React.RefObject<HTMLHeadingElement | null>;
  oninput: (e: React.KeyboardEvent<HTMLElement>) => void;
  onBlur?: (e: (string | number | boolean)[][]) => void;
  contenu?: (string | number | boolean)[][];
}

function Tableur({ innerRef, oninput, onBlur, contenu }: Props) {
  const [lignes, setLignes] = useState<number>(2);
  const [colonnes, setColonnes] = useState<number>(2);
  const [col, setCol] = useState<boolean>(false);
  const [raw, setRaw] = useState<boolean>(false);

  const hotRef = useRef<HotTableClass>(null);
  const timerRef = useRef<any | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return contenu && contenu.length >= 1 ? (
    <div className="spreadsheet-container" ref={innerRef} onKeyDown={oninput}>
      <HotTable
        ref={hotRef}
        data={contenu.slice(1)}
        formulas={{ engine: HyperFormula }}
        themeName="ht-theme-main"
        rowHeaders={contenu[0][0] as boolean}
        colHeaders={contenu[0][1] as boolean}
        height="auto"
        width="100%"
        stretchH="all"
        licenseKey="non-commercial-and-evaluation"
        manualRowResize={false}
        manualColumnResize={false}
        afterChange={(changes, source) => {
          if (!["edit", "copy", "autofill"].includes(source as string)) return;

          const hotInstance = hotRef.current?.hotInstance;
          if (!hotInstance) return;

          if (timerRef.current) clearTimeout(timerRef.current);

          timerRef.current = setTimeout(() => {
            const sourceData = hotInstance.getSourceData();

            onBlur?.([
              contenu[0],
              ...(sourceData as (boolean | number | string)[][]),
            ]);
          }, 300);
        }}
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
          name="Colonnes"
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
