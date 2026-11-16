import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { RecordCare } from "./RecordCare";

afterEach(cleanup);

describe("Optional record reflection", () => {
  it("requires the person's choice before showing reflection fields", () => {
    render(<RecordCare />);
    expect(screen.queryAllByRole("textbox")).toHaveLength(0);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getAllByRole("textbox")).toHaveLength(3);
  });

  it("lets the person pause and resume without losing their own words", () => {
    render(<RecordCare />);
    fireEvent.click(screen.getByRole("button"));
    fireEvent.change(screen.getByRole("textbox", { name: "Que pensamento apareceu e que emoção veio com ele?" }), { target: { value: "Senti medo e preciso de descanso." } });
    fireEvent.click(screen.getByRole("button", { name: "Prefiro pausar" }));
    expect(screen.queryAllByRole("textbox")).toHaveLength(0);
    fireEvent.click(screen.getByRole("button", { name: "Retomar, se eu quiser" }));
    expect(screen.getByRole("textbox", { name: "Que pensamento apareceu e que emoção veio com ele?" })).toHaveValue("Senti medo e preciso de descanso.");
  });

  it("discards temporary answers when the person ends the reflection", () => {
    render(<RecordCare />);
    fireEvent.click(screen.getByRole("button"));
    fireEvent.change(screen.getByRole("textbox", { name: "Que pensamento apareceu e que emoção veio com ele?" }), { target: { value: "Minha reflexão privada" } });
    fireEvent.click(screen.getByRole("button", { name: "Encerrar reflexão" }));
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("textbox", { name: "Que pensamento apareceu e que emoção veio com ele?" })).toHaveValue("");
  });
});