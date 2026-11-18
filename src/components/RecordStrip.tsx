import { recordSummary } from '../data/content';

/**
 * Honors at a glance, set as ruled table cells instead of stat cards.
 * The hairlines come from the 1px grid gap showing the line color underneath.
 */
export function RecordStrip() {
  return (
    <section aria-label="Honors and certificates" className="border-b border-line bg-line">
      <ul className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-4">
        {recordSummary.map((record) => (
          <li key={`${record.when}-${record.body}`} className="bg-void px-5 py-6 sm:px-8 lg:px-6 xl:px-8 xl:first:pl-12">
            <p className="label">{record.when}</p>
            <p className="display mt-3 text-xl font-medium leading-tight text-bright">{record.result}</p>
            <p className="mt-1.5 text-[15px] leading-snug text-body">{record.body}</p>
            <p className="label mt-4">{record.scope}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
