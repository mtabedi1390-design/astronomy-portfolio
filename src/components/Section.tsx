import type { ReactNode } from 'react';

interface SectionProps {
  id: string;
  index: string;
  label: string;
  /** Persian section name, set right-to-left in Vazirmatn. */
  labelFa: string;
  title: string;
  lede?: string;
  /** Short key/value facts for the margin column. Values must be real: counted or quoted. */
  meta?: readonly { k: string; v: string }[];
  children: ReactNode;
}

/**
 * Page section on the ruled sheet: a margin column that carries the index and
 * metadata, and an offset content column. The margin stays in view while the
 * section scrolls, so the reader always knows where they are.
 */
export function Section({ id, index, label, labelFa, title, lede, meta, children }: SectionProps) {
  const headingId = `${id}-title`;

  return (
    <section id={id} aria-labelledby={headingId} className="scroll-mt-14 border-b border-line">
      <div className="grid grid-cols-1 lg:grid-cols-[14rem_minmax(0,1fr)] xl:grid-cols-[17rem_minmax(0,1fr)]">
        <div className="border-b border-line px-5 py-4 sm:px-8 lg:border-b-0 lg:border-r lg:py-14 xl:pl-12">
          <div className="flex items-baseline gap-4 lg:sticky lg:top-24 lg:block">
            <p className="font-mono text-sm text-bright lg:text-[1.75rem] lg:leading-none">{index}</p>
            <p className="label text-mute lg:mt-4">{label}</p>
            <p lang="fa" dir="rtl" className="ml-auto font-fa text-sm text-dim lg:ml-0 lg:mt-1.5 lg:w-fit">
              {labelFa}
            </p>
            {meta && (
              <dl className="mt-8 hidden border-t border-line lg:block">
                {meta.map((row) => (
                  <div key={row.k} className="flex items-baseline justify-between gap-3 border-b border-line py-2">
                    <dt className="label">{row.k}</dt>
                    <dd className="data text-bright">{row.v}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>

        <div className="min-w-0 px-5 py-10 sm:px-8 sm:py-14 xl:px-12 xl:py-16">
          <h2
            id={headingId}
            className="display max-w-[30ch] text-[clamp(1.6rem,2.9vw,2.375rem)] font-medium leading-[1.12] tracking-[-0.018em] text-bright"
          >
            {title}
          </h2>
          {lede && <p className="mt-5 max-w-[64ch] text-[1.0625rem] leading-[1.65] text-body">{lede}</p>}
          <div className="mt-10">{children}</div>
        </div>
      </div>
    </section>
  );
}
