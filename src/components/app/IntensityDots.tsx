import { useI18n } from "@/lib/i18n";

export function IntensityDots({ value }: { value: number | null }) {
  const { t } = useI18n();
  if (!value) return null;
  return (
    <span className="flex items-center gap-1" aria-label={t("Intensidade {value} de 5", { value })}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`h-3 w-3 rounded-full ${n <= value ? "bg-primary" : "bg-muted"}`}
          aria-hidden
        />
      ))}
    </span>
  );
}
