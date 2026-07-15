export interface StepListProps {
  items: string[];
  /** Numbered markers when sequence matters (directions, departure steps); ▸ bullets otherwise. */
  ordered?: boolean;
}

/**
 * Step/bullet list for structured AI responses on fan (light) surfaces — the
 * light-theme counterpart of InsightCard's ops list, shared by every fan
 * panel so structured output reads identically across modules.
 */
export function StepList({ items, ordered = false }: StepListProps) {
  const ListTag = ordered ? 'ol' : 'ul';
  return (
    <ListTag className="mt-3 flex flex-col gap-2">
      {items.map((item, index) => (
        <li key={item} className="flex gap-2.5 text-body-sm text-fan-ink">
          <span aria-hidden="true" className="shrink-0 font-mono font-bold text-pitch-deep">
            {ordered ? `${index + 1}.` : '▸'}
          </span>
          {item}
        </li>
      ))}
    </ListTag>
  );
}
