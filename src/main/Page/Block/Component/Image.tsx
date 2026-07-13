import type React from "react";
import { useState, useRef } from "react";
import type { MakeState } from "../../../../types/Set";
import "../../../../styles/main/Page/Block/Component/Image.scss";

// Typage des propriétés (Ajout de onUpload pour le resize)
interface ImageProps {
  children: { width?: number; lien?: string };
  onChange: MakeState<React.ChangeEvent<HTMLInputElement>>;
  onUpload?: (data: {
    img?: string;
    size: { width: number; height: number };
  }) => void;
  registerRef?: (el: HTMLInputElement | null) => void;
}

function Image({ children: content, onChange, registerRef }: ImageProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  function triggerChange(value: string) {
    const input = hiddenInputRef.current;
    if (!input) return;

    const nativeSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value",
    )?.set;

    nativeSetter?.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/Image`, {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        triggerChange(data.data);
      } else {
        setError(data.message ?? "Erreur lors de l'envoi");
      }
    } catch {
      setError("Erreur réseau");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="Image" ref={registerRef}>
      {content.lien ? (
        <>
          <img
            ref={imgRef}
            src={`${import.meta.env.VITE_API_URL}${content.lien}`}
            alt="Image introuvable"
            width={content.width ?? "100%"}
          />
        </>
      ) : (
        <>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <input
            ref={hiddenInputRef}
            onChange={onChange}
            type="text"
            style={{ display: "none" }}
          />
          {uploading && <p className="Image-status">Envoi en cours...</p>}
          {error && <p className="Image-error">{error}</p>}
        </>
      )}
    </div>
  );
}

export default Image;
