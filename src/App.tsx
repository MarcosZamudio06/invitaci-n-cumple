import { useRef, type CSSProperties } from "react";
import { ArrowDown, ArrowUp, ArrowUpRight } from "lucide-react";
import { invitation, type InvitationConfig } from "./config/invitation";
import { Gallery } from "./components/Gallery";
import { AudioPlayer } from "./components/AudioPlayer";
import { Countdown } from "./components/Countdown";
import { PoolRing, WaterLines } from "./components/PoolArt";
import { DateSection, LocationSection } from "./sections/EventDetails";
import { RSVPSection } from "./sections/RSVPSection";
import { useReducedMotion } from "./hooks/useMotion";
import { useInvitationMotion } from "./hooks/useInvitationMotion";
import { eventInstant, assetUrl } from "./utils/event";

export default function App({
  config = invitation,
}: {
  config?: InvitationConfig;
}) {
  const scope = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const disabled = reduced || !config.effects.animations;
  const { skipIntro } = useInvitationMotion(scope, disabled);
  const eventDate = eventInstant(config);
  const dateLabel = eventDate
    ? new Intl.DateTimeFormat("es-MX", {
        day: "numeric",
        month: "long",
        timeZone: config.timeZone,
      })
        .format(eventDate)
        .toLocaleUpperCase("es")
    : "FECHA POR CONFIRMAR";
  const timeLabel = eventDate
    ? new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZone: config.timeZone,
      }).format(eventDate)
    : "";
  const theme = Object.fromEntries(
    Object.entries(config.theme).map(([key, value]) => [
      `--${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`,
      value,
    ]),
  ) as CSSProperties;
  return (
    <div
      ref={scope}
      className="invitation"
      style={theme}
      data-motion={disabled ? "reduced" : "full"}
      data-particles={config.effects.particles}
    >
      <a className="skip-link" href="#details" onClick={skipIntro}>
        Ir a los detalles
      </a>
      <header className="site-header">
        <a href="#top" className="brand" aria-label={`${config.name}, inicio`}>
          {config.name.toUpperCase()}
          <span>POOL PARTY</span>
        </a>
        <nav aria-label="Navegación principal">
          <a href="#details">EL PLAN</a>
          <a href="#rsvp">
            ¿VIENES?
            <ArrowUpRight size={15} />
          </a>
        </nav>
      </header>
      <main>
        <section
          id="top"
          className="hero"
          aria-label={`Cumpleaños de ${config.name}`}
        >
          <div className="hero-water" aria-hidden="true">
            <svg viewBox="0 0 1200 650" preserveAspectRatio="none">
              <path
                d="M1200 0C960 70 1180 340 820 320S400 500 580 650h620Z"
                fill="var(--water)"
              />
              <path
                d="M1200 180C1060 130 1110 460 880 450S710 600 760 650h440Z"
                fill="var(--sage)"
              />
            </svg>
            <WaterLines />
          </div>
          <div className="hero-topline">
            <span>ES MI CUMPLEAÑOS</span>
            <button className="skip-intro" onClick={skipIntro}>
              Omitir animación
              <ArrowDown size={13} />
            </button>
          </div>
          <div className="hero-invite">
            <p>{config.welcome}</p>
            <span>Nos espera una tarde muy especial.</span>
          </div>
          <div className="hero-title">
            <h1 className="hero-name">{config.name.toUpperCase()}</h1>
            <span className="party-stamp">
              POOL
              <br />
              PARTY
            </span>
          </div>
          <PoolRing className="hero-ring" />
          <div className="hero-meta">
            <p>{config.message}</p>
            <a
              className="button button-teal"
              href="#details"
              onClick={skipIntro}
            >
              VER EL PLAN
              <ArrowDown size={17} />
            </a>
            <span>
              {dateLabel}
              {timeLabel ? ` · ${timeLabel}` : ""}
            </span>
          </div>
          {config.age !== undefined && (
            <p className="hero-age">
              {config.age} años, ¡y mucho por celebrar!
            </p>
          )}
          {config.heroImage && (
            <figure className="hero-photo">
              <img
                src={assetUrl(config.heroImage.src)}
                alt={config.heroImage.alt}
                width={config.heroImage.width || 900}
                height={config.heroImage.height || 1200}
              />
            </figure>
          )}
        </section>
        <Countdown targetDate={eventInstant(config)} disabled={disabled} />
        <DateSection config={config} />
        <LocationSection config={config} />
        <section id="pool-reminder" className="pool-reminder section-shell">
          <div className="reminder-copy">
            <h2>
              <span>¡NO OLVIDES</span>
              <span>LLEVAR TU</span>
              <span>TRAJE DE BAÑO!</span>
            </h2>
            <p>
              El mejor accesorio para la fiesta:
              <br />
              ganas de pasarla increíble.
            </p>
          </div>
          <div className="reminder-art">
            <PoolRing className="reminder-ring" />
            <span className="reminder-bubble bubble-one" />
            <span className="reminder-bubble bubble-two" />
            <span className="reminder-bubble bubble-three" />
          </div>
          {config.dressCode && (
            <div className="dress-details">
              <h3>{config.dressCode.name}</h3>
              <p>{config.dressCode.description}</p>
              {config.dressCode.restrictions && (
                <p>{config.dressCode.restrictions}</p>
              )}
              {config.dressCode.colors?.length && (
                <div className="dress-palette">
                  {config.dressCode.colors.map((color) => (
                    <span key={color.hex}>
                      <i style={{ background: color.hex }} />
                      {color.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
        <section id="memories" className="memories-section section-shell">
          <div className="memories-heading">
            <h2>
              BUENA COMPAÑÍA.
              <br />
              MEJORES RECUERDOS.
            </h2>
            <p>
              Un cumpleaños para disfrutar
              <br />
              dentro y fuera del agua.
            </p>
          </div>
          <Gallery photos={config.photos} />
        </section>
        {config.music?.src && (
          <section
            className="music-section section-shell"
            aria-label="Música de la fiesta"
          >
            <p>¿LE PONEMOS MÚSICA?</p>
            <span>Actívala cuando quieras desde el reproductor.</span>
          </section>
        )}
        <RSVPSection config={config} />
      </main>
      <footer className="closing">
        <WaterLines className="footer-waves" />
        <h2>
          ¡NOS VEMOS
          <br />
          EN LA FIESTA!
        </h2>
        <span className="closing-name">{config.name.toUpperCase()}</span>
        <div className="footer-links">
          <a href="#rsvp">
            CONFIRMAR ASISTENCIA
            <ArrowUpRight size={16} />
          </a>
          <a href="#top">
            VOLVER ARRIBA
            <ArrowUp size={16} />
          </a>
        </div>
        <p>CUMPLEAÑOS + ALBERCA + TÚ</p>
      </footer>
      <AudioPlayer music={config.music} />
    </div>
  );
}
