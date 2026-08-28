# Codevalanche Marketing Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish a static Codevalanche product website at `codevalanche.com` with a premium developer-tool aesthetic, real product imagery, consent-gated analytics, and no download or signup CTA.

**Architecture:** A dependency-light static site with semantic HTML, one responsive stylesheet, and one progressive-enhancement script. GoDaddy receives only the generated static output, so no Node server or database is required in production.

**Tech Stack:** HTML, CSS, browser JavaScript, Node.js build script, GA4 loader gated by first-party consent.

**Spec:** `docs/superpowers/specs/2026-08-29-codevalanche-marketing-site-design.md`

## Global Constraints

- Start from an empty standalone project in `C:\Users\mihai\Desktop\Creator\Codevalanche.com`.
- Do not include a download, waitlist, signup, email capture, or join CTA.
- Keep all visible copy in English and ground product claims in the existing Codevalanche product and Radovar materials.
- Use one dark theme, one cyan accent, one radius scale, and no copied competitor assets or source.
- Do not inject analytics or send analytics events before explicit visitor acceptance.
- Do not upload or expose secrets, account identifiers, or passwords.
- Preserve the existing Radovar site and domain configuration.

### Task 1: Create the static project shell

**Files:**
- Create: `package.json`
- Create: `scripts/build.mjs`
- Create: `.gitignore`
- Create: `src/index.html`
- Create: `src/styles.css`
- Create: `src/script.js`
- Create: `src/privacy.html`
- Create: `src/terms.html`

**Interfaces:**
- `npm run build` removes and recreates `dist/`, then copies the contents of `src/` into it.
- All production files remain ordinary static assets that can be uploaded to a GoDaddy document root.

- [ ] **Step 1: Write the build contract**

  `package.json` exposes `build: node scripts/build.mjs`; the build script must fail on missing `src/index.html` and copy every source file without rewriting content.

- [ ] **Step 2: Implement the shell**

  Add semantic landmarks, global metadata, `#main`, and empty section anchors in `src/index.html`; put all styling in `src/styles.css` and all behavior in `src/script.js`.

- [ ] **Step 3: Run the build**

  Run `npm run build`. Expected: `dist/index.html`, `dist/styles.css`, `dist/script.js`, `dist/privacy.html`, and `dist/terms.html` exist.

- [ ] **Step 4: Commit**

  `git add . && git commit -m "feat: scaffold Codevalanche product site"`

### Task 2: Implement the product-led landing page

**Files:**
- Modify: `src/index.html`
- Modify: `src/styles.css`
- Copy: `src/assets/codevalanche-workspace.png` from the existing Codevalanche QA screenshot
- Copy: `src/assets/codevalanche-mark.svg` from the existing Codevalanche public assets

**Interfaces:**
- Navigation anchors use `#product`, `#workflow`, `#privacy`, and `#faq`.
- Feature showcase buttons carry `data-feature` and panels carry matching `data-panel` values.

- [ ] **Step 1: Add the page sections**

  Add navigation, hero, provider portability, workflow, feature showcase, local-first principles, proof, FAQ, and footer sections. Use realistic product-specific copy and omit unverified customer counts, logos, testimonials, or release promises.

- [ ] **Step 2: Add the product image**

  Place the real Codevalanche QA screenshot inside a labeled product frame with concise alt text. Use CSS-only window chrome and a caption that identifies the visual as a current workspace view, not a claim of a specific feature.

- [ ] **Step 3: Add responsive styles**

  Use mobile-first CSS grid, `min-height: 100dvh`, `max-width: 1280px`, no horizontal overflow, and breakpoints around 720px and 1040px. Keep desktop navigation on one line and collapse it into a native `details` menu on narrow screens.

- [ ] **Step 4: Add restrained motion**

  Use opacity/transform reveal classes, hero entrance, tab transitions, and hover feedback. Wrap motion in `@media (prefers-reduced-motion: no-preference)` and keep a fully readable static fallback.

- [ ] **Step 5: Build and inspect source output**

  Run `npm run build`, then verify every image has alt text, every internal link resolves to an existing anchor, and no visible string contains an em dash or a download/signup promise.

- [ ] **Step 6: Commit**

  `git add src && git commit -m "feat: build Codevalanche product landing page"`

### Task 3: Add consent-gated analytics and legal surfaces

**Files:**
- Modify: `src/index.html`
- Modify: `src/script.js`
- Modify: `src/styles.css`
- Modify: `src/privacy.html`
- Modify: `src/terms.html`
- Create: `src/analytics-config.js`

**Interfaces:**
- `window.CodevalancheConsent.get()` returns `"unknown" | "accepted" | "declined"`.
- `window.CodevalancheConsent.set(value)` stores the first-party consent cookie and updates the UI.
- `window.CodevalancheAnalytics.track(name, params)` is a no-op unless consent is `"accepted"` and GA4 is configured.

- [ ] **Step 1: Add the consent UI**

  Add a banner with Accept analytics, Decline, and Manage preferences controls plus a footer manage-cookies control. Store `codevalanche_consent=accepted|declined` for one year using `SameSite=Lax; Secure` when HTTPS is active.

- [ ] **Step 2: Add the analytics adapter**

  Load GA4 dynamically only after acceptance and only when `MEASUREMENT_ID` is not the placeholder `G-XXXXXXXXXX`. Track page view, navigation anchor, feature tab selection, and consent change events without query strings or user-entered data.

- [ ] **Step 3: Document the behavior**

  Explain essential storage, optional analytics, consent withdrawal, and the current placeholder status in `privacy.html`. Keep `terms.html` factual and free of launch or availability claims.

- [ ] **Step 4: Verify the consent contract**

  Run the build and use a browser to confirm: unknown shows the banner and makes no GA request; decline hides the banner and makes no GA request; accept loads GA only if configured; manage cookies reopens the preferences panel.

- [ ] **Step 5: Commit**

  `git add src && git commit -m "feat: add consent-gated analytics"`

### Task 4: Metadata, favicon, and deployment package

**Files:**
- Modify: `src/index.html`
- Create: `src/robots.txt`
- Create: `src/sitemap.xml`
- Copy: `src/assets/favicon.svg`

**Interfaces:**
- Canonical URL is `https://codevalanche.com/`.
- Sitemap contains `/`, `/privacy.html`, and `/terms.html`.

- [ ] **Step 1: Add SEO metadata**

  Add canonical, Open Graph, X card, theme color, and application metadata for Codevalanche. Use an honest description that does not imply the app is downloadable today.

- [ ] **Step 2: Add crawler files**

  Create `robots.txt` pointing to `https://codevalanche.com/sitemap.xml` and a valid XML sitemap.

- [ ] **Step 3: Rebuild and verify the package**

  Run `npm run build`; assert that every referenced static file exists in `dist/` and that no source path escapes the project.

- [ ] **Step 4: Commit**

  `git add src && git commit -m "chore: prepare Codevalanche deployment metadata"`

### Task 5: Browser verification and GoDaddy publication

**Files:**
- Modify only if verification finds a real defect in `src/`.

**Interfaces:**
- The local site must render at the dev URL and the deployed site must render at `https://codevalanche.com/`.

- [ ] **Step 1: Run local browser checks**

  Start a local static server, inspect the desktop and narrow viewport, confirm meaningful content, no browser error overlay, functioning anchors, functioning feature tabs, and functioning cookie preferences.

- [ ] **Step 2: Inspect the final build**

  Run `npm run build` after all changes and verify the exact `dist/` package.

- [ ] **Step 3: Inspect GoDaddy products**

  Confirm `codevalanche.com` ownership, identify whether a conventional web-hosting plan exists, and identify the correct document root. Do not purchase anything or alter Radovar.

- [ ] **Step 4: Publish the static package**

  Upload the contents of `dist/` to the verified Codevalanche document root, configure the domain only if the hosting product requires it, and enable/verify SSL. Stop if GoDaddy has no compatible hosting product rather than switching products or spending money.

- [ ] **Step 5: Verify the live domain**

  Open `https://codevalanche.com/`, verify page title, hero, navigation, legal pages, cookies, and absence of an active download/signup CTA. Keep the live page available for the user.

- [ ] **Step 6: Commit any final source fix**

  If a real defect was fixed after local QA, run the build again and commit it with a focused message.
