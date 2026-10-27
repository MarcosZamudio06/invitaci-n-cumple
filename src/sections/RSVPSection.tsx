import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { InvitationConfig } from "../config/invitation";
import {
  validPhone,
  validateRSVP,
  whatsappUrl,
  type RSVP,
} from "../utils/event";
export function RSVPSection({ config }: { config: InvitationConfig }) {
  const [value, setValue] = useState<RSVP>({
    name: "",
    attending: "",
    people: 1,
    message: "",
  });
  const [error, setError] = useState("");
  const [prepared, setPrepared] = useState(false);
  const [url, setUrl] = useState("");
  const change = (patch: Partial<RSVP>) => {
    setValue((v) => ({ ...v, ...patch }));
    setPrepared(false);
    setUrl("");
    setError("");
  };
  const configured = validPhone(config.whatsapp);
  return (
    <section id="rsvp" className="section-shell rsvp-section">
      <div className="rsvp-heading">
        <h2>¿VIENES A CELEBRAR CON {config.name.toUpperCase()}?</h2>
        <p>¡Nos encantará verte!</p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const issue = validateRSVP(value, config.maxCompanions + 1);
          if (issue) {
            setError(issue);
            return;
          }
          const target = whatsappUrl(
            config.whatsapp,
            config.name,
            value,
            config.confirmationMessage,
          );
          if (!target) {
            setError(
              "Falta configurar un número de WhatsApp válido con código de país.",
            );
            return;
          }
          setPrepared(true);
          setUrl(target);
          window.open(target, "_blank", "noopener,noreferrer");
        }}
        noValidate
      >
        <label htmlFor="guest-name">Tu nombre</label>
        <input
          id="guest-name"
          name="name"
          autoComplete="name"
          maxLength={80}
          value={value.name}
          onChange={(e) => change({ name: e.target.value })}
          placeholder="¿Cómo te llamas?"
          required
          aria-describedby={error ? "rsvp-error" : undefined}
        />
        <fieldset>
          <legend>¿Nos acompañas?</legend>
          <label className="radio-option">
            <input
              type="radio"
              name="attendance"
              checked={value.attending === "yes"}
              onChange={() => change({ attending: "yes" })}
              value="yes"
            />
            Sí, estaré ahí
          </label>
          <label className="radio-option">
            <input
              type="radio"
              name="attendance"
              checked={value.attending === "no"}
              onChange={() => change({ attending: "no", people: 1 })}
              value="no"
            />
            Esta vez no podré
          </label>
        </fieldset>
        {config.maxCompanions > 0 && value.attending === "yes" && (
          <>
            <label htmlFor="people">Personas, incluyéndote</label>
            <select
              id="people"
              value={value.people}
              onChange={(e) => change({ people: Number(e.target.value) })}
            >
              {Array.from({ length: config.maxCompanions + 1 }, (_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </>
        )}
        <label htmlFor="message">
          Unas palabras <span>(opcional)</span>
        </label>
        <textarea
          id="message"
          maxLength={500}
          rows={2}
          value={value.message}
          onChange={(e) => change({ message: e.target.value })}
          placeholder="Lo que quieras compartir…"
        />
        {error && (
          <p id="rsvp-error" role="alert" className="form-error">
            {error}
          </p>
        )}
        <button
          className="button button-teal"
          type="submit"
          disabled={!configured}
          aria-describedby={!configured ? "phone-missing" : undefined}
        >
          CONFIRMAR ASISTENCIA
          <ArrowUpRight size={18} />
        </button>
        {!configured && (
          <p id="phone-missing" className="fine-note">
            Falta configurar el número receptor de WhatsApp.
          </p>
        )}
        <p className="fine-note">
          No guardamos tus datos. Revisarás y enviarás el mensaje desde
          WhatsApp.
        </p>
        {prepared && (
          <div className="prepared" role="status">
            Tu mensaje está preparado, no enviado. Confirma el envío en
            WhatsApp.{" "}
            <a href={url} target="_blank" rel="noreferrer">
              Volver a abrir WhatsApp
            </a>
          </div>
        )}
      </form>
    </section>
  );
}
