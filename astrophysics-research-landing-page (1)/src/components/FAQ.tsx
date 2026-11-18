import { useState } from 'react';
import { faqs } from '../data/content';
import { cn } from '../utils/cn';
import { Section } from './Section';

/** Accordion. Panels open instantly: a state change, not a show. */
export function FAQ() {
  const [openId, setOpenId] = useState<string | null>(faqs[0].id);

  return (
    <Section
      id="faq"
      index="05"
      label="FAQ"
      labelFa="پرسش‌ها"
      title="Questions a mentor or lab would ask first."
      meta={[{ k: 'Entries', v: String(faqs.length) }]}
    >
      <ul className="border-t border-line">
        {faqs.map((faq, index) => {
          const open = openId === faq.id;
          const buttonId = `faq-button-${faq.id}`;
          const panelId = `faq-panel-${faq.id}`;

          return (
            <li key={faq.id} className={cn('border-b border-line', open && 'bg-hull')}>
              <h3>
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenId(open ? null : faq.id)}
                  className="group grid w-full grid-cols-[2.5rem_minmax(0,1fr)_1.5rem] items-baseline gap-2 px-3 py-4 text-left sm:px-4"
                >
                  <span className="label">Q{index + 1}</span>
                  <span
                    className={cn(
                      'text-[1.0625rem] font-medium leading-snug transition-colors duration-100',
                      open ? 'text-bright' : 'text-body group-hover:text-bright',
                    )}
                  >
                    {faq.question}
                  </span>
                  <span aria-hidden="true" className={cn('text-right font-mono text-base leading-none', open ? 'text-signal' : 'text-dim')}>
                    {open ? '−' : '+'}
                  </span>
                </button>
              </h3>
              {open && (
                <div id={panelId} role="region" aria-labelledby={buttonId} className="px-3 pb-5 sm:px-4">
                  <p className="max-w-[68ch] pl-[3rem] leading-[1.65] text-body">{faq.answer}</p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
