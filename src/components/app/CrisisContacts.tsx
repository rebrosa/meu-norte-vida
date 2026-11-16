const GROUPS = [
  {
    country: "Brasil",
    items: [
      { label: "Polícia Militar", number: "190" },
      { label: "Central de Atendimento à Mulher — Ligue 180", number: "180" },
    ],
  },
];

export function CrisisContacts() {
  return (
    <div className="space-y-6">
      {GROUPS.map((g) => (
        <section key={g.country} className="space-y-3">
          <h2 className="font-display text-2xl text-foreground">{g.country}</h2>
          <ul className="space-y-3">
            {g.items.map((it) => (
              <li key={it.number}>
                <a
                  href={`tel:${it.number.replace(/\s/g, "")}`}
                  className="flex min-h-16 items-center justify-between gap-4 rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border"
                >
                  <span className="text-base text-muted-foreground">{it.label}</span>
                  <span className="whitespace-nowrap text-2xl font-semibold text-primary">{it.number}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
