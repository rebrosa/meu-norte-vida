import { useI18n } from "@/lib/i18n";

type Item = { label: string; number: string };
type Group = { title: string; note?: string; items: Item[] };

const BRAZIL: Group = {
  title: "Brasil",
  items: [
    { label: "Polícia Militar", number: "190" },
    { label: "Central de Atendimento à Mulher — Ligue 180", number: "180" },
  ],
};

const EUROPE_EN: Group = {
  title: "Europe and Germany only",
  note: "These numbers only work in Europe (112) or in Germany (110 and 116 016). They will not connect from other countries, such as Brazil.",
  items: [
    {
      label: "European emergency number: ambulance, fire and, in most EU countries, police",
      number: "112",
    },
    { label: "Police (Germany only)", number: "110" },
    {
      label: "Violence against Women helpline: free, 24/7 (Germany only)",
      number: "116 016",
    },
  ],
};

const EUROPE_DE: Group = {
  title: "Nur Europa und Deutschland",
  note: "Diese Nummern funktionieren nur in Europa (112) bzw. in Deutschland (110 und 116 016). Aus anderen Ländern, zum Beispiel Brasilien, kommst du damit nicht durch.",
  items: [
    {
      label:
        "Europäische Notrufnummer: Rettungsdienst, Feuerwehr und in den meisten EU-Ländern auch Polizei",
      number: "112",
    },
    { label: "Polizei (nur Deutschland)", number: "110" },
    {
      label: "Hilfetelefon „Gewalt gegen Frauen“: kostenlos, rund um die Uhr (nur Deutschland)",
      number: "116 016",
    },
  ],
};

export function CrisisContacts() {
  const { lang } = useI18n();
  const group = lang === "pt-BR" ? BRAZIL : lang === "de" ? EUROPE_DE : EUROPE_EN;

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h2 className="font-display text-2xl text-foreground">{group.title}</h2>
        {group.note ? <p className="text-base text-muted-foreground">{group.note}</p> : null}
        <ul className="space-y-3">
          {group.items.map((it) => (
            <li key={it.number}>
              <a
                href={`tel:${it.number.replace(/\s/g, "")}`}
                className="flex min-h-16 items-center justify-between gap-4 rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border"
              >
                <span className="text-base text-muted-foreground">{it.label}</span>
                <span className="whitespace-nowrap text-2xl font-semibold text-primary">
                  {it.number}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
