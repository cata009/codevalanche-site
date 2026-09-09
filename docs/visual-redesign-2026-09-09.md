# Codevalanche — visual redesign, 9 September 2026

Local preview: http://127.0.0.1:4187
Repository: https://github.com/cata009/codevalanche-site
Status: approved by the user for publication on 9 September 2026.

## What changed

- Asymmetric hero puts the workspace beside the value proposition, with a clearer headline, shorter supporting copy and immediate Download action.
- Consistent header generated from `src/partials/header.html` during build, including a prominent Sign in action on Home, Changelog, Privacy and Terms. Mobile retains Sign in outside the menu.
- Stronger section hierarchy, split product introduction, aligned task board heading, redesigned details grid, refined Changelog and horizontally scrollable release navigation on mobile.
- Preserved the Codevalanche symbol and turquoise identity. Radovar is explicitly the company behind the product.
- Locally hosted Geist fonts with their license; no marketing-page dependency on Google Fonts requests.

## Bugs verified

The original details miniature used light text with a translucent dark background over a white card: measured 1.85:1 contrast. It now has an explicit opaque dark surface. Dark illustrative surfaces have their own text color; the light Workflow section uses the active theme consistently. Secondary text and the light primary button accent were adjusted too.

Changelog did not contain a Sign in link at all. All marketing pages now share one header source, preventing future divergence. The local preview server also resolves directory URLs such as `/account/`.

## Validation

- `npm run build`: passed.
- `npm test`: all 10 existing tests passed.
- `npm run test:browser`: account flow passed with mocked backend, including sign-up navigation, login, profile, sign-out and Google PKCE flow.
- `npm run test:marketing`: 320, 390, 768, 1024 and 1440 px, each in light/dark. Four public pages checked per combination. No horizontal page overflow or JavaScript errors.
- Verified Home → Changelog → Sign in, mobile menu navigation, theme toggle persistence, feature tabs and keyboard selection, FAQ, cookie preference dialog and Escape dismissal.
- Computed contrast checks for the details section, Workflow headings and primary navigation/CTA text: minimum 5.41:1 light and 6.61:1 dark. This is a targeted regression check, not a whole-site accessibility certification.
- Visual desktop/mobile inspection and before/after captures saved in `../_build/site-redesign/`.

## Review artifacts

- `before-light.png` and `desktop-light.png`: hero before/after.
- `before-details-light.png` and `details-desktop-light.png`: original bug and revised details.
- `desktop-dark.png`, `mobile-light.png`, `mobile-dark.png`.
- `changelog-1440-light.png`, `changelog-390-light.png`.
- `full-light.png`, `full-dark.png`, `verification.json`.

## Boundaries

Authentication service and download configuration remain as supplied. Public link navigation was tested; no real account was created and no email was sent. The user approved this Codevalanche version for publication; Radovar remains a separate local revision.
