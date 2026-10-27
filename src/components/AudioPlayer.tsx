import { useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { assetUrl } from "../utils/event";
export function AudioPlayer({
  music,
}: {
  music?: { src: string; loop: boolean };
}) {
  const audio = useRef<HTMLAudioElement>(null);
  const [state, setState] = useState<
    "paused" | "loading" | "playing" | "error"
  >("paused");
  const attempt = useRef(0);
  if (!music?.src) return null;
  const toggle = async () => {
    const player = audio.current;
    if (!player) return;
    const id = ++attempt.current;
    if (state === "playing" || state === "loading") {
      player.pause();
      setState("paused");
      return;
    }
    setState("loading");
    try {
      await player.play();
      if (id === attempt.current) setState("playing");
      else player.pause();
    } catch {
      if (id === attempt.current) setState("error");
    }
  };
  return (
    <div className="audio-control">
      <audio
        ref={audio}
        src={assetUrl(music.src)}
        loop={music.loop}
        preload="none"
        onError={() => setState("error")}
        onPause={() => setState((s) => (s === "error" ? s : "paused"))}
        onEnded={() => setState("paused")}
      />
      <button
        className="icon-button"
        onClick={toggle}
        aria-label={
          state === "playing"
            ? "Pausar música"
            : state === "loading"
              ? "Cancelar carga de música"
              : state === "error"
                ? "Reintentar música"
                : "Activar música"
        }
        aria-pressed={state === "playing"}
      >
        {state === "playing" ? <Volume2 /> : <VolumeX />}
      </button>
      <span
        role="status"
        className={
          state === "loading" || state === "error"
            ? "audio-feedback"
            : undefined
        }
      >
        {state === "error"
          ? "No se pudo reproducir. Toca para reintentar."
          : state === "loading"
            ? "Cargando música…"
            : state === "playing"
              ? "Música activada"
              : "Música opcional"}
      </span>
    </div>
  );
}
