import { useState, useEffect, useRef } from "react";

interface UseEmbeddableResult {
  embeddable: boolean | null;
  loading: boolean;
}

function useEmbeddable(
  url: string | null | undefined,
  timeout: number = 4000,
): UseEmbeddableResult {
  const [embeddable, setEmbeddable] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!url) {
      setEmbeddable(null);
      return;
    }

    let resolved = false;
    setLoading(true);
    setEmbeddable(null);

    const controller = new AbortController();

    timerRef.current = setTimeout(() => {
      if (resolved) return;
      resolved = true;
      controller.abort();
      setEmbeddable(false);
      setLoading(false);
    }, timeout);

    const checkEmbeddable = async () => {
      try {
        const apiUrl = `https://www.iframeaudit.com/api/audit?url=${encodeURIComponent(url)}`;
        const response = await fetch(apiUrl, { signal: controller.signal });

        if (!response.ok) throw new Error();

        const data = await response.json();

        if (resolved) return;
        resolved = true;
        clearTimeout(timerRef.current);

        setEmbeddable(data.embeddable === true);
        setLoading(false);
      } catch {
        if (resolved) return;
        resolved = true;
        clearTimeout(timerRef.current);
        setEmbeddable(false);
        setLoading(false);
      }
    };

    checkEmbeddable();

    return () => {
      resolved = true;
      clearTimeout(timerRef.current);
      controller.abort();
    };
  }, [url, timeout]);

  return { embeddable, loading };
}

export default useEmbeddable;
