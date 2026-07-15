import { cx } from '../../utils/cx';

export interface InsightCardProps {
  /** Section heading, rendered as a mono-tag eyebrow. */
  title: string;
  /** Bullet items; use `ordered` when sequence matters (e.g. immediate actions). */
  items?: string[];
  /** Paragraph content for prose sections (e.g. a forecast). */
  text?: string;
  ordered?: boolean;
}

/**
 * One titled section of a structured AI response on ops (dark) surfaces —
 * shared by the Crowd Management recommendations and the Real-Time Decision
 * Support action plans so structured output looks identical everywhere.
 * Enters with the transform-only cardIn treatment, frozen under
 * prefers-reduced-motion.
 */
export function InsightCard({ title, items, text, ordered = false }: InsightCardProps) {
  const ListTag = ordered ? 'ol' : 'ul';
  return (
    <section className="animate-msg-in rounded-xl border border-ops-border bg-ops-surface2 p-4 motion-reduce:animate-none">
      <h3 className="font-mono text-mono-tag font-bold uppercase text-glow">{title}</h3>
      {text ? <p className="mt-2.5 text-body-sm text-ops-body">{text}</p> : null}
      {items && items.length > 0 ? (
        <ListTag className="mt-2.5 flex flex-col gap-1.5">
          {items.map((item, index) => (
            <li key={item} className="flex gap-2.5 text-body-sm text-ops-body">
              <span aria-hidden="true" className={cx('shrink-0 font-mono font-bold text-glow')}>
                {ordered ? `${index + 1}.` : '▸'}
              </span>
              {item}
            </li>
          ))}
        </ListTag>
      ) : null}
    </section>
  );
}
