import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router'

import { AuthProvider } from './components/Auth'
import { Footer } from './components/Footer'
import { ToastProvider } from './components/Overlay'
import { CurrencyProvider } from './components/Price'
import { StickyBar } from './components/Storefront'
import { Account } from './pages/Account'
import { Login, Register } from './pages/Auth'
import { Changelog } from './pages/Changelog'
import { ForumBoard, Forums } from './pages/Forums'
import { Docs } from './pages/Docs'
import { Games } from './pages/Games'
import { Home } from './pages/Home'
import { Privacy, Refunds, Terms } from './pages/Legal'
import { Licence } from './pages/Licence'
import { NotFound } from './pages/NotFound'
import { Platform } from './pages/Platform'
import { Pricing } from './pages/Pricing'
import { Status } from './pages/Status'
import { Support } from './pages/Support'

/** Scroll to the top on a new page, or to the #hash target when there is one. */
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
      return
    }
    // Wait for the page transition to mount the target.
    const t = window.setTimeout(() => {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 420)
    return () => window.clearTimeout(t)
  }, [pathname, hash])
  return null
}

function Pages() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.main
        id="main"
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1"
      >
        <Routes location={location}>
          <Route index element={<Home />} />
          <Route path="games" element={<Games />} />
          <Route path="platforms/:slug" element={<Platform />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="changelog" element={<Changelog />} />
          <Route path="status" element={<Status />} />
          <Route path="docs" element={<Docs />} />
          <Route path="licence" element={<Licence />} />
          <Route path="support" element={<Support />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="account" element={<Account />} />
          <Route path="forums" element={<Forums />} />
          <Route path="forums/:board" element={<ForumBoard />} />
          <Route path="terms" element={<Terms />} />
          <Route path="refunds" element={<Refunds />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.main>
    </AnimatePresence>
  )
}

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || undefined}>
        <AuthProvider>
          <CurrencyProvider>
          <ToastProvider>
            <ScrollManager />
            <StickyBar />
            <a href="#main" className="sr-only z-[100] rounded-full bg-violet px-5 py-3 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
              Skip to content
            </a>
            <div id="top" className="flex min-h-svh flex-col">
              <Pages />
              <Footer />
            </div>
          </ToastProvider>
          </CurrencyProvider>
        </AuthProvider>
      </BrowserRouter>
    </MotionConfig>
  )
}
