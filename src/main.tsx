import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TimeOfDayProvider>
      <LanguageProvider>
        <BrowserRouter>
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
