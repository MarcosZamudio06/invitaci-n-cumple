import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, X, Expand } from "lucide-react";
import type { Photo } from "../config/invitation";
import { assetUrl } from "../utils/event";
import { PoolGraphic } from "./PoolArt";
function PhotoImage({
  photo,
  eager = false,
}: {
  photo: Photo;
  eager?: boolean;
}) {
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  return (
    <>
      <img
        src={assetUrl(photo.src)}
        alt={photo.alt}
        width={photo.width || 900}
        height={photo.height || 1200}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setState("ready")}
        onError={() => setState("error")}
        style={{ opacity: state === "ready" ? 1 : 0 }}
      />
      {state !== "ready" && (
        <span className="image-state" role="status">
          {state === "error"
            ? "Fotografía no disponible"
            : "Cargando fotografía…"}
        </span>
      )}
    </>
  );
}
export function Gallery({ photos }: { photos: Photo[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => {
    if (index !== null) {
      if (!dialog.current?.open) dialog.current?.showModal();
    } else if (dialog.current?.open) dialog.current.close();
  }, [index]);
  const close = () => {
    setIndex(null);
    trigger.current?.focus();
  };
  const move = (delta: number) =>
    setIndex((n) =>
      n === null ? null : (n + delta + photos.length) % photos.length,
    );
  if (!photos.length) return <PoolGraphic />;
  return (
    <>
      <div className="gallery-grid">
        {photos.map((photo, i) => (
          <button
            className="gallery-photo"
            key={photo.src + i}
            onClick={(e) => {
              trigger.current = e.currentTarget;
              setIndex(i);
            }}
            aria-label={`Ampliar: ${photo.alt}`}
          >
            <PhotoImage photo={photo} />
            <span>
              {photo.caption || photo.alt}
              <Expand size={16} />
            </span>
          </button>
        ))}
      </div>
      <dialog
        className="lightbox"
        ref={dialog}
        aria-label="Galería de fotografías"
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onClose={close}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") move(1);
          if (e.key === "ArrowLeft") move(-1);
          if (e.key === "Escape") {
            e.preventDefault();
            close();
          }
        }}
        onTouchStart={(e) => {
          touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }}
        onTouchEnd={(e) => {
          if (touch.current) {
            const dx = e.changedTouches[0].clientX - touch.current.x;
            const dy = e.changedTouches[0].clientY - touch.current.y;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy))
              move(dx < 0 ? 1 : -1);
            touch.current = null;
          }
        }}
      >
        <button
          className="icon-button close"
          onClick={close}
          aria-label="Cerrar galería"
          autoFocus
        >
          <X />
        </button>
        {index !== null && (
          <figure>
            <PhotoImage key={index} photo={photos[index]} eager />
            <figcaption>
              {photos[index].caption || photos[index].alt}{" "}
              <span aria-live="polite">
                {index + 1} / {photos.length}
              </span>
            </figcaption>
          </figure>
        )}
        <div className="lightbox-nav">
          <button
            className="icon-button"
            onClick={() => move(-1)}
            aria-label="Fotografía anterior"
          >
            <ArrowLeft />
          </button>
          <button
            className="icon-button"
            onClick={() => move(1)}
            aria-label="Fotografía siguiente"
          >
            <ArrowRight />
          </button>
        </div>
      </dialog>
    </>
  );
}
