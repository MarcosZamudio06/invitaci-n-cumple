import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { RSVPSection } from "../sections/RSVPSection";
import { invitation } from "../config/invitation";
afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});
it("enables real RSVP, shows the exact advance notice and reveals unrestricted count only for yes", async () => {
  render(<RSVPSection config={invitation} />);
  expect(
    screen.getByRole("button", { name: "CONFIRMAR POR WHATSAPP" }),
  ).toBeEnabled();
  expect(
    screen.getByText(
      "Se abrirá WhatsApp con tu mensaje preparado. Solo falta presionar Enviar.",
    ),
  ).toBeVisible();
  expect(
    screen.queryByLabelText("Personas, incluyéndote"),
  ).not.toBeInTheDocument();
  await userEvent.click(screen.getByLabelText("¡Claro que voy!"));
  const count = screen.getByLabelText("Personas, incluyéndote");
  expect(count).toHaveAttribute("type", "number");
  expect(count).toHaveValue(1);
  expect(count).not.toHaveAttribute("max");
  await userEvent.click(screen.getByLabelText("Esta vez no podré"));
  expect(
    screen.queryByLabelText("Personas, incluyéndote"),
  ).not.toBeInTheDocument();
});
it("opens synchronously from valid submit with no storage, blocks accidental double submit and allows retry", () => {
  vi.useFakeTimers();
  const opened = vi.spyOn(window, "open").mockReturnValue(null);
  const local = vi.spyOn(Storage.prototype, "setItem");
  const { container, unmount } = render(<RSVPSection config={invitation} />);
  fireEvent.change(screen.getByLabelText("Tu nombre"), {
    target: { value: "Ana" },
  });
  fireEvent.click(screen.getByLabelText("¡Claro que voy!"));
  fireEvent.change(screen.getByLabelText("Personas, incluyéndote"), {
    target: { value: "250" },
  });
  const form = container.querySelector("form")!;
  fireEvent.submit(form);
  expect(opened).toHaveBeenCalledTimes(1);
  expect(opened).toHaveBeenCalledWith(
    expect.stringContaining("https://wa.me/"),
    "_blank",
    "noopener,noreferrer",
  );
  fireEvent.submit(form);
  expect(opened).toHaveBeenCalledTimes(1);
  expect(local).not.toHaveBeenCalled();
  expect(screen.getByRole("status")).toHaveTextContent("preparado, no enviado");
  act(() => vi.advanceTimersByTime(800));
  fireEvent.submit(form);
  expect(opened).toHaveBeenCalledTimes(2);
  unmount();
  expect(vi.getTimerCount()).toBe(0);
});
it("validates configured companion limit, missing phone, blanks and decline", async () => {
  const open = vi.spyOn(window, "open").mockReturnValue(null);
  render(<RSVPSection config={{ ...invitation, maxCompanions: 1 }} />);
  await userEvent.click(
    screen.getByRole("button", { name: "CONFIRMAR POR WHATSAPP" }),
  );
  expect(open).not.toHaveBeenCalled();
  expect(screen.getByRole("alert")).toHaveTextContent("nombre");
  await userEvent.type(screen.getByPlaceholderText("Tu nombre"), "Ana");
  await userEvent.click(screen.getByLabelText("¡Claro que voy!"));
  expect(screen.getByLabelText("Personas, incluyéndote")).toHaveAttribute(
    "max",
    "2",
  );
  fireEvent.change(screen.getByLabelText("Personas, incluyéndote"), {
    target: { value: "3" },
  });
  await userEvent.click(
    screen.getByRole("button", { name: "CONFIRMAR POR WHATSAPP" }),
  );
  expect(open).not.toHaveBeenCalled();
  await userEvent.click(screen.getByLabelText("Esta vez no podré"));
  await userEvent.click(
    screen.getByRole("button", { name: "CONFIRMAR POR WHATSAPP" }),
  );
  expect(open).toHaveBeenCalledTimes(1);
});
it("retains honest disabled state for reusable missing phone config", () => {
  render(<RSVPSection config={{ ...invitation, whatsapp: "" }} />);
  expect(
    screen.getByRole("button", { name: "CONFIRMAR POR WHATSAPP" }),
  ).toBeDisabled();
  expect(screen.getByText(/Falta configurar el número receptor/)).toBeVisible();
});
it("recovers from a synchronous browser-opening error without permanently locking the form", () => {
  vi.useFakeTimers();
  const open = vi.spyOn(window, "open").mockImplementation(() => {
    throw new Error("blocked");
  });
  const { container, unmount } = render(<RSVPSection config={invitation} />);
  fireEvent.change(screen.getByLabelText("Tu nombre"), {
    target: { value: "Ana" },
  });
  fireEvent.click(screen.getByLabelText("Esta vez no podré"));
  expect(() =>
    fireEvent.submit(container.querySelector("form")!),
  ).not.toThrow();
  expect(screen.getByRole("alert")).toHaveTextContent(
    "No se pudo abrir WhatsApp",
  );
  expect(
    screen.getByRole("link", { name: "Volver a abrir WhatsApp" }),
  ).toBeVisible();
  open.mockReturnValue(null);
  act(() => vi.advanceTimersByTime(800));
  fireEvent.submit(container.querySelector("form")!);
  expect(open).toHaveBeenCalledTimes(2);
  unmount();
  expect(vi.getTimerCount()).toBe(0);
});
it("distinguishes sharing the prepared URL with WhatsApp from sending it to the recipient", () => {
  render(<RSVPSection config={invitation} />);
  expect(
    screen.getByText(
      "Al abrir WhatsApp, el mensaje preparado se comparte con ese servicio. Tú decides si lo envías al destinatario. Esta página no guarda tus respuestas.",
    ),
  ).toBeVisible();
  expect(
    screen.queryByText(/Se compartirán por WhatsApp cuando decidas enviar/),
  ).not.toBeInTheDocument();
});
