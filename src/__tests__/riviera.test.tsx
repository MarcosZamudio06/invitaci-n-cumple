import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import App from "../App";
import { invitation } from "../config/invitation";
it("replaces the whole invitation with confirmed coastal birthday content", () => {
  const { container } = render(
    <App
      config={{
        ...invitation,
        effects: { animations: false, particles: false },
      }}
    />,
  );
  expect(screen.getByRole("heading", { level: 1, name: "LUCI" })).toBeVisible();
  expect(
    screen.getByRole("heading", { name: "¡YA CASI ES EL DÍA!" }),
  ).toBeVisible();
  expect(screen.getByText("VIERNES")).toBeVisible();
  expect(screen.getByText("5:00 PM")).toBeVisible();
  expect(
    screen.getByRole("heading", { name: "Jardín D-GALICIA" }),
  ).toBeVisible();
  expect(
    screen.getByRole("heading", {
      name: "¡NO OLVIDES LLEVAR TU TRAJE DE BAÑO!",
    }),
  ).toBeVisible();
  expect(
    screen.getByRole("button", { name: "CONFIRMAR POR WHATSAPP" }),
  ).toBeEnabled();
  expect(screen.getByRole("button", { name: "CÓMO LLEGAR" })).toBeDisabled();
  expect(
    screen.queryByText(/demostración|Midnight|para siempre/i),
  ).not.toBeInTheDocument();
  const sections = [...container.querySelectorAll("main>section")].map(
    (s) => s.id,
  );
  expect(sections).toEqual([
    "top",
    "countdown",
    "details",
    "location",
    "pool-reminder",
    "memories",
    "rsvp",
  ]);
});
