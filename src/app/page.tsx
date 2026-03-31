'use client';

import AnimatedCounter from '@/components/AnimatedCounter';
import PriceSimulator from '@/components/PriceSimulator';
import UncertaintyReveal from '@/components/UncertaintyReveal';
import CtaBridge from '@/components/CtaBridge';

export default function Home() {
  const scrollToSimulator = () => {
    document.getElementById('simulator')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      {/* ── Section 1: Hero Hook ── */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4">
          What if your price is{' '}
          <span className="text-[var(--abc-warning)]">wrong</span>?
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-[var(--color-text-secondary)] max-w-2xl mb-10">
          A $5 price difference can mean $50,000/year in lost profit.
        </p>

        <div className="mb-10">
          <p className="text-sm text-[var(--color-text-muted)] mb-2">
            Potential monthly profit left on the table
          </p>
          <div className="text-5xl sm:text-6xl md:text-7xl font-bold text-[var(--abc-success)]">
            <AnimatedCounter targetValue={12847} duration={2200} prefix="$" />
          </div>
        </div>

        <button
          onClick={scrollToSimulator}
          className="btn-primary px-8 py-3.5 rounded-lg text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
        >
          See how much you could be missing
        </button>

        {/* Scroll hint */}
        <div className="absolute bottom-8 animate-bounce hidden sm:block">
          <svg
            className="w-6 h-6 text-[var(--color-text-muted)]"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ── Section 2: Quick Simulator ── */}
      <PriceSimulator />

      {/* ── Section 3: Uncertainty Reveal ── */}
      <UncertaintyReveal />

      {/* ── Section 4: CTA Bridge ── */}
      <CtaBridge />
    </div>
  );
}
