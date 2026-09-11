import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
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
import ScrollToTop from '@/components/ScrollToTop'
import RouteStructuredData from '@/components/RouteStructuredData'

// Journal routes are real prerendered pages (tools/prerender.mjs renders
// every route to dist/<route>/index.html), so each article is crawlable HTML.
// The homepage stays exactly as it was — the router wraps around it.
const JournalPage = lazy(() => import('@/pages/JournalPage'))
const ArticlePage = lazy(() => import('@/pages/ArticlePage'))
const LinksPage = lazy(() => import('@/pages/LinksPage'))
const CollectionPage = lazy(() => import('@/pages/CollectionPage'))
const ResidencePage = lazy(() => import('@/pages/ResidencePage'))
// Structure-only shell, not yet linked from anywhere or prerendered — see
// AboutPage.tsx for why. Reachable at /about in local dev for review only.
const AboutPage = lazy(() => import('@/pages/AboutPage'))
const PlacesPage = lazy(() => import('@/pages/PlacesPage'))
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'))

// ScrollToTop and RouteStructuredData mount before <Routes> so navigation
// resets the scroll position and schema before route content is prerendered.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TimeOfDayProvider>
      <LanguageProvider>
        <BrowserRouter>
          <ScrollToTop />
          <RouteStructuredData />
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
            <Route
              path="/links"
              element={
                <Suspense fallback={null}>
                  <LinksPage />
                </Suspense>
              }
            />
            <Route
              path="/collections/:slug"
              element={
                <Suspense fallback={null}>
                  <CollectionPage />
                </Suspense>
              }
            />
            <Route
              path="/residence"
              element={
                <Suspense fallback={null}>
                  <ResidencePage />
                </Suspense>
              }
            />
            <Route
              path="/about"
              element={
                <Suspense fallback={null}>
                  <AboutPage />
                </Suspense>
              }
            />
            <Route
              path="/places"
              element={
                <Suspense fallback={null}>
                  <PlacesPage />
                </Suspense>
              }
            />
            <Route
              path="/privacy"
              element={
                <Suspense fallback={null}>
                  <PrivacyPage />
                </Suspense>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          {/* First-party, cookieless traffic + referrer analytics. Mounted
              inside the router root so it tracks every route, not just /. Only
              collects once Web Analytics is enabled in the Vercel dashboard. */}
          <Analytics />
        </BrowserRouter>
      </LanguageProvider>
    </TimeOfDayProvider>
  </StrictMode>,
)
