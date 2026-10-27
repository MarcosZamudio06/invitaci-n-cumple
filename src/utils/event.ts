import { Temporal } from "@js-temporal/polyfill";
export interface EventData {
  name: string;
  date: string;
  startTime: string;
  endTime?: string;
  timeZone: string;
  venue?: string;
  address?: string;
}
export function eventInstant(
  event: Pick<EventData, "date" | "startTime" | "timeZone">,
): Date | null {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(event.date) ||
    !/^\d{2}:\d{2}$/.test(event.startTime) ||
    !event.timeZone
  )
    return null;
  try {
    const instant = Temporal.PlainDateTime.from(
      `${event.date}T${event.startTime}`,
      { overflow: "reject" },
    )
      .toZonedDateTime(event.timeZone, { disambiguation: "reject" })
      .toInstant();
    return new Date(instant.epochMilliseconds);
  } catch {
    return null;
  }
}
export function countdown(target: Date | null, now = Date.now()) {
  if (!target || !Number.isFinite(target.getTime())) return null;
  const remaining = Math.max(0, Math.floor((target.getTime() - now) / 1000));
  return {
    days: Math.floor(remaining / 86400),
    hours: Math.floor(remaining / 3600) % 24,
    minutes: Math.floor(remaining / 60) % 60,
    seconds: remaining % 60,
    started: target.getTime() <= now,
  };
}
const escapeICS = (value: string) =>
  value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;")
    .replace(/\r/g, "");
function fold(line: string) {
  let result = "",
    bytes = 0;
  for (const char of line) {
    const size = new TextEncoder().encode(char).length;
    if (bytes + size > 75) {
      result += "\r\n ";
      bytes = 1;
    }
    result += char;
    bytes += size;
  }
  return result;
}
const stamp = (date: Date) =>
  date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
export function makeICS(event: EventData, now = new Date()): string {
  const start = eventInstant(event);
  const end = event.endTime
    ? eventInstant({ ...event, startTime: event.endTime })
    : null;
  if (
    !start ||
    !event.name.trim() ||
    !event.venue?.trim() ||
    (event.endTime && (!end || end <= start))
  )
    throw new Error(
      "Completa nombre, fecha, hora, zona horaria y lugar; la hora final debe ser posterior al inicio.",
    );
  const uid = `${start.getTime()}-${Array.from(event.name)
    .map((x) => x.codePointAt(0)!.toString(16))
    .join("")}@luci-pool-party`;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Riviera Pool Party//Invitation//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${stamp(now)}`,
    `DTSTART:${stamp(start)}`,
    ...(end ? [`DTEND:${stamp(end)}`] : []),
    `SUMMARY:${escapeICS(`Cumpleaños de ${event.name}`)}`,
    `LOCATION:${escapeICS([event.venue, event.address].filter(Boolean).join(", "))}`,
    `DESCRIPTION:${escapeICS(`Celebración de ${event.name}. Zona horaria: ${event.timeZone}`)}`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ]
    .map(fold)
    .join("\r\n");
}
export function mapsUrl(place: {
  address?: string;
  coordinates?: { lat: number; lng: number };
  mapsLink?: string;
}): string | null {
  if (place.mapsLink) {
    try {
      const url = new URL(place.mapsLink);
      if (
        url.protocol === "https:" &&
        [
          "www.google.com",
          "maps.google.com",
          "maps.app.goo.gl",
          "goo.gl",
        ].includes(url.hostname)
      )
        return url.href;
    } catch {
      /* Fall back to configured place. */
    }
  }
  const c = place.coordinates;
  const query =
    c &&
    Number.isFinite(c.lat) &&
    Number.isFinite(c.lng) &&
    Math.abs(c.lat) <= 90 &&
    Math.abs(c.lng) <= 180
      ? `${c.lat},${c.lng}`
      : place.address?.trim();
  return query
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
    : null;
}
export interface RSVP {
  name: string;
  attending: "yes" | "no" | "";
  people: number;
  message: string;
}
export function validateRSVP(
  value: RSVP,
  maxPeople?: number | null,
): string | null {
  if (value.name.trim().length < 2 || value.name.trim().length > 80)
    return "Escribe tu nombre (entre 2 y 80 caracteres).";
  if (value.attending !== "yes" && value.attending !== "no")
    return "Selecciona si podrás acompañarnos.";
  if (maxPeople != null && (!Number.isSafeInteger(maxPeople) || maxPeople < 1))
    return "La configuración del límite de asistentes no es válida.";
  if (value.attending === "yes") {
    if (!Number.isSafeInteger(value.people) || value.people < 1)
      return "Indica un número entero de personas, mínimo 1.";
    if (maxPeople != null && value.people > maxPeople)
      return `Selecciona entre 1 y ${maxPeople} personas.`;
  }
  if (value.message.length > 500)
    return "El mensaje debe tener como máximo 500 caracteres.";
  return null;
}
export function validPhone(phone: string) {
  return /^[1-9]\d{7,14}$/.test(phone);
}
export function assetUrl(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}
