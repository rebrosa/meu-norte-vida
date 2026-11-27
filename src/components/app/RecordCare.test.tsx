import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { I18nProvider } from "@/lib/i18n";
import { RecordCare } from "./RecordCare";

const QUESTION_PT = "Que pensamento apareceu e que emoção veio com ele?";
const QUESTION_EN = "What thought came up, and what emotion came with it?";

function renderIn(lang: "pt-BR" | "en", ui: ReactElement) {
  window.localStorage.setItem("meu-norte-lang", lang);
  return render(<I18nProvider>{ui}</I18nProvider>);
}

beforeEach(() => window.localStorage.clear());
afterEach(cleanup);

describe("Optional record reflection", () => {
  it("requires the person's choice before showing reflection fields", () => {
    renderIn("pt-BR", <RecordCare />);
    expect(screen.queryAllByRole("textbox")).toHaveLength(0);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getAllByRole("textbox")).toHaveLength(3);
  });

  it("lets the person pause and resume without losing their own words", () => {
    renderIn("pt-BR", <RecordCare />);
    fireEvent.click(screen.getByRole("button"));
    fireEvent.change(screen.getByRole("textbox", { name: QUESTION_PT }), {
      target: { value: "Senti medo e preciso de descanso." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Prefiro pausar" }));
    expect(screen.queryAllByRole("textbox")).toHaveLength(0);
    fireEvent.click(screen.getByRole("button", { name: "Retomar, se eu quiser" }));
    expect(screen.getByRole("textbox", { name: QUESTION_PT })).toHaveValue(
      "Senti medo e preciso de descanso.",
    );
  });

  it("discards temporary answers when the person ends the reflection", () => {
    renderIn("pt-BR", <RecordCare />);
    fireEvent.click(screen.getByRole("button"));
    fireEvent.change(screen.getByRole("textbox", { name: QUESTION_PT }), {
      target: { value: "Minha reflexão privada" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Encerrar reflexão" }));
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("textbox", { name: QUESTION_PT })).toHaveValue("");
  });

  it("shows the reflection in English when English is selected", () => {
    renderIn("en", <RecordCare />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("textbox", { name: QUESTION_EN })).toBeTruthy();
    expect(screen.getByRole("button", { name: "I'd rather pause" })).toBeTruthy();
  });
});
