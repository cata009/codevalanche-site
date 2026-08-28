# Codevalanche Marketing Site Design

## Goal

Create a standalone, production-ready marketing website for Codevalanche at `codevalanche.com`, starting from an empty project, with a premium modern developer-tool aesthetic inspired by the strongest patterns in Synara, Director, Orca, Herdr, Agent Orchestrator, Conductor, Cline, Superset, and related competitor sites without copying their source, copy, imagery, or brand identity.

## Audience and positioning

The audience is technical builders and teams evaluating an AI coding workspace. The site positions Codevalanche as a local-first desktop workspace for serious agentic coding: real projects on disk, multiple coding-agent runtimes, explicit permissions, visible changes, and evidence-driven verification.

The site must not promise a download, waitlist, launch date, or availability that does not exist yet. It must not include a signup, email capture, or join CTA. The only primary interaction is exploration of the page itself.

## Visual direction

Design read: premium dark-tech product landing page for technical buyers, using a focused black and cool-white canvas, one electric cyan accent, technical grid texture, strong product imagery, restrained motion, and asymmetric editorial spacing.

Dial values:

- `DESIGN_VARIANCE`: 8, using split compositions, product-led panels, and varied section rhythms.
- `MOTION_INTENSITY`: 6, using reveal, hover, and tab transitions that support hierarchy and product understanding.
- `VISUAL_DENSITY`: 4, keeping generous whitespace around concise technical copy.

The page uses one dark theme and one radius system. It uses real Codevalanche screenshots sourced from the existing product workspace. Decorative UI must not be presented as a real product capability unless the underlying product supports it.

## Information architecture

1. Sticky navigation with Codevalanche mark, Product, Workflow, Privacy, FAQ, and a non-conversion `Explore` anchor.
2. Hero with the central positioning statement, short explanation, a `See how it works` anchor, and a real Codevalanche workspace screenshot.
3. Provider portability section showing supported runtime categories without inventing unsupported providers.
4. Workflow section showing the path from repository to task to change review and verification.
5. Product capability showcase with interactive tabs for workspace, terminals, diffs, and local-first controls; tabs are progressively enhanced and accessible without JavaScript.
6. Local-first/privacy section with concise, evidence-grounded claims.
7. Proof section using concrete product principles instead of fabricated customer logos, testimonials, star counts, or download numbers.
8. FAQ covering what Codevalanche is, how files are handled, model/runtime flexibility, and current availability.
9. Footer with Radovar attribution, Privacy, Terms, and Manage cookies.

## Analytics and cookies

Analytics is implemented behind explicit consent. The site ships a consent manager with three states: `unknown`, `accepted`, and `declined`. Until the visitor accepts analytics cookies, no third-party analytics script is injected and no analytics event is sent.

The analytics adapter is configured with a single replaceable GA4 measurement ID placeholder. It tracks only page views and a small set of non-sensitive interaction events such as section navigation, feature tab selection, and cookie preference changes. It never sends source code, form data, account data, query-string contents, or browser history.

Consent is stored in a first-party cookie with a one-year expiry. The banner is keyboard accessible, has a visible focus state, and offers a `Manage cookies` control in the footer so the choice can be changed. The Privacy page documents the purpose, provider, retention intent, and opt-out behavior. Because legal obligations depend on the final operating entity and audience, the copy is factual and avoids claiming legal compliance by itself.

## Technical architecture

Use a dependency-light static site that can be uploaded to GoDaddy file hosting as ordinary HTML, CSS, JavaScript, and image files. The project includes a small local build step that copies the validated `public/` output into `dist/`. No server runtime, database, or external API is required for the initial launch.

Proposed source units:

- `index.html`: semantic page structure and metadata.
- `styles.css`: design tokens, responsive layout, motion, and reduced-motion fallbacks.
- `script.js`: progressive enhancement for navigation, feature tabs, reveal state, consent, and analytics loading.
- `privacy.html`: privacy and cookie explanation.
- `terms.html`: short placeholder legal page that avoids unverified promises.
- `assets/`: Codevalanche logo, favicon, and selected product screenshots.
- `package.json` and `scripts/build.mjs`: reproducible static build.

## Responsive and accessibility requirements

- Mobile-first layout with no horizontal overflow.
- Keyboard navigation for all interactive controls.
- `prefers-reduced-motion` disables reveal and ambient animations.
- Meaningful alt text for product screenshots.
- Visible focus outlines with sufficient contrast.
- Skip link and semantic landmarks.
- No critical content hidden behind JavaScript.

## Hosting and rollout

First inspect GoDaddy products for `codevalanche.com`, existing Website Builder ownership, and any Web Hosting plan. If conventional hosting exists, upload the static `dist/` files to the correct document root and configure the domain/SSL without disturbing Radovar. If no conventional hosting is attached, report the exact blocker before purchasing anything or changing an unrelated product.

Before publishing, run the build, inspect the site in a browser at desktop and narrow widths, verify cookie-gated analytics behavior, check all internal anchors and legal pages, and confirm that the deployed domain serves HTTPS.
