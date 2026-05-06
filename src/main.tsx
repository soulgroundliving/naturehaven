import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { TimeOfDayProvider } from '@/contexts/TimeOfDayContext'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <TimeOfDayProvider>
        <App />
      </TimeOfDayProvider>
    </BrowserRouter>
  </StrictMode>,
)
