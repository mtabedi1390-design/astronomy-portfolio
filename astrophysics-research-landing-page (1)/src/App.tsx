import { About } from './components/About';
import { Contact } from './components/Contact';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Honors } from './components/Honors';
import { RecordStrip } from './components/RecordStrip';
import { Research } from './components/Research';
import { Skills } from './components/Skills';
import { StatusBar } from './components/StatusBar';

export default function App() {
  return (
    <div className="min-h-screen bg-void text-body">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:bg-signal focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:tracking-[0.1em] focus:text-void"
      >
        Skip to content
      </a>

      <StatusBar />

      {/* The sheet: one ruled column that every section hangs from. */}
      <div className="mx-auto max-w-[85rem] border-line min-[85rem]:border-x">
        <main id="main" className="pt-14">
          <Hero />
          <RecordStrip />
          <About />
          <Research />
          <Skills />
          <Honors />
          <FAQ />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}
