import { useEffect, useState } from 'react';
import { navItems, person } from '../data/content';
import { useNow } from '../lib/useNow';
import { cn } from '../utils/cn';
import { Arrow } from './ui';

const TRACKED_IDS = ['top', ...navItems.map((item) => item.id), 'contact'];

/** Isolated so that only this element re-renders each second. */
function UtcClock() {
  const iso = new Date(useNow()).toISOString();
  return (
    <time dateTime={iso} className="data text-bright">
      {iso.slice(11, 19)}
    </time>
  );
}

export function StatusBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState('top');

  // Mark the section that currently sits in the reading band.
  useEffect(() => {
    const sections = TRACKED_IDS.map((id) => document.getElementById(id)).filter(
      (element): element is HTMLElement => element !== null,
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-void">
      <div className="mx-auto flex h-14 max-w-[85rem] items-stretch border-line min-[85rem]:border-x">
        <a href="#top" onClick={closeMenu} className="flex min-w-0 flex-1 items-center gap-3 px-5 sm:px-8 lg:flex-none">
          <span className="truncate text-[15px] font-medium text-bright">{person.shortName}</span>
          <span aria-hidden="true" className="hidden h-4 w-px shrink-0 bg-line-strong xl:block" />
          <span className="label hidden xl:block">{person.field}</span>
        </a>

        <nav aria-label="Primary" className="hidden flex-1 border-l border-line lg:block">
          <ul className="flex h-full items-stretch px-2">
            {navItems.map((item) => {
              const active = activeId === item.id;
              return (
                <li key={item.id} className="flex">
                  <a
                    href={`#${item.id}`}
                    aria-current={active ? 'location' : undefined}
                    className={cn(
                      'label relative flex items-center px-3 transition-colors duration-100',
                      active ? 'text-bright' : 'hover:text-bright',
                    )}
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={cn('absolute inset-x-3 bottom-0 h-0.5', active ? 'bg-signal' : 'bg-transparent')}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-2.5 border-l border-line px-5 min-[1400px]:flex">
          <span className="label">UTC</span>
          <UtcClock />
        </div>

        <a
          href="#contact"
          onClick={closeMenu}
          className="hidden items-center gap-3 bg-bright px-5 font-mono text-xs font-medium uppercase tracking-[0.1em] text-void transition-colors duration-100 hover:bg-signal sm:flex"
        >
          Research Collaboration
          <Arrow />
        </a>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className="label flex w-20 shrink-0 items-center justify-center border-l border-line text-bright lg:hidden"
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="max-h-[calc(100svh-3.5rem)] overflow-y-auto border-t border-line bg-void lg:hidden"
        >
          <ul>
            {navItems.map((item, index) => (
              <li key={item.id} className="border-b border-line">
                <a href={`#${item.id}`} onClick={closeMenu} className="flex items-center gap-4 px-5 py-4 text-base text-bright sm:px-8">
                  <span className="label w-6">{String(index + 1).padStart(2, '0')}</span>
                  <span className="flex-1">{item.label}</span>
                  <Arrow className="text-dim" />
                </a>
              </li>
            ))}
          </ul>
          <div className="p-5 sm:hidden">
            <a href="#contact" onClick={closeMenu} className="btn btn-primary w-full">
              Research Collaboration
              <Arrow />
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
