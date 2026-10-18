export function SectionTitle({ eyebrow, title, description, titleSize = 'text-4xl sm:text-5xl', descriptionColor = 'text-slate-600' }) {
  return (
    <div className="mx-auto max-w-2xl text-center" data-aos="fade-up">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.4em] text-sage-700/80">{eyebrow}</p>
      <h2 className={`font-display ${titleSize} text-sage-900`}>{title}</h2>
      {description ? <p className={`mt-4 text-base ${descriptionColor}`}>{description}</p> : null}
    </div>
  );
}
