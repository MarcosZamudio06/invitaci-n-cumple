import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect } from "vitest";
import axe from "axe-core";
import App from "../App";
import { Gallery } from "../components/Gallery";
import { AudioPlayer } from "../components/AudioPlayer";
import { RSVPSection } from "../sections/RSVPSection";
import { invitation } from "../config/invitation";
const photos = [
  { src: "images/one.jpg", alt: "Primer recuerdo" },
  { src: "images/two.jpg", alt: "Segundo recuerdo" },
];
describe("complete invitation", () => {
  it("shows confirmed data while gating missing contact and map", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { level: 1, name: "LUCI" }),
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: /AGREGAR A MI CALENDARIO/ }),
    ).toBeEnabled();
    expect(
      screen.getByRole("button", { name: "CONFIRMAR POR WHATSAPP" }),
    ).toBeEnabled();
    expect(screen.getByRole("button", { name: "CÓMO LLEGAR" })).toBeDisabled();
    expect(screen.getByText("SEGUNDOS")).toBeVisible();
    expect(
      screen.queryByRole("button", { name: "Activar música" }),
    ).not.toBeInTheDocument();
  });
  it("keeps the details link keyboard reachable without an intro gate", async () => {
    render(<App />);
    const link = screen.getByRole("link", { name: "VER EL PLAN" });
    link.focus();
    expect(link).toHaveFocus();
    expect(link).toHaveAttribute("href", "#details");
    await userEvent.keyboard("{Enter}");
    expect(
      screen.getByRole("button", { name: /AGREGAR A MI CALENDARIO/ }),
    ).toBeEnabled();
  });
  it("applies reduced motion preference", () => {
    vi.mocked(window.matchMedia).mockReturnValueOnce({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList);
    const { container } = render(<App />);
    expect(container.querySelector(".invitation")).toHaveAttribute(
      "data-motion",
      "reduced",
    );
  });
  it("has no automated accessibility violations in demo markup (contrast excluded without layout)", async () => {
    const { container } = render(<App />);
    const result = await axe.run(container, {
      rules: { "color-contrast": { enabled: false } },
    });
    expect(result.violations.map((v) => v.id)).toEqual([]);
  });
});
describe("gallery", () => {
  it("renders decorative alternative when photos absent", () => {
    render(<Gallery photos={[]} />);
    expect(
      screen.getByRole("img", { name: /Ilustración original de una alberca/ }),
    ).toBeVisible();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
  it("opens, navigates arrows and closes with Escape, returning focus", async () => {
    render(<Gallery photos={photos} />);
    const trigger = screen.getByRole("button", {
      name: "Ampliar: Primer recuerdo",
    });
    await userEvent.click(trigger);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("open");
    fireEvent.keyDown(dialog, { key: "ArrowRight" });
    expect(screen.getByText("2 / 2")).toBeInTheDocument();
    fireEvent.keyDown(dialog, { key: "ArrowLeft" });
    expect(screen.getByText("1 / 2")).toBeInTheDocument();
    fireEvent.keyDown(dialog, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
  it("handles photo errors without broken image glyphs", async () => {
    render(<Gallery photos={[photos[0]]} />);
    fireEvent.error(screen.getByRole("img", { name: photos[0].alt }));
    expect(screen.getByText("Fotografía no disponible")).toBeVisible();
  });
  it("navigates on horizontal touch swipe", async () => {
    render(<Gallery photos={photos} />);
    await userEvent.click(
      screen.getByRole("button", { name: "Ampliar: Primer recuerdo" }),
    );
    const dialog = screen.getByRole("dialog");
    fireEvent.touchStart(dialog, { touches: [{ clientX: 200, clientY: 100 }] });
    fireEvent.touchEnd(dialog, {
      changedTouches: [{ clientX: 90, clientY: 105 }],
    });
    expect(screen.getByText("2 / 2")).toBeInTheDocument();
  });
});
describe("music explicit interaction only", () => {
  it("is absent without a file", () => {
    const { container } = render(<AudioPlayer />);
    expect(container).toBeEmptyDOMElement();
  });
  it("plays only after click, supports pause and error retry", async () => {
    const play = vi
      .spyOn(HTMLMediaElement.prototype, "play")
      .mockResolvedValue();
    const pause = vi
      .spyOn(HTMLMediaElement.prototype, "pause")
      .mockImplementation(() => {});
    render(<AudioPlayer music={{ src: "music/owned.mp3", loop: true }} />);
    expect(play).not.toHaveBeenCalled();
    await userEvent.click(
      screen.getByRole("button", { name: "Activar música" }),
    );
    expect(
      screen.getByRole("button", { name: "Pausar música" }),
    ).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(
      screen.getByRole("button", { name: "Pausar música" }),
    );
    expect(pause).toHaveBeenCalled();
    play.mockRejectedValueOnce(new Error("blocked"));
    await userEvent.click(
      screen.getByRole("button", { name: "Activar música" }),
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      "No se pudo reproducir",
    );
    play.mockRestore();
    pause.mockRestore();
  });
});
describe("RSVP", () => {
  it("validates name and selection before opening WhatsApp", async () => {
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    render(
      <RSVPSection
        config={{
          ...invitation,
          whatsapp: "5215512345678",
          name: "María",
          maxCompanions: 1,
        }}
      />,
    );
    await userEvent.click(
      screen.getByRole("button", { name: "CONFIRMAR POR WHATSAPP" }),
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Escribe tu nombre");
    expect(open).not.toHaveBeenCalled();
    await userEvent.type(screen.getByLabelText("Tu nombre"), "Ana & José");
    await userEvent.click(screen.getByLabelText("¡Claro que voy!"));
    fireEvent.change(screen.getByLabelText("Personas, incluyéndote"), {
      target: { value: "2" },
    });
    await userEvent.click(
      screen.getByRole("button", { name: "CONFIRMAR POR WHATSAPP" }),
    );
    expect(open).toHaveBeenCalledWith(
      expect.stringContaining("https://wa.me/5215512345678?text="),
      "_blank",
      "noopener,noreferrer",
    );
    expect(screen.getByRole("status")).toHaveTextContent("no enviado");
    open.mockRestore();
  });
  it("does not call a missing recipient a success", () => {
    render(<RSVPSection config={{ ...invitation, whatsapp: "" }} />);
    expect(
      screen.getByText(/falta configurar el número receptor/i),
    ).toBeVisible();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
describe("disabled animations and fallback handling", () => {
  it("keeps all content visible with animations disabled", () => {
    const { container } = render(
      <App
        config={{
          ...invitation,
          effects: { animations: false, particles: false },
        }}
      />,
    );
    expect(container.querySelector(".invitation")).toHaveAttribute(
      "data-motion",
      "reduced",
    );
    expect(
      screen.getByRole("heading", { level: 1, name: "LUCI" }),
    ).toBeVisible();
  });
});
describe("configured optional branches", () => {
  it("does not claim dress code is undefined when optional colors are absent", () => {
    render(
      <App
        config={{
          ...invitation,
          dressCode: { name: "Cocktail", description: "Una noche elegante." },
        }}
      />,
    );
    expect(screen.getByText("Cocktail")).toBeVisible();
    expect(
      screen.queryByText("Sin código de vestimenta definido"),
    ).not.toBeInTheDocument();
  });
  it("marks audio loading/errors as persistent mobile feedback", async () => {
    const play = vi
      .spyOn(HTMLMediaElement.prototype, "play")
      .mockRejectedValue(new Error("unavailable"));
    render(<AudioPlayer music={{ src: "music/test.mp3", loop: false }} />);
    await userEvent.click(
      screen.getByRole("button", { name: "Activar música" }),
    );
    expect(screen.getByRole("status")).toHaveClass("audio-feedback");
    expect(screen.getByRole("button")).toHaveAccessibleName(
      "Reintentar música",
    );
    play.mockRestore();
  });
});
