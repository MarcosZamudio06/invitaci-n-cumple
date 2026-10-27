import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, MessageCircle, Check, Minus } from "lucide-react";
import type { InvitationConfig } from "../config/invitation";
import { whatsappConfig } from "../config/whatsapp";
import { validPhone, validateRSVP, type RSVP } from "../utils/event";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "../utils/whatsapp";
import { PoolRing, WaterLines } from "../components/PoolArt";

export function RSVPSection({ config }: { config: InvitationConfig }) {
  const [value, setValue] = useState<RSVP>({
    name: "",
    attending: "",
    people: 1,
    message: "",
  });
  const [error, setError] = useState("");
  const [url, setUrl] = useState("");
  const activationLocked = useRef(false);
  const retryTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const resetGuard = () => {
    if (retryTimer.current !== undefined) clearTimeout(retryTimer.current);
    activationLocked.current = false;
    retryTimer.current = undefined;
  };
  useEffect(
    () => () => {
      if (retryTimer.current !== undefined) clearTimeout(retryTimer.current);
    },
    [],
  );
  const change = (patch: Partial<RSVP>) => {
    resetGuard();
    setValue((current) => ({ ...current, ...patch }));
    setError("");
    setUrl("");
  };
  const configured = validPhone(config.whatsapp);
  const maxPeople =
    config.maxCompanions == null ? undefined : config.maxCompanions + 1;

  return (
    <section id="rsvp" className="section-shell rsvp-section">
      <div className="rsvp-heading">
        <h2>¿VIENES A CELEBRAR CON {config.name.toUpperCase()}?</h2>
        <p>¡Nos encantará verte en la fiesta!</p>
        <div className="rsvp-art" aria-hidden="true">
          <PoolRing />
          <WaterLines />
        </div>
        <p className="rsvp-personal">
          Un mensaje tuyo y<br />
          empezamos a contar los días.
        </p>
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (activationLocked.current) return;
          const issue = validateRSVP(value, maxPeople);
          if (issue) {
            setError(issue);
            return;
          }
          const target = buildWhatsAppUrl(buildWhatsAppMessage(config, value), {
            ...whatsappConfig,
            recipient: config.whatsapp,
          });
          if (!target) {
            setError(
              configured
                ? "Completa la fecha, el horario y el lugar del evento."
                : "Falta configurar un número de WhatsApp válido con código de país.",
            );
            return;
          }
          activationLocked.current = true;
          // Open synchronously inside the submit gesture, not after a promise or timer.
          retryTimer.current = setTimeout(() => {
            activationLocked.current = false;
            retryTimer.current = undefined;
          }, 700);
          setUrl(target);
          try {
            window.open(target, "_blank", "noopener,noreferrer");
          } catch {
            setError(
              "No se pudo abrir WhatsApp. Puedes reintentarlo con el enlace de abajo.",
            );
          }
        }}
        noValidate
      >
        <label htmlFor="guest-name">Tu nombre</label>
        <input
          id="guest-name"
          name="name"
          autoComplete="name"
          placeholder="Tu nombre"
          minLength={2}
          maxLength={80}
          value={value.name}
          onChange={(event) => change({ name: event.target.value })}
          required
          aria-describedby={error ? "rsvp-error" : undefined}
        />
        <fieldset>
          <legend>¿Nos acompañas?</legend>
          <label
            className={`radio-option ${value.attending === "yes" ? "is-selected" : ""}`}
          >
            <input
              type="radio"
              name="attendance"
              value="yes"
              checked={value.attending === "yes"}
              onChange={() => change({ attending: "yes" })}
            />
            <Check size={17} aria-hidden="true" />
            ¡Claro que voy!
          </label>
          <label
            className={`radio-option ${value.attending === "no" ? "is-selected" : ""}`}
          >
            <input
              type="radio"
              name="attendance"
              value="no"
              checked={value.attending === "no"}
              onChange={() => change({ attending: "no", people: 1 })}
            />
            <Minus size={17} aria-hidden="true" />
            Esta vez no podré
          </label>
        </fieldset>
        {value.attending === "yes" && (
          <div className="people-field">
            <label htmlFor="people">Personas, incluyéndote</label>
            <input
              id="people"
              name="people"
              type="number"
              inputMode="numeric"
              min={1}
              step={1}
              max={maxPeople}
              value={Number.isNaN(value.people) ? "" : value.people}
              onChange={(event) =>
                change({
                  people:
                    event.target.value === ""
                      ? NaN
                      : Number(event.target.value),
                })
              }
              required
            />
            {maxPeople !== undefined && (
              <p className="fine-note">
                Hasta {maxPeople} {maxPeople === 1 ? "persona" : "personas"},
                incluyéndote.
              </p>
            )}
          </div>
        )}
        <label htmlFor="message">
          Mensaje para {config.name} <span>(opcional)</span>
        </label>
        <textarea
          id="message"
          name="message"
          maxLength={500}
          rows={3}
          placeholder={`Déjale un mensaje a ${config.name}...`}
          value={value.message}
          onChange={(event) => change({ message: event.target.value })}
        />
        {error && (
          <p id="rsvp-error" className="form-error" role="alert">
            {error}
          </p>
        )}
        <p id="whatsapp-notice" className="whatsapp-notice">
          <MessageCircle size={19} aria-hidden="true" />
          <span>
            Se abrirá WhatsApp con tu mensaje preparado. Solo falta presionar
            Enviar.
          </span>
        </p>
        <button
          className="button button-teal"
          type="submit"
          disabled={!configured}
          aria-describedby={!configured ? "phone-missing" : "whatsapp-notice"}
        >
          CONFIRMAR POR WHATSAPP
          <ArrowUpRight size={19} />
        </button>
        {!configured && (
          <p id="phone-missing" className="fine-note">
            Falta configurar el número receptor de WhatsApp.
          </p>
        )}
        <p className="fine-note privacy-note">
          Al abrir WhatsApp, el mensaje preparado se comparte con ese servicio.
          Tú decides si lo envías al destinatario. Esta página no guarda tus
          respuestas.
        </p>
        {url && (
          <div className="prepared" role="status">
            Tu mensaje está preparado, no enviado. Confirma el envío en
            WhatsApp.
            <a href={url} target="_blank" rel="noopener noreferrer">
              Volver a abrir WhatsApp
            </a>
          </div>
        )}
      </form>
    </section>
  );
}
