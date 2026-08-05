"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("reveal-enabled");
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );

    if (targets.length === 0) {
      return () => root.classList.remove("reveal-enabled");
    }

    if (!("IntersectionObserver" in window)) {
      targets.forEach((target) => target.classList.add("is-visible"));
      return () => root.classList.remove("reveal-enabled");
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
    );

    targets.forEach((target) => observer.observe(target));

    return () => {
      observer.disconnect();
      root.classList.remove("reveal-enabled");
    };
  }, [pathname]);

  return null;
}
