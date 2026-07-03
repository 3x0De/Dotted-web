import { useEffect, useState } from "react";

type File = string;
type Folder = { name: string; inside?: (Folder | File)[] };

const Modules = import.meta.glob("/src/**/*", {
  query: "?url",
  import: "default",
});

async function ConstructFolder(): Promise<Folder> {
  const racine: Folder = { name: "src", inside: [] };
  const chemins = Object.keys(Modules);

  for (const chemin of chemins) {
    const relatif = chemin.replace(/^\/src\/?/, "");
    if (!relatif) continue;

    const segments = relatif.split("/");
    let courant = racine;

    segments.forEach((segment, idx) => {
      const estFichier = idx === segments.length - 1;
      courant.inside = courant.inside ?? [];

      if (estFichier) {
        courant.inside.push(segment as File);
        return;
      }

      let sousDossier = courant.inside.find(
        (el): el is Folder => typeof el !== "string" && el.name === segment,
      );

      if (!sousDossier) {
        sousDossier = { name: segment, inside: [] };
        courant.inside.push(sousDossier);
      }

      courant = sousDossier;
    });
  }

  return racine;
}

function trouverDossier(
  racine: Folder,
  segments: string[],
): Folder | undefined {
  let courant: Folder | undefined = racine;

  for (const segment of segments) {
    if (!courant?.inside) return undefined;
    courant = courant.inside.find(
      (el): el is Folder => typeof el !== "string" && el.name === segment,
    );
  }

  return courant;
}

function parcourir(
  dossier: Folder,
  cheminRelatif: string,
  cheminAbsolu: string,
  relatifs: string[],
  absolus: string[],
) {
  if (!dossier.inside) return;

  for (const el of dossier.inside) {
    if (typeof el === "string") {
      relatifs.push(`${cheminRelatif}/${el}`.replace(/^\/+/, ""));
      absolus.push(`${cheminAbsolu}/${el}`.replace(/\/+/g, "/"));
    } else {
      const nouveauRelatif = `${cheminRelatif}/${el.name}`.replace(/^\/+/, "");
      const nouveauAbsolu = `${cheminAbsolu}/${el.name}`.replace(/\/+/g, "/");
      relatifs.push(nouveauRelatif);
      absolus.push(nouveauAbsolu);
      parcourir(el, nouveauRelatif, nouveauAbsolu, relatifs, absolus);
    }
  }
}

export default function useFolder(dir: string): {
  courant: Folder | undefined;
  relatifs: File[];
  absolus: File[];
  loading: boolean;
} {
  const [resultat, setResultat] = useState<{
    courant: Folder | undefined;
    relatifs: File[];
    absolus: File[];
    loading: boolean;
  }>({ courant: undefined, relatifs: [], absolus: [], loading: true });

  useEffect(() => {
    let annule = false;

    ConstructFolder().then((racine) => {
      if (annule) return;

      const segments = dir
        .replace(/^\/?src\/?/, "")
        .split("/")
        .filter(Boolean);

      const courant = trouverDossier(racine, segments);
      const relatifs: string[] = [];
      const absolus: string[] = [];

      if (courant) {
        const prefixeAbsolu = `/src/${segments.join("/")}`.replace(/\/+/g, "/");
        parcourir(courant, "", prefixeAbsolu, relatifs, absolus);
      }

      setResultat({ courant, relatifs, absolus, loading: false });
    });

    return () => {
      annule = true;
    };
  }, [dir]);

  return resultat;
}
