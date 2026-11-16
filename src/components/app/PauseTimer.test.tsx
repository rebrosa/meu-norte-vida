import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PauseTimer } from "./PauseTimer";

beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(new Date("2026-11-16T12:00:00Z")); });
afterEach(() => { cleanup(); vi.useRealTimers(); });

describe("Real 15-minute pause", () => {
  it("starts automatically at 15:00 and counts down every second", () => {
    render(<PauseTimer />);
    expect(screen.getByRole("timer")).toHaveTextContent("15:00");
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByRole("timer")).toHaveTextContent("14:59");
    act(() => vi.advanceTimersByTime(59000));
    expect(screen.getByRole("timer")).toHaveTextContent("14:00");
  });
  it("uses actual elapsed time when returning from a background tab", () => {
    render(<PauseTimer />);
    act(() => {
      vi.setSystemTime(new Date("2026-11-16T12:10:00Z"));
      window.dispatchEvent(new Event("focus"));
    });
    expect(screen.getByRole("timer")).toHaveTextContent("05:00");
  });
  it("ends after exactly 900 seconds and never goes negative", () => {
    render(<PauseTimer />);
    act(() => vi.advanceTimersByTime(899000));
    expect(screen.getByRole("timer")).toHaveTextContent("00:01");
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByRole("timer")).toHaveTextContent("00:00");
    expect(screen.getByRole("progressbar")).toHaveAttribute("value", "900");
    act(() => vi.advanceTimersByTime(60000));
    expect(screen.getByRole("timer")).toHaveTextContent("00:00");
  });
});