'use client';

export default function CtaBridge() {
  return (
    <section className="min-h-[70vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
      <div className="max-w-3xl mx-auto w-full">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-6">
          Stop guessing. Start testing.
        </h2>

        <ul className="text-left max-w-md mx-auto space-y-4 mb-10">
          <li className="flex items-start gap-3">
            <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-[var(--abc-success)] flex items-center justify-center">
              <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <span className="text-[var(--color-text-secondary)] text-base sm:text-lg">
              <strong className="text-[var(--foreground)]">Real A/B tests</strong> with live Shopify traffic &mdash; no guesswork.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-[var(--abc-success)] flex items-center justify-center">
              <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <span className="text-[var(--color-text-secondary)] text-base sm:text-lg">
              <strong className="text-[var(--foreground)]">Statistical confidence</strong> so you know the winning price is real.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-[var(--abc-success)] flex items-center justify-center">
              <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <span className="text-[var(--color-text-secondary)] text-base sm:text-lg">
              <strong className="text-[var(--foreground)]">Set up in 2 minutes</strong> &mdash; no code, no developer needed.
            </span>
          </li>
        </ul>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://www.abconvert.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary px-8 py-3.5 rounded-lg text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            Start Free A/B Testing
          </a>
          <a
            href="https://www.abconvert.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 rounded-lg text-base sm:text-lg font-medium border-2 border-[var(--color-border)] text-[var(--foreground)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-hover)] transition-all duration-200"
          >
            Learn More
          </a>
        </div>

        {/* Footer */}
        <p className="mt-16 text-xs sm:text-sm text-[var(--color-text-muted)]">
          Powered by{' '}
          <a
            href="https://www.abconvert.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--abc-blue-light)] hover:text-[var(--abc-blue-primary)] hover:underline transition-colors font-medium"
          >
            ABConvert
          </a>{' '}
          &mdash; Professional A/B testing for Shopify merchants
        </p>
      </div>
    </section>
  );
}
