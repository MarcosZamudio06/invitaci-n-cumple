import { renderHook, act } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useCountdown } from "../hooks/useCountdown";
import { invitation } from "../config/invitation";
import { eventInstant, makeICS } from "../utils/event";
afterEach(() => vi.useRealTimers());
describe("Luci real event", () => {
  it("uses the confirmed Friday at 5 PM in Mexico City", () => {
    expect(invitation.name).toBe("Luci");
    expect(invitation.date).toBe("2026-11-13");
    expect(invitation.startTime).toBe("17:00");
    const instant = eventInstant(invitation)!;
    expect(instant.toISOString()).toBe("2026-11-13T23:00:00.000Z");
    expect(
      new Intl.DateTimeFormat("es-MX", {
        weekday: "long",
        timeZone: invitation.timeZone,
      }).format(instant),
    ).toBe("viernes");
  });
  it("exports a named venue without inventing an address or end time", () => {
    const ics = makeICS({
      ...invitation,
      name: "Luci",
      date: "2026-11-13",
      startTime: "17:00",
      venue: "Jardín D-GALICIA",
      address: "",
    });
    expect(ics).toContain("LOCATION:Jardín D-GALICIA\r\n");
    expect(ics).not.toContain("DTEND");
    expect(ics).not.toContain("DURATION");
  });
});
describe("useCountdown", () => {
  it("derives an accurate initial value, updates seconds and cleans timers", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-13T22:59:57Z"));
    const { result, unmount } = renderHook(() =>
      useCountdown("2026-11-13T23:00:00Z"),
    );
    expect(result.current?.seconds).toBe(3);
    act(() => vi.advanceTimersByTime(1000));
    expect(result.current?.seconds).toBe(2);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
  it("recomputes from actual time after tab returns", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-13T22:00:00Z"));
    const { result } = renderHook(() => useCountdown("2026-11-13T23:00:00Z"));
    vi.setSystemTime(new Date("2026-11-13T22:58:30Z"));
    act(() => document.dispatchEvent(new Event("visibilitychange")));
    expect(result.current?.minutes).toBe(1);
    expect(result.current?.seconds).toBe(30);
  });
  it("stops at zero once reached", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-13T22:59:59Z"));
    const { result } = renderHook(() => useCountdown("2026-11-13T23:00:00Z"));
    act(() => vi.advanceTimersByTime(5000));
    expect(result.current).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      started: true,
    });
    expect(vi.getTimerCount()).toBe(0);
  });
  it.each(["", "not-a-date"])(
    "never fabricates values for invalid target %s",
    (value) => {
      const { result } = renderHook(() => useCountdown(value));
      expect(result.current).toBeNull();
    },
  );
});
