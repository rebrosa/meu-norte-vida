import { describe, expect, it } from "vitest";
import { allConsented, validateDraft } from "./community";
const ok = { title: "Meu título", body: "x".repeat(50), theme: "saudade", pseudonym: "Flor", warnings: [] };
describe("community draft rules", () => {
  it("accepts a valid draft", () => expect(validateDraft(ok)).toBeNull());
  it("rejects body under 50 chars", () => expect(validateDraft({ ...ok, body: "x".repeat(49) })).not.toBeNull());
  it("rejects unknown theme", () => expect(validateDraft({ ...ok, theme: "outro" })).not.toBeNull());
  it("requires all three consents", () => {
    expect(allConsented({ rules: true, moderation: true, display: false })).toBe(false);
    expect(allConsented({ rules: true, moderation: true, display: true })).toBe(true);
  });
});
