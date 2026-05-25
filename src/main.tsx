import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { TimeOfDayProvider } from '@/contexts/TimeOfDayContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import './index.css'
import App from './App.tsx'

// No router: this is a single-page brochure with anchor-only navigation.
// Removing the unused <BrowserRouter> wrapper trims ~10kb gzipped and
// eliminates the react-router v7 ↔ vite-react-ssg v6-API conflict that
// previously blocked SSG adoption.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TimeOfDayProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </TimeOfDayProvider>
  </StrictMode>,
)
