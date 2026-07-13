import type React from "react";
import { useState, useEffect } from "react";
import type { MakeState } from "../../../../types/Set";
import { Text } from "./ComponentDeBase/Text";
import open from "../../../../assets/Img/Page/Block/lien/openLien.svg";
import "../../../../styles/main/Page/Block/Component/Lien.scss";

function Link({
  children: url,
  onChange,
  onKeyDown,
  registerRef,
}: {
  children: string;
  onChange: MakeState<React.ChangeEvent<HTMLInputElement>>;
  onKeyDown?: MakeState<React.KeyboardEvent<HTMLInputElement>>;
  registerRef?: (el: HTMLInputElement | null) => void;
}) {
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!url) {
      setEmbedUrl(null);
      return;
    }

    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = url.match(
        /(?:embed\/|v=|v\/|vi\/|youtu\.be\/|\/v\/|e\/|embed\/|watch\?v%3D|watch\?v=)([a-zA-Z0-9_-]{11})/,
      )?.[1];
      if (videoId) {
        setEmbedUrl(`https://www.youtube.com/embed/${videoId}`);
        return;
      }
    }

    if (url.includes("codepen.io") && url.includes("/embed/")) {
      setEmbedUrl(url);
      return;
    }

    if (
      url.includes("google.com/maps/embed") ||
      url.includes("google.fr/maps/embed")
    ) {
      setEmbedUrl(url);
      return;
    }

    if (url.includes("open.spotify.com")) {
      const spotifyMatch = url.match(
        /open\.spotify\.com\/(embed\/)?(album|track|playlist|artist)\/([a-zA-Z0-9]+)/,
      );
      if (spotifyMatch) {
        setEmbedUrl(
          `https://open.spotify.com/embed/${spotifyMatch[2]}/${spotifyMatch[3]}`,
        );
      } else {
        setEmbedUrl(null);
      }
      return;
    }

    setEmbedUrl(null);
  }, [url]);

  if (embedUrl) {
    const isSpotify = embedUrl.includes("spotify.com");

    return (
      <iframe
        src={embedUrl}
        width="100%"
        height={isSpotify ? "352" : "500"}
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        title="Embed Content"
        loading="lazy"
      />
    );
  }

  return (
    <div className="Lien">
      <a href={url} target="_blank" rel="noopener noreferrer">
        <img src={open} alt="Ouvrir le lien" />
      </a>
      <Text
        placeholder="Lien..."
        onChange={onChange}
        onKeyDown={onKeyDown}
        registerRef={registerRef}
      >
        {url}
      </Text>
    </div>
  );
}

export default Link;
