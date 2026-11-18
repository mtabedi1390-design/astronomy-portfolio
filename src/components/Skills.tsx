import { skillGroups } from '../data/content';
import { cn } from '../utils/cn';
import { Section } from './Section';

/** Skills as a specification matrix. Levels are stated in words, never as invented bars or percentages. */
export function Skills() {
  const entryCount = skillGroups.reduce((total, group) => total + group.items.length, 0);

  return (
    <Section
      id="skills"
      index="03"
      label="Skills"
      labelFa="مهارت‌ها"
      title="Tools, training and working languages."
      meta={[
        { k: 'Groups', v: String(skillGroups.length) },
        { k: 'Entries', v: String(entryCount) },
      ]}
    >
      <div className="border border-line">
        {skillGroups.map((group, index) => (
          <div
            key={group.code}
            className={cn('grid grid-cols-1 md:grid-cols-[13rem_minmax(0,1fr)]', index > 0 && 'border-t border-line')}
          >
            <div className="flex items-baseline gap-3 border-b border-line bg-hull px-4 py-3 md:block md:border-b-0 md:border-r md:py-4">
              <p className="label w-8 shrink-0 md:w-auto">{group.code}</p>
              <h3 className="text-base font-medium leading-snug text-bright md:mt-1.5">{group.title}</h3>
            </div>

            {/* Cells draw their own right and bottom rules. The wrapper clips the outer pair. */}
            <div className="overflow-hidden">
              <ul className="-mb-px -mr-px grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                {group.items.map((item) => (
                  <li key={item.name} className="flex items-baseline justify-between gap-3 border-b border-r border-line px-4 py-3">
                    <span className="text-[15px] leading-snug text-body">{item.name}</span>
                    {item.note && <span className="label shrink-0 text-mute">{item.note}</span>}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
