import { act, render } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
const animate = vi.hoisted(() => vi.fn());
vi.mock("gsap", async () => {
  const actual = await vi.importActual<typeof import("gsap")>("gsap");
  return { ...actual, gsap: { ...actual.gsap, fromTo: animate } };
});
import { Countdown } from "../components/Countdown";
afterEach(() => {
  vi.useRealTimers();
  animate.mockClear();
});
it("animates only the changed seconds block at 220ms, not every countdown cell", () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-11-13T22:58:40Z"));
  const { unmount, container } = render(
    <Countdown targetDate="2026-11-13T23:00:00Z" disabled={false} />,
  );
  expect(animate).not.toHaveBeenCalled();
  act(() => vi.advanceTimersByTime(1000));
  expect(animate).toHaveBeenCalledTimes(1);
  expect(animate.mock.calls[0][0]).toHaveTextContent("19");
  expect(animate.mock.calls[0][2]).toMatchObject({ duration: 0.22 });
  expect(container.querySelector(".countdown")).toHaveAttribute(
    "aria-live",
    "off",
  );
  unmount();
});
it("keeps changed numbers static under reduced-motion/disabled mode", () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-11-13T22:58:40Z"));
  const { unmount } = render(
    <Countdown targetDate="2026-11-13T23:00:00Z" disabled />,
  );
  act(() => vi.advanceTimersByTime(1000));
  expect(animate).not.toHaveBeenCalled();
  unmount();
});
