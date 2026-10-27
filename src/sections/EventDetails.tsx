import { useState } from "react";
import { ArrowUpRight, CalendarPlus, MapPin } from "lucide-react";
import type { InvitationConfig } from "../config/invitation";
import { eventInstant, makeICS, mapsUrl } from "../utils/event";
import { WaterLines } from "../components/PoolArt";

export function DateSection({ config }: { config: InvitationConfig }) {
  const [error, setError] = useState("");
  const target = eventInstant(config);
  const format = (options: Intl.DateTimeFormatOptions) =>
    target
      ? new Intl.DateTimeFormat("es-MX", {
          ...options,
          timeZone: config.timeZone,
        }).format(target)
      : "";
  let calendarReady = false;
  try {
    makeICS(config);
    calendarReady = true;
  } catch {
    /* Missing data is explained below. */
  }
  const download = () => {
    try {
      const url = URL.createObjectURL(
        new Blob([makeICS(config)], { type: "text/calendar;charset=utf-8" }),
      );
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "cumpleanos-luci.ics";
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (issue) {
      setError(
        issue instanceof Error
          ? issue.message
          : "No se pudo crear el calendario.",
      );
    }
  };
  return (
    <section id="details" className="date-section section-shell">
      <div className="date-intro">
        <h2>
          APARTA
          <br />
          LA FECHA.
        </h2>
        <p>
          Alberca, buena compañía
          <br />y un cumpleaños por celebrar.
        </p>
      </div>
      <div className="date-layout">
        <span className="date-day">{format({ day: "numeric" }) || "—"}</span>
        <div className="date-copy">
          <span className="date-weekday">
            {format({ weekday: "long" }).toLocaleUpperCase("es") ||
              "FECHA POR CONFIRMAR"}
          </span>
          <strong className="date-month">
            {format({ month: "long" }).toLocaleUpperCase("es")}
          </strong>
          <span className="date-year">{format({ year: "numeric" })}</span>
          <div className="date-time">
            {target
              ? `${Number(config.startTime.split(":")[0]) % 12 || 12}:${config.startTime.split(":")[1]} ${Number(config.startTime.split(":")[0]) >= 12 ? "PM" : "AM"}`
              : "Horario por confirmar"}
            {config.endTime && <small> hasta {config.endTime}</small>}
          </div>
          <span className="timezone">{config.timeZone}</span>
        </div>
      </div>
      <button
        className="button button-outline calendar-button"
        onClick={download}
        disabled={!calendarReady}
      >
        <CalendarPlus size={17} />
        AGREGAR A MI CALENDARIO
        <ArrowUpRight size={17} />
      </button>
      {!calendarReady && (
        <p className="fine-note">
          Completa la fecha, hora, zona y lugar para exportar el calendario.
        </p>
      )}
      {error && <p role="alert">{error}</p>}
    </section>
  );
}
export function LocationSection({ config }: { config: InvitationConfig }) {
  const [map, setMap] = useState(false);
  const maps = mapsUrl(config);
  const query = config.coordinates
    ? `${config.coordinates.lat},${config.coordinates.lng}`
    : config.address;
  return (
    <section id="location" className="location-section section-shell">
      <div className="location-header">
        <p>EL PUNTO DE ENCUENTRO</p>
        <div className="location-pin" aria-hidden="true">
          <MapPin strokeWidth={1.2} />
          <WaterLines />
        </div>
      </div>
      <h2>{config.venue || "Lugar por confirmar"}</h2>
      <div className="location-bottom">
        <div>
          <p>
            {config.address ||
              "Así es cómo llegarás"}
          </p>
          {config.directions && <p>{config.directions}</p>}
        </div>
        <div>
          {maps ? (
            <a
              className="button button-teal"
              href={maps}
              target="_blank"
              rel="noreferrer"
            >
              CÓMO LLEGAR
              <ArrowUpRight size={17} />
            </a>
          ) : (
            <>
              <button
                className="button button-outline"
                disabled
                aria-describedby="map-pending"
              >
                CÓMO LLEGAR
                <ArrowUpRight size={17} />
              </button>
              <p id="map-pending" className="fine-note">
                El enlace de ubicación está pendiente.
              </p>
            </>
          )}
          {maps && query && (
            <button
              className="text-button"
              onClick={() => setMap(true)}
              disabled={map}
            >
              Cargar mapa de Google
            </button>
          )}
        </div>
      </div>
      {map && query && (
        <div className="map-embed">
          <iframe
            title="Ubicación del evento en Google Maps"
            src={`https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer"
            allowFullScreen
          />
          <p className="fine-note">
            Google recibe tu conexión al cargarlo. Si no aparece, usa “Cómo
            llegar”.
          </p>
        </div>
      )}
    </section>
  );
}
