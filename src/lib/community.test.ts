import { describe, expect, it } from "vitest";
import { aliasProblem, allConsented, initialOf, validateDraft } from "./community";
const ok = {
  title: "Meu título",
  body: "x".repeat(50),
  theme: "saudade",
  pseudonym: "Flor",
  warnings: [],
};
const me = { name: "Maria Souza", email: "maria.souza@example.com" };

describe("community draft rules", () => {
  it("accepts a valid draft", () => expect(validateDraft(ok, me)).toBeNull());
  it("rejects body under 50 chars", () =>
    expect(validateDraft({ ...ok, body: "x".repeat(49) })).not.toBeNull());
  it("rejects unknown theme", () =>
    expect(validateDraft({ ...ok, theme: "outro" })).not.toBeNull());
  it("requires all three consents", () => {
    expect(allConsented({ rules: true, moderation: true, display: false })).toBe(false);
    expect(allConsented({ rules: true, moderation: true, display: true })).toBe(true);
  });
});

describe("nickname or initial only", () => {
  it("builds the initial from the first letter of the name", () => {
    expect(initialOf("Maria Souza")).toBe("M.");
    expect(initialOf("  élia")).toBe("É.");
    expect(initialOf("")).toBe("");
    expect(initialOf(null)).toBe("");
  });
  it("accepts a harmless nickname and the initial", () => {
    expect(aliasProblem("Flor do campo", me)).toBeNull();
    expect(validateDraft({ ...ok, pseudonym: "M." }, me)).toBeNull();
  });
  it("rejects the real first name, surname or e-mail name", () => {
    expect(aliasProblem("Maria", me)).not.toBeNull();
    expect(aliasProblem("maria souza", me)).not.toBeNull();
    expect(aliasProblem("Souza", me)).not.toBeNull();
    expect(aliasProblem("maria.souza", me)).not.toBeNull();
  });
  it("ignores accents when comparing", () => {
    expect(aliasProblem("Mária", me)).not.toBeNull();
  });
  it("rejects e-mails, sites and phone numbers", () => {
    expect(aliasProblem("flor@mail.com", me)).not.toBeNull();
    expect(aliasProblem("www.flor.com", me)).not.toBeNull();
    expect(aliasProblem("11 98765-4321", me)).not.toBeNull();
  });
  it("does not block unrelated words that merely contain a short name", () => {
    expect(aliasProblem("Mariposa", { name: "Ana Lima", email: "" })).toBeNull();
  });
});
