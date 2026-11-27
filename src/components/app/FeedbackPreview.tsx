import { useRef, useState } from "react";
import { fieldClass, primaryBtn, secondaryBtn } from "@/components/app/AppShell";

export function FeedbackPreview() {
  const [open, setOpen] = useState(false);
  const [complete, setComplete] = useState(false);
  const [rating, setRating] = useState("");
  const [category, setCategory] = useState("");
  const [comment, setComment] = useState("");
  const trigger = useRef<HTMLButtonElement>(null);
  const result = useRef<HTMLHeadingElement>(null);

  function reset() {
    setRating("");
    setCategory("");
    setComment("");
  }

  function close() {
    reset();
    setComplete(false);
    setOpen(false);
    trigger.current?.focus();
  }

  return (
    <section
      aria-labelledby="feedback-heading"
      className="space-y-4 rounded-2xl bg-card p-4 ring-1 ring-border"
    >
      <h2 id="feedback-heading" className="font-display text-2xl text-foreground">
        Sua opinião importa
      </h2>
      <p id="feedback-preview-notice" className="text-base text-muted-foreground">
        Prévia para testes. Nada será enviado ou salvo. Use apenas informações fictícias.
      </p>
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-controls="feedback-panel"
        className={secondaryBtn}
        onClick={() => {
          if (open) close();
          else setOpen(true);
        }}
      >
        {open ? "Fechar feedback" : "Enviar feedback (prévia)"}
      </button>
      <div id="feedback-panel" hidden={!open}>
        {complete ? (
          <div className="space-y-4" role="status">
            <h3 ref={result} tabIndex={-1} className="text-lg font-semibold text-foreground">
              Teste concluído. Nenhum feedback foi enviado.
            </h3>
            <p className="text-muted-foreground">
              Obrigada por testar este espaço. Os campos foram limpos.
            </p>
            <button type="button" className={secondaryBtn} onClick={() => setComplete(false)}>
              Testar novamente
            </button>
          </div>
        ) : (
          <form
            className="space-y-5"
            aria-describedby="feedback-preview-notice feedback-privacy"
            onSubmit={(event) => {
              event.preventDefault();
              reset();
              setComplete(true);
              requestAnimationFrame(() => result.current?.focus());
            }}
          >
            <p id="feedback-privacy" className="text-base text-muted-foreground">
              Não inclua nomes, contatos ou trechos do seu diário. Este formulário não acessa seus
              registros.
            </p>
            <fieldset className="space-y-2">
              <legend className="text-lg font-semibold text-foreground">
                Como foi sua experiência? (obrigatório)
              </legend>
              <p id="feedback-scale" className="text-sm text-muted-foreground">
                1 = muito ruim · 5 = muito boa
              </p>
              <div className="flex flex-wrap gap-3">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label
                    key={value}
                    className="flex min-h-12 min-w-12 cursor-pointer items-center justify-center gap-2 rounded-xl border border-border px-3 text-foreground"
                  >
                    <input
                      type="radio"
                      name="feedback-rating"
                      value={value}
                      checked={rating === String(value)}
                      onChange={(event) => setRating(event.target.value)}
                      required
                      aria-describedby="feedback-scale"
                    />
                    {value}
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="space-y-2">
              <label
                htmlFor="feedback-category"
                className="block text-lg font-semibold text-foreground"
              >
                Categoria (obrigatória)
              </label>
              <select
                id="feedback-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                required
                className={`${fieldClass} min-h-12`}
              >
                <option value="" disabled>
                  Selecione uma categoria
                </option>
                <option value="idea">Ideia</option>
                <option value="problem">Problema</option>
                <option value="praise">Elogio</option>
              </select>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="feedback-comment"
                className="block text-lg font-semibold text-foreground"
              >
                O que te ajudou, o que te atrapalhou ou o que você sentiu falta? (opcional)
              </label>
              <textarea
                id="feedback-comment"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                maxLength={2000}
                rows={5}
                aria-describedby="feedback-count"
                className={fieldClass}
              />
              <p id="feedback-count" className="text-sm text-muted-foreground">
                {comment.length}/2000 caracteres
              </p>
            </div>
            <button type="submit" className={primaryBtn}>
              Concluir teste (não envia)
            </button>
            <button type="button" className={secondaryBtn} onClick={close}>
              Cancelar e limpar
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
