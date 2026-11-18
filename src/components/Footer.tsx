import { navItems, person, references } from '../data/content';
import { Arrow } from './ui';

const footerLinks = [...navItems, { id: 'contact', label: 'Contact' }];

/** Sources first: every constant and catalog used on the page is traceable from here. */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer>
      <div className="grid grid-cols-1 border-b border-line lg:grid-cols-[14rem_minmax(0,1fr)] xl:grid-cols-[17rem_minmax(0,1fr)]">
        <div className="flex items-baseline gap-4 border-b border-line px-5 py-4 sm:px-8 lg:block lg:border-b-0 lg:border-r lg:py-10 xl:pl-12">
          <h2 className="label text-mute">Sources</h2>
          <p className="label lg:mt-1.5">{references.length} entries</p>
        </div>
        <ol className="space-y-2.5 px-5 py-8 sm:px-8 lg:py-10 xl:px-12">
          {references.map((reference, index) => (
            <li key={reference.text} className="grid grid-cols-[2.5rem_minmax(0,1fr)] text-[13px] leading-relaxed">
              <span className="data text-dim">[{index + 1}]</span>
              <span className="max-w-[86ch] text-mute">
                {reference.text} <span className="text-dim">Used for: {reference.use}.</span>
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="grid grid-cols-1 gap-8 border-b border-line px-5 py-8 sm:px-8 md:grid-cols-[minmax(0,1fr)_auto] xl:px-12">
        <div>
          <p className="text-base font-medium text-bright">{person.name}</p>
          <p lang="fa" dir="rtl" className="mt-1 w-fit font-fa text-[15px] text-mute">
            {person.nameFa}
          </p>
          <p className="label mt-3">{person.field}</p>
        </div>
        <nav aria-label="Footer" className="md:self-end">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <li key={link.id}>
                <a href={`#${link.id}`} className="label transition-colors duration-100 hover:text-bright">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8 xl:px-12">
        <p className="label">
          © {year} {person.name}
        </p>
        <p className="label">Set in IBM Plex Sans, JetBrains Mono and Vazirmatn</p>
        <a href="#top" className="label flex items-center gap-2 text-bright transition-colors duration-100 hover:text-signal">
          Top
          <Arrow direction="up" />
        </a>
      </div>
    </footer>
  );
}
