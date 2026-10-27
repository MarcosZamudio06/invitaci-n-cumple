export interface WhatsAppConfig {
  recipient: string;
  baseUrl: string;
}
/** Public contact endpoint. Never store submissions or log personal guest input. */
export const whatsappConfig: WhatsAppConfig = {
  recipient: "522961166993",
  baseUrl: "https://wa.me/",
};
