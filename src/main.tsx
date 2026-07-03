import { StrictMode, Suspense, lazy, useLayoutEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { TimeOfDayProvider } from '@/contexts/TimeOfDayContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
// Brand typography — IBM Plex Sans Thai Looped (Thai + Latin in one family),
// self-hosted via @fontsource. Same face as the resident app: one brand, one
// voice. DM Serif Display (wordmark / EN display only) still loads from
// Google Fonts in index.html.
import '@fontsource/ibm-plex-sans-thai-looped/300.css'
import '@fontsource/ibm-plex-sans-thai-looped/400.css'
import '@fontsource/ibm-plex-sans-thai-looped/500.css'
import '@fontsource/ibm-plex-sans-thai-looped/600.css'
import './index.css'
import App from './App.tsx'

// Journal routes are real prerendered pages (tools/prerender.mjs renders
// every route to dist/<route>/index.html), so each article is crawlable HTML.
// The homepage stays exactly as it was — the router wraps around it.
const JournalPage = lazy(() => import('@/pages/JournalPage'))
const ArticlePage = lazy(() => import('@/pages/ArticlePage'))

// Reset scroll BEFORE the destination route's components mount their
// ScrollTriggers. Rendered before <Routes>, so this layout effect flushes
// first (sibling tree order) — without it, navigating /journal → / mounts
// the homepage at the journal page's scroll offset and GSAP computes
// trigger progress from that stale position (AmenitiesSection then paints
// its track mid-scroll instead of at the far left).
function ScrollToTop() {
  const { pathname } = useLocation()
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TimeOfDayProvider>
      <LanguageProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<App />} />
            <Route
              path="/journal"
              element={
                <Suspense fallback={null}>
                  <JournalPage />
                </Suspense>
              }
            />
            <Route
              path="/journal/:slug"
              element={
                <Suspense fallback={null}>
                  <ArticlePage />
                </Suspense>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </TimeOfDayProvider>
  </StrictMode>,
)
