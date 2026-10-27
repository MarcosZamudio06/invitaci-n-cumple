import { StrictMode, useRef } from "react";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
const records = vi.hoisted(() => ({
  mediaRevert: vi.fn(),
  splitRevert: vi.fn(),
  split: vi.fn(),
  timelines: vi.fn(),
  from: vi.fn(),
  fromTo: vi.fn(),
  pause: vi.fn(),
  resume: vi.fn(),
}));
vi.mock("gsap", async () => {
  const actual = await vi.importActual<typeof import("gsap")>("gsap");
  return {
    ...actual,
    gsap: {
      ...actual.gsap,
      registerPlugin: vi.fn(),
      from: records.from,
      fromTo: records.fromTo,
      timeline: () => {
        records.timelines();
        const chain = {
          from: vi.fn().mockReturnThis(),
          to: vi.fn().mockReturnThis(),
          progress: vi.fn().mockReturnValue(0.5),
          paused: vi.fn().mockReturnValue(false),
          pause: records.pause,
          resume: records.resume,
        };
        return chain;
      },
      matchMedia: () => {
        let cleanup: (() => void) | undefined;
        return {
          add: (_query: string, callback: () => void | (() => void)) => {
            cleanup = callback() || undefined;
          },
          revert: () => {
            cleanup?.();
            records.mediaRevert();
          },
        };
      },
    },
  };
});
vi.mock("gsap/SplitText", () => ({
  SplitText: {
    create: () => {
      records.split();
      return { chars: [], revert: records.splitRevert };
    },
  },
}));
vi.mock("gsap/ScrollTrigger", () => ({ ScrollTrigger: {} }));
import { useInvitationMotion } from "../hooks/useInvitationMotion";
function Fixture({ disabled = false }: { disabled?: boolean }) {
  const scope = useRef<HTMLDivElement>(null);
  useInvitationMotion(scope, disabled);
  return (
    <div ref={scope}>
      <h1 className="hero-name">LUCI</h1>
      <div className="date-layout" />
      <div className="pool-reminder" />
    </div>
  );
}
describe("GSAP ownership lifecycle", () => {
  it("reverts matchMedia and split DOM on StrictMode replay and unmount", () => {
    records.mediaRevert.mockClear();
    records.splitRevert.mockClear();
    const { unmount } = render(
      <StrictMode>
        <Fixture />
      </StrictMode>,
    );
    expect(records.splitRevert).toHaveBeenCalledTimes(1);
    unmount();
    expect(records.mediaRevert).toHaveBeenCalledTimes(2);
    expect(records.splitRevert).toHaveBeenCalledTimes(2);
  });
  it("does not split or create timelines when animations disabled", () => {
    records.split.mockClear();
    records.timelines.mockClear();
    render(<Fixture disabled />);
    expect(records.split).not.toHaveBeenCalled();
    expect(records.timelines).not.toHaveBeenCalled();
  });
});

it("pauses owned timelines while hidden, resumes and removes visibility listener on cleanup", () => {
  records.pause.mockClear();
  records.resume.mockClear();
  let hidden = false;
  vi.spyOn(document, "hidden", "get").mockImplementation(() => hidden);
  const { unmount } = render(<Fixture />);
  hidden = true;
  document.dispatchEvent(new Event("visibilitychange"));
  expect(records.pause).toHaveBeenCalled();
  hidden = false;
  document.dispatchEvent(new Event("visibilitychange"));
  expect(records.resume).toHaveBeenCalled();
  unmount();
  const count = records.pause.mock.calls.length;
  hidden = true;
  document.dispatchEvent(new Event("visibilitychange"));
  expect(records.pause).toHaveBeenCalledTimes(count);
  vi.restoreAllMocks();
});
