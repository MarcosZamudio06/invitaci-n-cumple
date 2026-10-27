import { whatsappConfig, type WhatsAppConfig } from "../config/whatsapp";
import {
  eventInstant,
  validateRSVP,
  validPhone,
  type EventData,
  type RSVP,
} from "./event";

/** Personal content stays in memory until the guest chooses to open/send with WhatsApp. */
export function buildWhatsAppMessage(
  event: EventData & { confirmationMessage?: string },
  value: RSVP,
): string | null {
  if (!event.name.trim() || validateRSVP(value)) return null;
  const name = value.name.trim();
  const note = value.message.trim();
  if (value.attending === "no") {
    return `¡Hola! 🌷\n\nSoy ${name}.\n\nMuchas gracias por invitarme al\ncumpleaños de ${event.name}.\n\nLamentablemente no podré asistir.${note ? `\n\n💌 Mi mensaje:\n${note}` : ""}\n\n¡Espero que se diviertan muchísimo! 🎉`;
  }
  const date = eventInstant(event);
  if (!date || !event.venue?.trim()) return null;
  const civilDate = new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: event.timeZone,
  })
    .format(date)
    .replace(/,/g, "");
  const formattedDate =
    civilDate[0].toLocaleUpperCase("es") + civilDate.slice(1);
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: event.timeZone,
  }).format(date);
  return `¡Hola! 🌊\n\nSoy ${name} y confirmo mi asistencia\nal cumpleaños de ${event.name}. 🎉\n\n📅 ${formattedDate}\n🕔 ${time}\n📍 ${event.venue}\n\n👥 Asistiremos ${value.people} ${value.people === 1 ? "persona" : "personas"}.${note ? `\n\n💌 Mensaje para ${event.name}:\n${note}` : ""}\n\n${event.confirmationMessage?.trim() || "¡Nos vemos en la fiesta! 🏖️"}`;
}

export function buildWhatsAppUrl(
  message: string | null,
  config: WhatsAppConfig = whatsappConfig,
): string | null {
  if (
    !message?.trim() ||
    !validPhone(config.recipient) ||
    config.baseUrl !== whatsappConfig.baseUrl
  )
    return null;
  return `${config.baseUrl}${config.recipient}?text=${encodeURIComponent(message)}`;
}
