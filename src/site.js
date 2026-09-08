      (() => {
        "use strict"
        const CONSENT_COOKIE = "codevalanche_consent"
        const CONSENT_MAX_AGE = 60 * 60 * 24 * 365
        const analyticsConfig = window.CODEVALANCHE_ANALYTICS || { measurementId: "G-XXXXXXXXXX" }
        const banner = document.querySelector("#consent-banner")
        const preferences = document.querySelector("#consent-preferences")
        const toggle = document.querySelector("[data-toggle-analytics]")
        let analyticsLoaded = false
        const getCookie = (name) => document.cookie.split("; ").find((entry) => entry.startsWith(`${name}=`))?.split("=")[1] || ""
        const getConsent = () => { try { const value = decodeURIComponent(getCookie(CONSENT_COOKIE)); return value === "accepted" || value === "declined" ? value : "unknown" } catch { return "unknown" } }
        const setConsent = (value) => { if (!["accepted", "declined"].includes(value)) return; document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(value)}; Max-Age=${CONSENT_MAX_AGE}; Path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`; window.dispatchEvent(new CustomEvent("codevalanche-consent")) }
        const validMeasurementId = typeof analyticsConfig.measurementId === "string" && /^G-[A-Z0-9]+$/i.test(analyticsConfig.measurementId) && analyticsConfig.measurementId !== "G-XXXXXXXXXX"
        const loadAnalytics = () => {
          if (analyticsLoaded || !validMeasurementId) return
          analyticsLoaded = true
          window.dataLayer = window.dataLayer || []
          window.gtag = function gtag() { window.dataLayer.push(arguments) }
          window.gtag("js", new Date())
          window.gtag("config", analyticsConfig.measurementId, { anonymize_ip: true, send_page_view: true })
          const script = document.createElement("script")
          script.async = true
          script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(analyticsConfig.measurementId)}`
          document.head.appendChild(script)
        }
        const track = (name, params = {}) => {
          if (getConsent() !== "accepted" || !validMeasurementId || typeof window.gtag !== "function") return
          const safeParams = Object.fromEntries(Object.entries(params).filter(([key, value]) => key.length < 40 && typeof value === "string" && value.length < 80))
          window.gtag("event", name, safeParams)
        }
        window.CodevalancheConsent = { get: getConsent, set: (value) => { setConsent(value); if (value === "accepted") loadAnalytics(); updateConsentUI() } }
        window.CodevalancheAnalytics = { track }
        const updateConsentUI = () => { const consent = getConsent(); if (banner) banner.hidden = consent !== "unknown"; if (toggle) { const enabled = consent === "accepted"; toggle.setAttribute("aria-checked", String(enabled)); const label = toggle.querySelector("b"); if (label) label.textContent = enabled ? "On" : "Off" } }
        let preferencesInvoker = null
        const openPreferences = () => { if (!preferences) return; preferencesInvoker = document.activeElement; const enabled = getConsent() === "accepted"; toggle?.setAttribute("aria-checked", String(enabled)); preferences.hidden = false; preferences.querySelector("[data-close-consent]")?.focus() }
        const closePreferences = () => { if (!preferences) return; preferences.hidden = true; if (preferencesInvoker && typeof preferencesInvoker.focus === "function") preferencesInvoker.focus(); preferencesInvoker = null }
        preferences?.addEventListener("keydown", (event) => {
          if (event.key !== "Tab") return
          const focusables = [...preferences.querySelectorAll("button, [href], [tabindex]:not([tabindex='-1'])")].filter((el) => !el.disabled && el.offsetParent !== null)
          if (!focusables.length) return
          const first = focusables[0]
          const last = focusables[focusables.length - 1]
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
        })
        const savePreferences = () => { const value = toggle?.getAttribute("aria-checked") === "true" ? "accepted" : "declined"; setConsent(value); if (value === "accepted") loadAnalytics(); track("consent_preference_saved", { preference: value }); closePreferences(); updateConsentUI() }
        document.querySelectorAll("[data-consent]").forEach((button) => button.addEventListener("click", () => { const value = button.getAttribute("data-consent"); if (value !== "accepted" && value !== "declined") return; setConsent(value); if (value === "accepted") loadAnalytics(); updateConsentUI(); track("consent_choice", { preference: value }) }))
        document.querySelectorAll("[data-open-consent]").forEach((button) => button.addEventListener("click", openPreferences))
        document.querySelectorAll("[data-close-consent]").forEach((button) => button.addEventListener("click", closePreferences))
        document.querySelector("[data-save-preferences]")?.addEventListener("click", savePreferences)
        toggle?.addEventListener("click", () => { const enabled = toggle.getAttribute("aria-checked") === "true"; toggle.setAttribute("aria-checked", String(!enabled)); const label = toggle.querySelector("b"); if (label) label.textContent = enabled ? "Off" : "On" })
        preferences?.addEventListener("click", (event) => { if (event.target === preferences) closePreferences() })
        document.addEventListener("keydown", (event) => { if (event.key === "Escape" && preferences && !preferences.hidden) closePreferences() })
        document.querySelectorAll(".feature-tab").forEach((button) => {
          button.addEventListener("click", () => { const feature = button.getAttribute("data-feature"); document.querySelectorAll(".feature-tab").forEach((item) => { const active = item === button; item.classList.toggle("is-active", active); item.setAttribute("aria-selected", String(active)) }); document.querySelectorAll(".feature-panel").forEach((panel) => { panel.hidden = panel.getAttribute("data-panel") !== feature; panel.classList.toggle("is-active", panel.getAttribute("data-panel") === feature) }); track("feature_selected", { feature: feature || "unknown" }) })
          button.addEventListener("keydown", (event) => { if (!["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return; const buttons = [...document.querySelectorAll(".feature-tab")]; const index = buttons.indexOf(button); const forward = event.key === "ArrowDown" || event.key === "ArrowRight"; const next = event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 : (index + (forward ? 1 : -1) + buttons.length) % buttons.length; event.preventDefault(); buttons[next]?.focus(); buttons[next]?.click() })
        })
        document.querySelectorAll("a[href^='#']").forEach((link) => link.addEventListener("click", () => track("navigation_anchor", { target: link.getAttribute("href") || "unknown" })))
        const mobileNav = document.querySelector(".mobile-nav")
        mobileNav?.querySelectorAll(".mobile-nav-panel a").forEach((link) => link.addEventListener("click", () => mobileNav.removeAttribute("open")))
        const langPicker = document.querySelector(".lang-picker")
        document.addEventListener("click", (event) => {
          if (mobileNav?.hasAttribute("open") && !mobileNav.contains(event.target)) mobileNav.removeAttribute("open")
          if (langPicker?.hasAttribute("open") && !langPicker.contains(event.target)) langPicker.removeAttribute("open")
        })
        updateConsentUI()
        if (getConsent() === "accepted") loadAnalytics()
        const fine = window.matchMedia("(pointer: fine)").matches
        if (fine) document.querySelectorAll(".spot").forEach((card) => {
          card.addEventListener("pointermove", (event) => { const rect = card.getBoundingClientRect(); card.style.setProperty("--mx", `${event.clientX - rect.left}px`); card.style.setProperty("--my", `${event.clientY - rect.top}px`) })
        })
        const THEME_KEY = "codevalanche_theme"
        const themeToggle = document.querySelector("[data-theme-toggle]")
        const applyTheme = (theme, persist) => {
          document.documentElement.setAttribute("data-theme", theme)
          if (persist) { try { localStorage.setItem(THEME_KEY, theme) } catch {} }
          themeToggle?.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme")
          document.querySelector("meta[name='theme-color']")?.setAttribute("content", theme === "dark" ? "#07090b" : "#f7f9fa")
          window.dispatchEvent(new CustomEvent("codevalanche-theme"))
        }
        themeToggle?.addEventListener("click", () => { const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark"; applyTheme(next, true); track("theme_toggled", { theme: next }) })
        const lightQuery = window.matchMedia("(prefers-color-scheme: light)")
        lightQuery.addEventListener?.("change", () => { try { if (!localStorage.getItem(THEME_KEY)) applyTheme(lightQuery.matches ? "light" : "dark", false) } catch {} })
        applyTheme(document.documentElement.getAttribute("data-theme") || "dark", false)
      })()
