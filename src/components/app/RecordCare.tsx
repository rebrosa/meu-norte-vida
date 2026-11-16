import { useState } from "react";
import { HeartHandshake, Pause, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fieldClass } from "@/components/app/AppShell";

export function RecordCare() {
  const [open, setOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [answers, setAnswers] = useState(["", "", ""]);

  function close() {
    setOpen(false);
    setPaused(false);
    setAnswers(["", "", ""]);
  }

  if (!open) {
    return (
      <Button variant="ghost" onClick={() => setOpen(true)} className="min-h-12 max-w-full whitespace-normal text-base text-primary">
        <HeartHandshake aria-hidden="true" /> Acolher este registro
      </Button>
    );
  }

  return (
    <section aria-label="Acolher este registro" className="space-y-4 border-t border-border pt-4">
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-display text-xl text-foreground">No seu tempo, sem julgamento</h2>
        <Button variant="ghost" size="icon" className="min-h-12 min-w-12 shrink-0" aria-label="Encerrar reflexão" title="Encerrar reflexão" onClick={close}>
          <X aria-hidden="true" />
        </Button>
      </div>
      <p className="text-base text-muted-foreground">Seus sentimentos merecem acolhimento. Você não precisa provar o que viveu, reviver detalhes ou encontrar uma resposta agora.</p>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">Voltar ao presente</h3>
        <p className="text-base text-foreground">Se for confortável, mantenha os olhos abertos e perceba o apoio dos pés. Olhe ao redor e nomeie três objetos e suas cores. Respire no seu ritmo, sem forçar. Se algo incomodar, pare.</p>
      </div>
      {paused ? (
        <div className="space-y-3" role="status">
          <p className="text-base text-foreground">Tudo bem parar. Você não precisa reler o registro. Perceba onde está agora e escolha o que traz um pouco de conforto.</p>
          <Button variant="outline" onClick={() => setPaused(false)} className="min-h-12 whitespace-normal text-base">Retomar, se eu quiser</Button>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">Um olhar gentil · TCC</h3>
            <p className="text-base text-muted-foreground">Um pensamento pode surgir junto de uma emoção, sem definir quem você é. Olhar para ele com cuidado não apaga o que aconteceu nem justifica atitudes que machucaram você.</p>
          </div>
          {[
            "Que pensamento apareceu e que emoção veio com ele?",
            "O que eu diria a alguém querido que tivesse vivido isso?",
            "Do que preciso agora? Qual pequeno cuidado posso escolher?",
          ].map((label, index) => (
            <label key={label} className="block space-y-2 text-base font-semibold text-foreground">
              <span>{label}</span>
              <textarea rows={3} maxLength={2000} value={answers[index]} onChange={(event) => setAnswers((current) => current.map((value, i) => i === index ? event.target.value : value))} className={`${fieldClass} font-normal`} />
            </label>
          ))}
          <p className="text-sm text-muted-foreground">Reflexão opcional e temporária: não é salva nem enviada à inteligência artificial. Seu registro permanece como você escreveu.</p>
          <Button variant="outline" onClick={() => setPaused(true)} className="min-h-12 whitespace-normal text-base"><Pause aria-hidden="true" /> Prefiro pausar</Button>
        </>
      )}
      <p className="text-sm text-muted-foreground">Este acolhimento não faz diagnósticos e não substitui acompanhamento psicológico.</p>
    </section>
  );
}