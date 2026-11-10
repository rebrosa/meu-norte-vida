import { describe, expect, it } from "vitest";
import { daysSince, formatCountdown, PAUSE_MINUTES } from "./dates";

describe("days since separation", () => {
  it("counts whole calendar days up to today", () => {
    expect(daysSince("2026-11-01", new Date(2026, 10, 10, 23, 30))).toBe(9);
  });
  it("is 0 on the day itself and never negative for future dates", () => {
    expect(daysSince("2026-11-10", new Date(2026, 10, 10, 8))).toBe(0);
    expect(daysSince("2026-12-01", new Date(2026, 10, 10))).toBe(0);
  });
  it("is empty when no date was given", () => {
    expect(daysSince(null)).toBeNull();
  });
});

describe("pause timer", () => {
  it("lasts 15 minutes and starts at 15:00", () => {
    expect(PAUSE_MINUTES).toBe(15);
    expect(formatCountdown(PAUSE_MINUTES * 60)).toBe("15:00");
    expect(formatCountdown(61)).toBe("01:01");
  });
});
