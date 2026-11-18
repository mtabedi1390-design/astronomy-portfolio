import { hero, identity } from '../data/content';
import { cn } from '../utils/cn';
import { SkyInstrument } from './SkyInstrument';
import { Arrow } from './ui';

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="border-b border-line">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div className="flex flex-col">
          <div className="px-5 pt-10 sm:px-8 sm:pt-14 xl:px-12 xl:pt-16">
            <p className="label flex flex-wrap items-center gap-x-2.5 gap-y-1 text-bright">
              <span aria-hidden="true" className="h-2 w-2 bg-signal" />
              {hero.distinction}
              <span className="text-dim">({hero.distinctionScope})</span>
            </p>

            <h1
              id="hero-title"
              className="display mt-7 max-w-[24ch] text-[clamp(2rem,3.9vw,3.125rem)] font-medium leading-[1.08] tracking-[-0.022em] text-bright"
            >
              {hero.headline[0]} <span className="text-dim">{hero.headline[1]}</span>
            </h1>

            <p className="mt-7 max-w-[60ch] text-[1.0625rem] leading-[1.65] text-body">{hero.lede}</p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#contact" className="btn btn-primary">
                Research Collaboration
                <Arrow />
              </a>
              <a href="#research" className="btn btn-secondary">
                Research projects
                <Arrow direction="down" />
              </a>
            </div>
          </div>

          <div aria-hidden="true" className="min-h-12 flex-1" />

          <dl className="grid grid-cols-1 border-t border-line sm:grid-cols-2">
            {identity.map((row, index) => (
              <div
                key={row.k}
                className={cn(
                  'border-line px-5 py-4 sm:px-8 xl:px-12',
                  index > 0 && 'border-t',
                  index === 1 && 'sm:border-t-0',
                  index % 2 === 1 && 'sm:border-l sm:pl-8 xl:pl-8',
                )}
              >
                <dt className="label">{row.k}</dt>
                <dd className="mt-1.5 text-[15px] leading-snug text-bright">
                  {row.v}
                  {row.fa && (
                    <span lang="fa" dir="rtl" className="mt-1 block w-fit font-fa text-[15px] text-mute">
                      {row.fa}
                    </span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="border-t border-line lg:border-l lg:border-t-0">
          <SkyInstrument />
        </div>
      </div>
    </section>
  );
}
