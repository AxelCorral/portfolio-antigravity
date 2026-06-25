import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import '@/scroll/gsap-setup'
import App from './App.tsx'
import { LanguageProvider } from '@/i18n/language'

// Custom step/scroll restoration (see returnPosition.ts) replaces the
// browser's own scroll restoration, which doesn't know about step state.
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </LanguageProvider>
  </StrictMode>,
)
