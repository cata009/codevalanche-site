(() => {
  "use strict"
  const config = window.CODEVALANCHE_CONFIG || {}
  const origin = (value) => {
    try {
      const url = new URL(value)
      const local = url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname)
      return (url.protocol === "https:" || local) && !url.username && !url.password && url.pathname === "/" && !url.search && !url.hash ? url.origin : ""
    } catch { return "" }
  }
  const accountOrigin = origin(config.accountOrigin)
  const apiOrigin = origin(config.apiOrigin)
  document.querySelectorAll("[data-account-link]").forEach((link) => {
    if (accountOrigin) { link.href = `${accountOrigin}/account/`; link.hidden = false }
  })
  const unavailable = document.querySelector("[data-account-unavailable]")
  if (unavailable && accountOrigin) unavailable.hidden = true
  const ID_KEY = "codevalanche_analytics_installation"
  const accepted = () => document.cookie.split(";").some((part) => part.trim() === "codevalanche_consent=accepted")
  let memoryId = null
  let viewed = false
  const forget = () => { memoryId = null; try { localStorage.removeItem(ID_KEY) } catch {} }
  const track = (eventName, platform = "web") => {
    if (!accepted() || !apiOrigin || !["website_view", "download_clicked"].includes(eventName)) return
    platform = ["mac-arm", "mac-intel"].includes(platform) ? "macos" : platform
    if (!["web", "windows", "macos", "linux", "ios", "android"].includes(platform)) return
    try {
      let installationId = memoryId
      try { installationId = localStorage.getItem(ID_KEY) || installationId } catch {}
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(installationId || "")) installationId = crypto.randomUUID()
      memoryId = installationId
      try { localStorage.setItem(ID_KEY, installationId) } catch {}
      const body = { eventId: crypto.randomUUID(), eventName, platform, installationId, consent: true }
      void fetch(`${apiOrigin}/api/codevalanche/accounts/events`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), credentials: "omit", referrerPolicy: "no-referrer", keepalive: true }).catch(() => {})
    } catch { /* Optional analytics must never interrupt browsing. */ }
  }
  const syncConsent = () => {
    if (!accepted()) { forget(); return }
    if (!viewed) { viewed = true; track("website_view") }
  }
  window.CodevalancheFunnel = { track }
  window.addEventListener("codevalanche-consent", syncConsent)
  // Catch consent changes in another tab before recording any further events.
  window.addEventListener("focus", syncConsent)
  document.addEventListener("click", (event) => {
    const link = event.target.closest?.("a[data-download-platform]")
    if (link && link.getAttribute("href")) track("download_clicked", link.getAttribute("data-download-platform"))
  })
  syncConsent()
})()

