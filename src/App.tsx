import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WishlistProvider } from './context/WishlistContext';
import { CmsProvider } from './context/CmsContext';

/**
 * Robust lazy import wrapper with auto-retry on stale chunk hashes.
 * If a deployment or rebuild generates new asset hashes, any cached browser
 * session attempting to import an old chunk will auto-reload to fetch the fresh bundle.
 */
function lazyWithRetry<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> {
  return lazy(async () => {
    try {
      return await factory();
    } catch (error: any) {
      const errorMsg = String(error?.message || '');
      const isChunkLoadError =
        errorMsg.includes('Failed to fetch dynamically imported module') ||
        errorMsg.includes('Expected a JavaScript-or-Wasm module script') ||
        errorMsg.includes('error loading dynamically imported module') ||
        error?.name === 'ChunkLoadError';

      const hasRefreshed = window.sessionStorage.getItem('mkt_chunk_retry');

      if (isChunkLoadError && !hasRefreshed) {
        window.sessionStorage.setItem('mkt_chunk_retry', 'true');
        window.location.reload();
        return new Promise(() => {}); // Wait for browser reload
      }

      throw error;
    }
  });
}

const HomePage = lazyWithRetry(() => import('./HomePage'));
const DestinationsPage = lazyWithRetry(() => import('./pages/DestinationsPage'));
const PackagesPage = lazyWithRetry(() => import('./pages/PackagesPage'));
const PlanTripPage = lazyWithRetry(() => import('./pages/PlanTripPage'));
const StoriesPage = lazyWithRetry(() => import('./pages/StoriesPage'));
const PlacesPage = lazyWithRetry(() => import('./pages/PlacesPage'));
const ExperiencesPage = lazyWithRetry(() => import('./pages/ExperiencesPage'));
const AdminDashboard = lazyWithRetry(() => import('./admin/AdminDashboard'));
const AdminLogin = lazyWithRetry(() => import('./admin/AdminLogin'));

function GlobalErrorFallback({ onReset }: { onReset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black text-neutral-900 dark:text-white px-4 text-center">
      <div className="max-w-md p-8 rounded-3xl border border-neutral-200 dark:border-white/10 shadow-2xl bg-neutral-50 dark:bg-[#111111] space-y-5">
        <div className="w-14 h-14 rounded-full bg-[#E37500]/10 text-[#E37500] flex items-center justify-center mx-auto text-2xl font-serif">
          ✦
        </div>
        <h2 className="text-2xl font-serif font-bold">Refreshing Sanctuary</h2>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
          We just updated our curated experiences. Click below to load the freshest luxury travel dossier.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            onClick={onReset}
            className="px-6 py-2.5 rounded-full bg-[#E37500] hover:bg-[#C66500] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
          >
            Reload Now
          </button>
          <a
            href="/"
            className="px-6 py-2.5 rounded-full bg-neutral-200 dark:bg-white/10 hover:bg-neutral-300 dark:hover:bg-white/20 text-neutral-900 dark:text-white font-bold text-xs uppercase tracking-wider transition-all active:scale-95 inline-flex items-center justify-center"
          >
            Return to Home
          </a>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Clear chunk retry marker on successful load
    window.sessionStorage.removeItem('mkt_chunk_retry');

    const errorHandler = (event: ErrorEvent) => {
      const msg = String(event?.message || '');
      if (
        msg.includes('Failed to fetch dynamically imported module') ||
        msg.includes('Expected a JavaScript-or-Wasm module script') ||
        msg.includes('error loading dynamically imported module')
      ) {
        const hasRefreshed = window.sessionStorage.getItem('mkt_chunk_retry');
        if (!hasRefreshed) {
          window.sessionStorage.setItem('mkt_chunk_retry', 'true');
          window.location.reload();
        } else {
          setHasError(true);
        }
      }
    };

    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  if (hasError) {
    return (
      <GlobalErrorFallback
        onReset={() => {
          window.sessionStorage.removeItem('mkt_chunk_retry');
          window.location.reload();
        }}
      />
    );
  }

  return (
    <BrowserRouter>
      <WishlistProvider>
        <CmsProvider>
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black text-neutral-900 dark:text-white font-serif text-lg">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-[#E37500] animate-ping" />
                  <span>Loading My Kind of Travel...</span>
                </div>
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/destinations" element={<DestinationsPage />} />
              <Route path="/packages" element={<PackagesPage />} />
              <Route path="/plan" element={<PlanTripPage />} />
              <Route path="/stories" element={<StoriesPage />} />
              <Route path="/places" element={<PlacesPage />} />
              <Route path="/experiences" element={<ExperiencesPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/login" element={<AdminLogin />} />
            </Routes>
          </Suspense>
        </CmsProvider>
      </WishlistProvider>
    </BrowserRouter>
  );
}
