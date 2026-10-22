type SectionHeadingProps = {
  label: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  inverse?: boolean;
};

/**
 * Единый заголовок секции: мелкий uppercase-лейбл + крупный заголовок.
 * Приём унаследован от старого лендинга (.sec-label/.sec-title), но с более
 * крупной типографикой и увеличенными интервалами новой дизайн-системы.
 */
export function SectionHeading({
  label,
  title,
  description,
  align = "left",
  inverse = false,
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";
  const labelColor = inverse ? "text-[var(--color-accent)]" : "text-[var(--color-text-3)]";
  const titleColor = inverse ? "text-[var(--color-text-inverse)]" : "text-[var(--color-text)]";
  const descColor = inverse ? "text-[var(--color-text-inverse)]/70" : "text-[var(--color-text-2)]";

  return (
    <div className={`max-w-2xl ${alignClass}`}>
      <p className={`mb-3 text-xs font-medium uppercase tracking-[0.12em] ${labelColor}`}>
        {label}
      </p>
      <h2 className={`text-[1.625rem] font-semibold leading-tight tracking-[-0.02em] sm:text-4xl ${titleColor}`}>
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-base leading-relaxed sm:text-lg ${descColor}`}>{description}</p>
      )}
    </div>
  );
}
