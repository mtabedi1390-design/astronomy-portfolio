import { about, fitsCards, type FitsCard } from '../data/content';
import { Section } from './Section';
import { PanelHead } from './ui';

export function About() {
  return (
    <Section id="about" index="01" label="About" labelFa="درباره" title={about.title}>
      <div className="grid grid-cols-1 gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(0,27rem)] xl:gap-12">
        <div>
          <div className="max-w-[62ch] space-y-5 text-[1.0625rem] leading-[1.7] text-body">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <ul className="mt-10 border-t border-line">
            {about.scope.map((item) => (
              <li
                key={item.code}
                className="grid grid-cols-[3.25rem_minmax(0,1fr)] gap-x-4 border-b border-line py-4 md:grid-cols-[3.25rem_12rem_minmax(0,1fr)]"
              >
                <span className="label pt-1">{item.code}</span>
                <h3 className="text-base font-medium text-bright">{item.title}</h3>
                <p className="col-start-2 mt-1 text-[15px] leading-relaxed text-mute md:col-start-3 md:mt-0">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>

        <FitsHeader />
      </div>
    </Section>
  );
}

/** The profile in the keyword = value / comment notation astronomers read every day. */
function FitsHeader() {
  return (
    <div className="panel self-start">
      <PanelHead title="Profile · primary header" aside={`${fitsCards.length} cards`} />
      <dl className="px-3.5 py-3 font-mono text-[12.5px] leading-[1.75]">
        {fitsCards.map((card) => (
          <FitsRow key={card.key} card={card} />
        ))}
      </dl>
    </div>
  );
}

function FitsRow({ card }: { card: FitsCard }) {
  if (card.key === 'END') {
    return (
      <div>
        <dt className="text-dim">END</dt>
        <dd className="sr-only">End of header</dd>
      </div>
    );
  }

  const isComment = card.value === undefined;

  return (
    <div className="grid grid-cols-[10ch_minmax(0,1fr)]">
      <dt className="whitespace-pre text-mute">{isComment ? card.key : `${card.key.padEnd(8)}=`}</dt>
      <dd className="min-w-0 break-words">
        {card.value !== undefined && (
          <span className="text-bright">
            {card.type === 'string' ? (
              <>
                '
                {card.lang === 'fa' ? (
                  <bdi lang="fa" dir="rtl" className="font-fa text-[13px]">
                    {card.value}
                  </bdi>
                ) : (
                  card.value
                )}
                '
              </>
            ) : (
              card.value
            )}
          </span>
        )}
        {card.comment && <span className={isComment ? 'text-body' : 'text-dim'}>{isComment ? card.comment : ` / ${card.comment}`}</span>}
      </dd>
    </div>
  );
}
