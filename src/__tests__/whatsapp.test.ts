import { describe, expect, it } from "vitest";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "../utils/whatsapp";
import { whatsappConfig } from "../config/whatsapp";
import { invitation } from "../config/invitation";
import { validateRSVP, type RSVP } from "../utils/event";
const guest: RSVP = {
  name: " Ana & José ",
  attending: "yes",
  people: 3,
  message: " ¡Feliz cumple! 🥳\nNos vemos #1 + 2 ",
};
describe("personalized WhatsApp message", () => {
  it("uses one real centralized recipient and official endpoint", () => {
    expect(whatsappConfig).toEqual({
      recipient: "522961166993",
      baseUrl: "https://wa.me/",
    });
    expect(invitation.whatsapp).toBe(whatsappConfig.recipient);
    expect(invitation.maxCompanions).toBeUndefined();
    expect(invitation.eventType).toBe("birthday");
    expect(invitation.eventTheme).toBe("riviera-pool-party");
  });
  it("includes real civil date/time/venue and preserves personal unicode content", () => {
    const msg = buildWhatsAppMessage(invitation, guest)!;
    expect(msg).toContain("¡Hola! 🌊");
    expect(msg).toContain("Soy Ana & José y confirmo mi asistencia");
    expect(msg).toContain("al cumpleaños de Luci. 🎉");
    expect(msg).toContain("📅 Viernes 13 de noviembre");
    expect(msg).toContain("🕔 5:00 PM");
    expect(msg).toContain("📍 Jardín D-GALICIA");
    expect(msg).toContain("👥 Asistiremos 3 personas.");
    expect(msg).toContain(
      "💌 Mensaje para Luci:\n¡Feliz cumple! 🥳\nNos vemos #1 + 2",
    );
    expect(msg).toContain("¡Nos vemos en la fiesta! 🏖️");
    const url = buildWhatsAppUrl(msg)!;
    expect(url).toMatch(/^https:\/\/wa.me\/522961166993\?text=/);
    expect(new URL(url).searchParams.get("text")).toBe(msg);
  });
  it("omits empty optional message sections", () => {
    const msg = buildWhatsAppMessage(invitation, { ...guest, message: "   " })!;
    expect(msg).not.toContain("💌");
    expect(msg).not.toContain("Mensaje para");
  });
  it("builds a warm decline without guest count or positive confirmation", () => {
    const msg = buildWhatsAppMessage(invitation, {
      ...guest,
      attending: "no",
      people: NaN,
    })!;
    expect(msg).toContain("¡Hola! 🌷");
    expect(msg).toContain("Lamentablemente no podré asistir.");
    expect(msg).toContain("💌 Mi mensaje:");
    expect(msg).not.toContain("👥");
    expect(msg).not.toContain("confirmo mi asistencia");
  });
  it("uses configured names, date and venue rather than hardcoding event details", () => {
    const msg = buildWhatsAppMessage(
      {
        ...invitation,
        name: "Luna",
        date: "2027-03-20",
        startTime: "20:00",
        venue: "Otro jardín",
      },
      guest,
    )!;
    expect(msg).toContain("cumpleaños de Luna");
    expect(msg).toContain("Sábado 20 de marzo");
    expect(msg).toContain("8:00 PM");
    expect(msg).toContain("Otro jardín");
    expect(msg).not.toContain("Luci");
  });
  it("does not keep the old hidden 100-person cap", () => {
    const value = { ...guest, people: 250, message: "" };
    expect(validateRSVP(value)).toBeNull();
    expect(buildWhatsAppMessage(invitation, value)).toContain("250 personas");
  });
  it("enforces explicit optional caps and rejects unsafe/noninteger counts", () => {
    expect(validateRSVP({ ...guest, people: 3 }, 2)).toBeTruthy();
    for (const people of [
      0,
      -1,
      1.5,
      NaN,
      Infinity,
      Number.MAX_SAFE_INTEGER + 1,
    ])
      expect(validateRSVP({ ...guest, people })).toBeTruthy();
    expect(validateRSVP({ ...guest, people: 1 }, 1)).toBeNull();
  });
  it("rejects blanks, missing positive event data and invalid recipient/protocol", () => {
    expect(
      buildWhatsAppMessage(invitation, { ...guest, name: " " }),
    ).toBeNull();
    expect(buildWhatsAppMessage({ ...invitation, date: "" }, guest)).toBeNull();
    expect(
      buildWhatsAppUrl("Message", { ...whatsappConfig, recipient: "" }),
    ).toBeNull();
    expect(
      buildWhatsAppUrl("Message", { ...whatsappConfig, recipient: "+52 296" }),
    ).toBeNull();
    expect(
      buildWhatsAppUrl("Message", {
        ...whatsappConfig,
        baseUrl: "javascript:alert(1)",
      }),
    ).toBeNull();
  });
});
