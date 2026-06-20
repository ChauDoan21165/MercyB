import { describe, expect, it } from "vitest";

import {
  fadeIn,
  glowPulse,
  hoverScale,
  modalVariants,
  overlayVariants,
  pageTransition,
  pressScale,
  scaleIn,
  slideUp,
  slowTransition,
  smoothTransition,
  springTransition,
  staggerContainer,
  staggerItem,
} from "../animations";
import type * as animationExports from "../animations";

type AnimationExports = typeof animationExports;
type ExportName = keyof AnimationExports;

const exportedNames = [
  "springTransition",
  "smoothTransition",
  "slowTransition",
  "fadeIn",
  "slideUp",
  "scaleIn",
  "staggerContainer",
  "staggerItem",
  "pageTransition",
  "modalVariants",
  "overlayVariants",
  "hoverScale",
  "pressScale",
  "glowPulse",
] satisfies ExportName[];

const exportedValues: Record<ExportName, unknown> = {
  springTransition,
  smoothTransition,
  slowTransition,
  fadeIn,
  slideUp,
  scaleIn,
  staggerContainer,
  staggerItem,
  pageTransition,
  modalVariants,
  overlayVariants,
  hoverScale,
  pressScale,
  glowPulse,
};

const variantState = (
  variants: Record<string, unknown>,
  state: string,
): Record<string, unknown> => variants[state] as Record<string, unknown>;

const transitionDuration = (transition: unknown): number =>
  (transition as { duration: number }).duration;

describe("animations hardening contracts", () => {
  it("imports every public export explicitly", () => {
    expect(exportedNames).toEqual([
      "springTransition",
      "smoothTransition",
      "slowTransition",
      "fadeIn",
      "slideUp",
      "scaleIn",
      "staggerContainer",
      "staggerItem",
      "pageTransition",
      "modalVariants",
      "overlayVariants",
      "hoverScale",
      "pressScale",
      "glowPulse",
    ]);

    expect(Object.keys(exportedValues)).toEqual(exportedNames);
    expect(Object.values(exportedValues).every(Boolean)).toBe(true);
  });

  it("keeps spring and tween transitions deterministic", () => {
    expect(springTransition).toEqual({
      type: "spring",
      stiffness: 400,
      damping: 30,
    });

    expect(smoothTransition).toEqual({
      type: "tween",
      duration: 0.2,
      ease: [0.16, 1, 0.3, 1],
    });

    expect(slowTransition).toEqual({
      type: "tween",
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
    });
  });

  it("uses separate transition objects for distinct motion speeds", () => {
    expect(springTransition).not.toBe(smoothTransition);
    expect(smoothTransition).not.toBe(slowTransition);
    expect(transitionDuration(slowTransition)).toBeGreaterThan(
      transitionDuration(smoothTransition),
    );
  });

  it("defines fade and entrance variants with expected hidden and visible states", () => {
    expect(fadeIn).toEqual({
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: smoothTransition,
      },
    });

    expect(slideUp).toEqual({
      hidden: {
        opacity: 0,
        y: 20,
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: springTransition,
      },
    });

    expect(scaleIn).toEqual({
      hidden: {
        opacity: 0,
        scale: 0.95,
      },
      visible: {
        opacity: 1,
        scale: 1,
        transition: springTransition,
      },
    });
  });

  it("preserves shared transition references inside variants", () => {
    expect(variantState(fadeIn, "visible").transition).toBe(smoothTransition);
    expect(variantState(slideUp, "visible").transition).toBe(
      springTransition,
    );
    expect(variantState(scaleIn, "visible").transition).toBe(
      springTransition,
    );
    expect(variantState(staggerItem, "visible").transition).toBe(
      smoothTransition,
    );
    expect(variantState(pageTransition, "animate").transition).toBe(
      slowTransition,
    );
    expect(variantState(pageTransition, "exit").transition).toBe(
      smoothTransition,
    );
    expect(variantState(modalVariants, "visible").transition).toBe(
      springTransition,
    );
    expect(variantState(modalVariants, "exit").transition).toBe(
      smoothTransition,
    );
  });

  it("defines stagger container and item choreography", () => {
    expect(staggerContainer).toEqual({
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.05,
          delayChildren: 0.1,
        },
      },
    });

    expect(staggerItem).toEqual({
      hidden: { opacity: 0, y: 10 },
      visible: {
        opacity: 1,
        y: 0,
        transition: smoothTransition,
      },
    });
  });

  it("defines page transition states for initial, animate, and exit", () => {
    expect(pageTransition).toEqual({
      initial: { opacity: 0, x: -20 },
      animate: {
        opacity: 1,
        x: 0,
        transition: slowTransition,
      },
      exit: {
        opacity: 0,
        x: 20,
        transition: smoothTransition,
      },
    });
  });

  it("defines modal and overlay enter and exit states", () => {
    expect(modalVariants).toEqual({
      hidden: {
        opacity: 0,
        scale: 0.9,
      },
      visible: {
        opacity: 1,
        scale: 1,
        transition: springTransition,
      },
      exit: {
        opacity: 0,
        scale: 0.95,
        transition: smoothTransition,
      },
    });

    expect(overlayVariants).toEqual({
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { duration: 0.2 },
      },
      exit: {
        opacity: 0,
        transition: { duration: 0.15 },
      },
    });
  });

  it("defines interaction target states with short deterministic durations", () => {
    expect(hoverScale).toEqual({
      scale: 1.02,
      transition: { duration: 0.15 },
    });

    expect(pressScale).toEqual({
      scale: 0.98,
      transition: { duration: 0.1 },
    });

    expect(pressScale.scale).toBeLessThan(1);
    expect(hoverScale.scale).toBeGreaterThan(1);
    expect(pressScale.transition.duration).toBeLessThan(
      hoverScale.transition.duration,
    );
  });

  it("defines glow pulse as an infinite repeating keyframe animation", () => {
    expect(glowPulse).toEqual({
      scale: [1, 1.05, 1],
      opacity: [1, 0.8, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    });

    expect(glowPulse.scale).toHaveLength(glowPulse.opacity.length);
    expect(glowPulse.scale.at(0)).toBe(glowPulse.scale.at(-1));
    expect(glowPulse.opacity.at(0)).toBe(glowPulse.opacity.at(-1));
  });

  it("does not expose functions or promises that would create async test flake", () => {
    for (const [name, value] of Object.entries(exportedValues)) {
      expect(typeof value, `${name} should be a static config object`).toBe(
        "object",
      );
      expect(value, `${name} should not be null`).not.toBeNull();
      expect(value, `${name} should not be thenable`).not.toHaveProperty(
        "then",
      );
    }
  });

  it("keeps numeric motion values finite except explicit infinite repeat", () => {
    const walk = (value: unknown, path: string) => {
      if (typeof value === "number") {
        if (path === "glowPulse.transition.repeat") {
          expect(value).toBe(Infinity);
          return;
        }

        expect(Number.isFinite(value), `${path} must be finite`).toBe(true);
        return;
      }

      if (!value || typeof value !== "object") {
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((item, index) => walk(item, `${path}.${index}`));
        return;
      }

      for (const [key, child] of Object.entries(value)) {
        walk(child, `${path}.${key}`);
      }
    };

    for (const [name, value] of Object.entries(exportedValues)) {
      walk(value, name);
    }
  });

  it("keeps all durations non-negative and under the interaction budget", () => {
    const durations: Array<[string, number]> = [
      ["smoothTransition.duration", transitionDuration(smoothTransition)],
      ["slowTransition.duration", transitionDuration(slowTransition)],
      [
        "overlayVariants.visible.transition.duration",
        transitionDuration(variantState(overlayVariants, "visible").transition),
      ],
      [
        "overlayVariants.exit.transition.duration",
        transitionDuration(variantState(overlayVariants, "exit").transition),
      ],
      ["hoverScale.transition.duration", hoverScale.transition.duration],
      ["pressScale.transition.duration", pressScale.transition.duration],
      ["glowPulse.transition.duration", glowPulse.transition.duration],
    ];

    for (const [name, duration] of durations) {
      expect(duration, name).toBeGreaterThanOrEqual(0);
      expect(duration, name).toBeLessThanOrEqual(2);
    }
  });
});
