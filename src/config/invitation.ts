import { whatsappConfig } from "./whatsapp.ts";

export interface Photo {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

export interface InvitationConfig {
  name: string;
  eventType: "birthday";
  eventTheme: "riviera-pool-party";
  age?: number;
  message: string;
  welcome: string;
  /** Civil date YYYY-MM-DD and 24-hour HH:mm, resolved in the IANA time zone. */
  date: string;
  startTime: string;
  endTime?: string;
  timeZone: string;
  venue: string;
  /** Leave unknown addresses blank. A venue name does not identify a map location. */
  address: string;
  directions?: string;
  coordinates?: { lat: number; lng: number };
  mapsLink?: string;
  dressCode?: {
    name: string;
    description: string;
    colors?: { name: string; hex: string }[];
    restrictions?: string;
    reference?: Photo;
  };
  photos: Photo[];
  heroImage?: Photo;
  /** Local public/ file, owned or licensed. Playback requires a dedicated user action. */
  music?: { src: string; loop: boolean };
  /** International number: country code + digits, without +, spaces or punctuation. */
  whatsapp: string;
  confirmationMessage: string;
  /** Optional additional-guest limit. Undefined/null means no event cap was supplied. */
  maxCompanions?: number | null;
  theme: {
    background: string;
    surface: string;
    text: string;
    ivory: string;
    water: string;
    sage: string;
    deepTeal: string;
    champagne: string;
    dustyCoral: string;
    focusRing: string;
  };
  effects: { animations: boolean; particles: boolean };
  seo: { title: string; description: string; socialImage: string };
}

export const invitation: InvitationConfig = {
  name: "Luci",
  eventType: "birthday",
  eventTheme: "riviera-pool-party",
  message:
    "Un cumpleaños, un chapuzón y todos mis favoritos en el mismo lugar.",
  welcome: "¡Ven a celebrar conmigo!",
  date: "2026-11-13",
  startTime: "17:00",
  timeZone: "America/Mexico_City",
  venue: "Jardín D-GALICIA",
  address: "",
  mapsLink: "https://maps.app.goo.gl/EFvPumJwwkyL1Sry6",
  photos: [],
  whatsapp: whatsappConfig.recipient,
  confirmationMessage: "¡Nos vemos en la fiesta! 🏖️",

  theme: {
    background: "#F8F6F0",
    surface: "#FFFFFF",
    text: "#244D55",
    ivory: "#F8F6F0",
    water: "#D6E9E7",
    sage: "#A9C2B5",
    deepTeal: "#244D55",
    champagne: "#D9C6A5",
    dustyCoral: "#C98E81",
    focusRing: "#244D55",
  },
  effects: { animations: true, particles: true },
  seo: {
    title: "Cumpleaños de Luci | Pool Party",
    description:
      "¡Estás invitado al cumpleaños de Luci! Viernes 13 de noviembre a las 5:00 PM en Jardín D-GALICIA. ¡No olvides tu traje de baño!",
    socialImage: "social.png",
  },
};
