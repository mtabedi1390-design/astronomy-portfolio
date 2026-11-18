import { certificates, education, honors } from '../data/content';
import { cn } from '../utils/cn';
import { Section } from './Section';
import { PanelHead } from './ui';

const firstYear = Math.min(...honors.map((honor) => honor.sh));
const lastYear = Math.max(...honors.map((honor) => honor.sh));
const years = Array.from({ length: lastYear - firstYear + 1 }, (_, step) => firstYear + step);
const countIn = (year: number): number => honors.filter((honor) => honor.sh === year).length;

export function Honors() {
  return (
    <Section
      id="awards"
      index="04"
      label="Awards"
      labelFa="افتخارات"
      title="Awards, education and certificates."
      meta={[
        { k: 'Awards', v: String(honors.length) },
        { k: 'Span', v: `${firstYear}–${lastYear}` },
        { k: 'Certificates', v: String(certificates.items.length) },
      ]}
    >
      <YearAxis />

      <div className="mt-8 border border-line">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">Awards, newest first</caption>
          <thead>
            <tr className="border-b border-line bg-hull">
              <th scope="col" className="label px-4 py-2.5 font-normal">
                Year <span className="hidden md:inline">(SH)</span>
              </th>
              <th scope="col" className="label hidden px-4 py-2.5 font-normal md:table-cell">
                CE
              </th>
              <th scope="col" className="label px-4 py-2.5 font-normal">
                Award
              </th>
              <th scope="col" className="label px-4 py-2.5 font-normal">
                Event
              </th>
              <th scope="col" className="label hidden px-4 py-2.5 font-normal md:table-cell">
                Level
              </th>
            </tr>
          </thead>
          <tbody>
            {honors.map((honor, index) => (
              <tr key={`${honor.sh}-${honor.event}`} className={cn(index > 0 && 'border-t border-line')}>
                <td className="data px-4 py-3.5 align-top text-bright">
                  {honor.sh}
                  <span className="block text-dim md:hidden">{honor.ce}</span>
                </td>
                <td className="data hidden px-4 py-3.5 align-top text-mute md:table-cell">{honor.ce}</td>
                <td className="px-4 py-3.5 align-top text-[15px] font-medium leading-snug text-bright">{honor.award}</td>
                <td className="px-4 py-3.5 align-top text-[15px] leading-snug text-body">
                  {honor.event}
                  <span className="label mt-1 block md:hidden">{honor.level}</span>
                </td>
                <td className="hidden px-4 py-3.5 align-top text-[15px] leading-snug text-mute md:table-cell">{honor.level}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-[13px] leading-relaxed text-dim">
        Years are Solar Hijri (SH). The CE column gives the Gregorian years each one overlaps.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="panel">
          <PanelHead title="Education" aside={education.status} />
          <div className="px-4 py-4">
            <p className="text-base font-medium text-bright">{education.school}</p>
            <p className="mt-1 text-[15px] text-body">{education.place}</p>
            <p className="label mt-3 text-mute">{education.level}</p>
          </div>
        </div>

        <div className="panel">
          <PanelHead title="Certificates" aside={`${certificates.items.length} held`} />
          <div className="px-4 py-4">
            <p className="text-base font-medium text-bright">{certificates.issuer}</p>
            <ul className="mt-2 border-t border-line">
              {certificates.items.map((item) => (
                <li key={item} className="border-b border-line py-2 text-[15px] text-body">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}

/** A time axis drawn to scale: one equal step per year, so gaps between awards are visible. */
function YearAxis() {
  const summary = years
    .filter((year) => countIn(year) > 0)
    .map((year) => `${countIn(year)} in ${year}`)
    .join(', ');

  return (
    <div
      role="img"
      aria-label={`Awards per year: ${summary}.`}
      className="grid border-b border-line-strong"
      style={{ gridTemplateColumns: `repeat(${years.length}, minmax(0, 1fr))` }}
    >
      {years.map((year) => {
        const count = countIn(year);
        return (
          <div key={year} className="border-l border-line pb-3 pl-2 last:border-r">
            <p className={cn('data', count > 0 ? 'text-bright' : 'text-dim')}>{year}</p>
            <div className="mt-2 flex h-2 gap-1">
              {Array.from({ length: count }, (_, mark) => (
                <span key={mark} className="h-2 w-2 bg-bright" />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
