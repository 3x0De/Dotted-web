import { useMemo } from "react";
import "./Styles/FoldScan.scss";

const allModules = import.meta.glob("/src/**/*");

interface FolderScannerProps {
  path?: string;
}

interface FolderContent {
  directory: string;
  files: string[];
}

export default function FolderScanner({
  path: targetPath = "",
}: FolderScannerProps) {
  const contentList = useMemo<FolderContent[]>(() => {
    if (!targetPath) return [];

    const cleanTarget = `/${targetPath.replace(/^\/|\/$/g, "")}/`;

    const groupMap = new Map<string, Set<string>>();

    Object.keys(allModules).forEach((filePath) => {
      if (filePath.startsWith(cleanTarget)) {
        const remainder = filePath.substring(cleanTarget.length);
        const parts = remainder.split("/");

        if (parts.length > 1) {
          const subFolder = parts[0];
          const fileName = parts[1];

          if (fileName) {
            if (!groupMap.has(subFolder)) groupMap.set(subFolder, new Set());
            groupMap.get(subFolder)!.add(fileName);
          }
        } else if (parts.length === 1 && parts[0]) {
          const rootFolderName = targetPath.split("/").pop() || "Racine";
          const fileName = parts[0];

          if (!groupMap.has(rootFolderName))
            groupMap.set(rootFolderName, new Set());
          groupMap.get(rootFolderName)!.add(fileName);
        }
      }
    });

    return Array.from(groupMap.entries()).map(([dirName, fileSet]) => ({
      directory: dirName,
      files: Array.from(fileSet),
    }));
  }, [targetPath]);

  async function changeIcon(folder: string, file: string) {
    await fetch("http://localhost:8000/Icon/change", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Id: Number(window.location.pathname.split("/").filter(Boolean).at(-1)),
        Icon: folder + "/" + file,
      }),
    });
  }

  return (
    <div id="MenuIcon">
      {contentList.map((folder) => (
        <div key={folder.directory}>
          <h5>{folder.directory}</h5>
          {folder.files.map((file) => (
            <img
              key={`${folder.directory}/${file}`}
              src={targetPath + "/" + folder.directory + "/" + file}
              className="IconRemix"
              onClick={() => changeIcon(folder.directory, file)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
