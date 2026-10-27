import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { expect, it } from "vitest";

gsap.registerPlugin(SplitText, ScrollTrigger);
it("loads real GSAP plugins and restores a real SplitText DOM split", () => {
  const heading = document.createElement("h1");
  heading.textContent = "LUCI";
  document.body.append(heading);
  const split = SplitText.create(heading, {
    type: "chars",
    mask: "chars",
    aria: "auto",
  });
  expect(split.chars).toHaveLength(4);
  expect(heading.getAttribute("aria-label")).toBe("LUCI");
  split.revert();
  expect(heading.textContent).toBe("LUCI");
  expect(heading.children).toHaveLength(0);
  heading.remove();
  expect(typeof ScrollTrigger.create).toBe("function");
});
it("reverts a real scoped timeline to its original object state", () => {
  const state = { value: 0 };
  const context = gsap.context(() => {
    const timeline = gsap.timeline({ paused: true });
    timeline.to(state, { value: 20, duration: 2, ease: "none" });
    timeline.progress(1);
  });
  expect(state.value).toBe(20);
  context.revert();
  expect(state.value).toBe(0);
});
