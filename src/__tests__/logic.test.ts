import { describe, it, expect } from "vitest";
import {
  eventInstant,
  countdown,
  makeICS,
  mapsUrl,
  validateRSVP,
} from "../utils/event";
const event = {
  name: "María",
  date: "2027-03-20",
  startTime: "20:00",
  endTime: "23:00",
  timeZone: "America/Mexico_City",
  venue: "Salón",
  address: "Calle 1, México",
};
import { buildWhatsAppMessage, buildWhatsAppUrl } from "../utils/whatsapp";
import { whatsappConfig } from "../config/whatsapp";
import { invitation } from "../config/invitation";
import type { RSVP } from "../utils/event";
const whatsappUrl = (phone: string, name: string, value: RSVP) =>
  buildWhatsAppUrl(buildWhatsAppMessage({ ...event, name }, value), {
    ...whatsappConfig,
    recipient: phone,
  });
describe("real event data", () => {
  it("uses Luci's configured exact Google Maps share link", () => {
    expect(mapsUrl(invitation)).toBe(
      "https://maps.app.goo.gl/EFvPumJwwkyL1Sry6",
    );
  });

  it("resolves IANA civil time independent of machine timezone", () =>
    expect(eventInstant(event)?.toISOString()).toBe(
      "2027-03-21T02:00:00.000Z",
    ));
  it.each([
    { ...event, date: "" },
    { ...event, date: "2027-02-30" },
    { ...event, timeZone: "Bad/Zone" },
    { ...event, startTime: "25:00" },
  ])("rejects missing/invalid dates", (e) =>
    expect(eventInstant(e)).toBeNull(),
  );
  it("rejects nonexistent DST time", () =>
    expect(
      eventInstant({
        ...event,
        date: "2027-03-14",
        startTime: "02:30",
        timeZone: "America/New_York",
      }),
    ).toBeNull());
  it("rejects ambiguous DST time", () =>
    expect(
      eventInstant({
        ...event,
        date: "2027-11-07",
        startTime: "01:30",
        timeZone: "America/New_York",
      }),
    ).toBeNull());
  it("counts remaining time and stops at zero", () => {
    expect(countdown(new Date(90061000), 0)).toEqual({
      days: 1,
      hours: 1,
      minutes: 1,
      seconds: 1,
      started: false,
    });
    expect(countdown(new Date(0), 1)!.started).toBe(true);
    expect(countdown(null, 1)).toBeNull();
  });
  it("exports escaped CRLF UTC calendar", () => {
    const value = makeICS(event, new Date("2026-01-01T00:00:00Z"));
    expect(value).toContain("DTSTART:20270321T020000Z\r\n");
    expect(value).toContain("LOCATION:Salón\\, Calle 1\\, México");
    expect(value).toContain("END:VCALENDAR\r\n");
  });
  it("blocks incomplete calendar and invalid end", () => {
    expect(() => makeICS({ ...event, venue: "" })).toThrow();
    expect(() => makeICS({ ...event, endTime: "19:00" })).toThrow();
  });
  it("folds UTF8 calendar lines at 75 octets", () => {
    for (const line of makeICS({ ...event, name: "Á".repeat(100) }).split(
      "\r\n",
    ))
      expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75);
  });
  it("builds encoded Google Maps links and rejects unsafe override", () => {
    expect(mapsUrl({ address: "México & Sol #1" })).toContain(
      encodeURIComponent("México & Sol #1"),
    );
    expect(mapsUrl({ address: "" })).toBeNull();
    expect(
      mapsUrl({ address: "", mapsLink: "javascript:alert(1)" }),
    ).toBeNull();
  });
  it("validates RSVP including max guests", () => {
    expect(
      validateRSVP({ name: "", attending: "yes", people: 1, message: "" }, 2),
    ).toBeTruthy();
    expect(
      validateRSVP(
        { name: "Ana", attending: "yes", people: 4, message: "" },
        2,
      ),
    ).toBeTruthy();
    expect(
      validateRSVP(
        { name: "Ana", attending: "yes", people: 2, message: "" },
        2,
      ),
    ).toBeNull();
  });
  it("encodes names, newlines and emoji for official WhatsApp", () => {
    const url = whatsappUrl("5215512345678", "María", {
      name: "Ana & José",
      attending: "yes",
      people: 2,
      message: "¡Sí! 🎉",
    });
    expect(url).toMatch(/^https:\/\/wa.me\/5215512345678\?text=/);
    expect(decodeURIComponent(url!.split("text=")[1])).toContain("Ana & José");
    expect(decodeURIComponent(url!.split("text=")[1])).toContain("2 personas");
    expect(
      whatsappUrl("", "María", {
        name: "Ana",
        attending: "no",
        people: 1,
        message: "",
      }),
    ).toBeNull();
  });
  it("does not claim attendance on a decline", () =>
    expect(
      decodeURIComponent(
        whatsappUrl("5215512345678", "María", {
          name: "Ana",
          attending: "no",
          people: 1,
          message: "",
        })!,
      ),
    ).toContain("no podré asistir"));
});
