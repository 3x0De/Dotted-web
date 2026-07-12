import type React from "react";
import { Text } from "./ComponentDeBase/Text";
import "../../../../styles/main/Page/Block/Component/Document.scss";
import type { MakeState } from "../../../../types/Set";
import { useEffect, useState } from "react";

function Document({
  children,
  onChange,
  onKeyDown,
  registerRef,
}: {
  children: string;
  onChange: MakeState<React.ChangeEvent<HTMLInputElement>>;
  onKeyDown?: MakeState<React.KeyboardEvent<HTMLInputElement>>;
  registerRef?: (el: HTMLInputElement | null) => void;
}) {
  const [icon, seticon] = useState<string | null>(null);
  const [titre, settitre] = useState<string | null>(null);

  console.log(children);

  useEffect(() => {
    const getData = async () => {
      const request = await fetch(
        `${import.meta.env.VITE_API_URL}/Page/${children}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return await request.json();
    };

    if (children) {
      getData().then((page) => {
        seticon(page.icon ?? null);
        settitre(page.title ?? null);
      });
    }
  }, [children]);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const nouveauTitre = e.target.value;
    settitre(nouveauTitre);

    if (onChange) {
      onChange(e);
    }

    if (!children || children.trim() === "") return;

    try {
      const request = await fetch(
        `${import.meta.env.VITE_API_URL}/Page/${children}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ type: "titre", nouveau: nouveauTitre }),
        },
      );

      if (!request.ok) {
        console.error("Erreur lors de la sauvegarde du titre");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  }

  return (
    <div className="Doc">
      <a href={`/Page/${children}`}>
        <img src={icon ?? "/Icons/logo_mini.svg"} />
      </a>
      <Text
        placeholder="Document..."
        onChange={handleChange}
        onKeyDown={onKeyDown}
        registerRef={registerRef}
      >
        {titre ?? ""}
      </Text>
    </div>
  );
}

export default Document;
