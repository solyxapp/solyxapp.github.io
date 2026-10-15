# Solyx Website

Static, mobile-first product website for Solyx. There is no build step. Opening `index.html` directly provides the HTML/image fallback; use the local HTTP preview for the self-hosted Three.js modules.

## Release Status

On October 14, 2026, Joseph confirmed the public release of Solyx 1.1 and
authorized publication of this website update. App Store Connect independently
confirmed version 1.1 (19) as READY_FOR_DISTRIBUTION and Solyx Lifetime as an
APPROVED non-consumable purchase, with a USA base price of $79.99 USD.
This supersedes the earlier pre-launch publication hold. Production deployment
uses `org/main` in `solyxapp/solyxapp.github.io`; GitHub Pages build status and
the public homepage, support, and privacy pages must be checked after pushing.
See `RELEASE-READINESS-2026-10-11.md` for the historical preparation evidence.

Use `node scripts/release-check.cjs --preview` for local validation. The default
release check exits 2 unless the operator supplies
`SOLYX_RELEASE_CONFIRMED=app-and-lifetime-live` after independently confirming
the app release, Lifetime availability, purchases/restores and localized prices.
The check never deploys. This is a procedural verification gate, not a GitHub
Pages deployment lock: do not push to the publishing branch before approval.

For a local browser preview, run `node scripts/preview.mjs` and open `http://127.0.0.1:4175/`. The server binds only to this Mac and does not publish the site.

- Home: `/`
- Support: `/support/`
- Privacy Policy: `/privacy/`
- Legacy confirmation URL: `/confirmed/` (generic product introduction)
- Terms: Apple's standard EULA

## Purchase Copy

Monthly and yearly plans are auto-renewing subscriptions until canceled.
Lifetime is a $79.99 USD one-time, non-consumable purchase that does not renew;
no subscription is needed with Lifetime. Local prices and full purchase terms
are shown in the app. The 7-day yearly trial is for eligible new subscribers,
not Lifetime. App Store Connect release and Lifetime approval were verified on
October 14, 2026; local prices and eligibility remain authoritative in the app.

## Launch

Solyx is live on the App Store. Download links are in the HTML so they work even without JavaScript. App ID: `6775335663`. Apple's official badge is stored at `assets/app-store-badge.svg`.

The production domain is `solyxapp.com`. The galaxy redesign and App Store download links were approved for publication on October 1, 2026. GitHub Pages publishes the `main` branch of `solyxapp/solyxapp.github.io`.

## Assets and motion

Original PNGs remain unchanged. The page uses optimized WebP derivatives, including the October 11 Galaxy capture and the current App Store editor's habit list, Archive, and Mission Control captures. Source paths and regeneration instructions are in the readiness report. Typography uses Opal's system font stack; no web font download is needed. The hero is a locally rendered Three.js galaxy with continuous motion and system Reduced Motion support. Rendering stops offscreen or in a hidden tab. A bitmap fallback remains if JavaScript or WebGL is unavailable. Three.js 0.180.0 is self-hosted with its MIT license in assets; no external runtime requests, signup forms, or tracking libraries are loaded. Sequential feature sections use angled Three.js phones, alternating on desktop and stacking on mobile. Phone renderers and textures initialize near the viewport. Screenshots remain readable without JavaScript or WebGL. A scroll-lit statement and opposing catalog rows replace the old tabbed tour. Collection textures load near the viewport, and the temporary planet renderer is released after generating portraits.
