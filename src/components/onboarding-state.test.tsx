import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { OnboardingState } from "./onboarding-state";

describe("OnboardingState", () => {
  afterEach(() => vi.useRealTimers());

  it("stops automatic retries and exposes a manual retry action", () => {
    vi.useFakeTimers();
    const retry = vi.fn();
    render(
      <OnboardingState maxAttempts={2} retryDelayMs={1000} onRetry={retry} />,
    );

    act(() => vi.advanceTimersByTime(1000));
    act(() => vi.advanceTimersByTime(1000));

    expect(retry).toHaveBeenCalledTimes(2);
    expect(
      screen.getByRole("button", { name: "Tentar novamente" }),
    ).toBeVisible();
  });
});
