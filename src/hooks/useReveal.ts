import { useEffect } from "react";
/** Progressive enhancement: content stays visible if observers are unsupported. */
export function useReveal(disabled: boolean) {
  useEffect(() => {
    if (disabled || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-visible", "true");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12 },
    );
    const elements = document.querySelectorAll("[data-reveal]");
    elements.forEach((element) => {
      element.setAttribute("data-visible", "false");
      observer.observe(element);
    });
    return () => {
      observer.disconnect();
      elements.forEach((element) => element.removeAttribute("data-visible"));
    };
  }, [disabled]);
}
