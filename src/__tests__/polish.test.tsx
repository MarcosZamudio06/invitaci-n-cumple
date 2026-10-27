import { render } from "@testing-library/react";
import { expect, it } from "vitest";
import App from "../App";
import { invitation } from "../config/invitation";
it("exposes definitive semantic palette aliases while keeping existing theme tokens", () => {
  const { container } = render(
    <App
      config={{
        ...invitation,
        effects: { animations: false, particles: false },
      }}
    />,
  );
  const root = container.querySelector<HTMLElement>(".invitation")!;
  expect(root.style.getPropertyValue("--text-primary")).toBe("#244D55");
  expect(root.style.getPropertyValue("--background-primary")).toBe("#F8F6F0");
  expect(root.style.getPropertyValue("--surface")).toBe("#FFFFFF");
  expect(root.style.getPropertyValue("--water")).toBe("#D6E9E7");
});

it("uses the definitive metadata copy", () => {
  expect(invitation.seo.description).toBe(
    "¡Estás invitado al cumpleaños de Luci! Viernes 13 de noviembre a las 5:00 PM en Jardín D-GALICIA. ¡No olvides tu traje de baño!",
  );
});
