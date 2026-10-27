import { useRef, type RefObject } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

/** Every animation belongs to the scoped context; StrictMode cleanup restores the DOM. */
export function useInvitationMotion(
  scope: RefObject<HTMLDivElement | null>,
  disabled: boolean,
) {
  const intro = useRef<gsap.core.Timeline | null>(null);
  const { contextSafe } = useGSAP(
    () => {
      if (disabled || !scope.current) return;
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const name = scope.current!.querySelector(".hero-name");
        if (!name) return;
        const split = SplitText.create(name, {
          type: "chars",
          mask: "chars",
          aria: "auto",
        });
        const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
        intro.current = timeline;
        timeline
          .from(".hero-water", { yPercent: 8, opacity: 0, duration: 1.2 })
          .from(
            split.chars,
            { yPercent: 105, rotate: 4, duration: 1.15, stagger: 0.09 },
            0.18,
          )
          .from(".hero-invite", { y: 18, opacity: 0, duration: 0.6 }, 0.85)
          .from(
            ".hero-meta > *",
            { y: 14, opacity: 0, duration: 0.55, stagger: 0.08 },
            1.1,
          )
          .from(
            ".hero-ring",
            { rotation: -18, scale: 0.92, opacity: 0, duration: 0.7 },
            0.45,
          )
          .to({}, { duration: 0.2 });

        const date = scope.current!.querySelector(".date-layout");
        gsap.from(".date-day", {
          y: 30,
          opacity: 0,
          duration: 0.7,
          scrollTrigger: { trigger: date, start: "top 85%", once: true },
        });
        const reminder = scope.current!.querySelector(".pool-reminder");
        const reminderTimeline = gsap.timeline({
          scrollTrigger: { trigger: reminder, start: "top 80%", once: true },
          defaults: { ease: "power3.out" },
        });
        reminderTimeline
          .from(".pool-reminder h2 span", {
            yPercent: 20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.07,
          })
          .from(
            ".reminder-ring",
            { rotation: -30, scale: 0.9, opacity: 0, duration: 0.8 },
            0.1,
          )
          .from(
            ".reminder-bubble",
            { y: 16, opacity: 0, duration: 0.5, stagger: 0.08 },
            0.35,
          );
        gsap.from(".rsvp-heading", {
          y: 22,
          opacity: 0,
          duration: 0.65,
          scrollTrigger: {
            trigger: ".rsvp-section",
            start: "top 85%",
            once: true,
          },
        });
        return () => {
          intro.current = null;
          split.revert();
        };
      });
      return () => media.revert();
    },
    { scope, dependencies: [disabled], revertOnUpdate: true },
  );

  const skipIntro = contextSafe(() => {
    intro.current?.progress(1);
  });
  return { skipIntro };
}
