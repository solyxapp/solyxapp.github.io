# Solyx Website Release Readiness

## October 14 release authorization

Joseph confirmed that Solyx 1.1 is released to all users and requested publication.
Read-only App Store Connect checks confirmed version 1.1 (19) is
READY_FOR_DISTRIBUTION, Lifetime is APPROVED and NON_CONSUMABLE, and its current
USA base price is $79.99 USD. The previous publication hold below is superseded.
Deployment target: `org/main`, `solyxapp/solyxapp.github.io`, GitHub Pages at
https://solyxapp.com/. The dirty primary website checkout remains untouched.
Support device wording now includes iPad as well as iPhone.

## Historical pre-launch audit

Status at the time of the audit: **NOT DEPLOYED. FINAL LAUNCH COPY PREPARED LOCALLY.**

Do not publish until the coordinated release gate is satisfied. The user has
authorized the final consistency audit to commit verified scoped website changes
and push only `origin/website/app-store-launch`. Committing or pushing this
non-publishing branch does not authorize publication.

## Ownership and baseline

- Website repo: `/Users/joseph/Developer/solyx-support`.
- Work performed only in its existing `/Users/joseph/Developer/solyx-launch-link`
  worktree, branch `website/app-store-launch`, baseline `9cfdb79`.
- The main website checkout contains earlier dirty work and was not changed.
  The existing untracked `.DS_Store` in this worktree was also left alone.
- Initial preparation made no commits or pushes. Across both passes, no iOS file
  changes, simulator actions, Store configuration, purchases, paid services, new
  dependencies or deployments. The final audit's scoped commit/branch push is
  separately authorized; production remains unchanged.
- Read website DESIGN.md and README plus Solyx product/design/toolkit guidance.
  Impeccable context launcher was not executable; existing context was read
  directly. Approved galaxy, typography, sequential phones and catalog remain.
- Read-only check of https://solyxapp.com/ on October 11 confirmed the old slogan,
  108 counts, and subscription-only copy. That public site was not changed.

## Prepared changes

### October 12 billing disclosure audit

Follow-up baseline: `16a6cb0`, on `website/app-store-launch`. Homepage FAQ and
download copy now explicitly say subscriptions renew automatically until
canceled. Support also identifies Lifetime as non-consumable; FAQ and support
explicitly say no subscription is needed with Lifetime. README records the same
purchase model. The prepared $79.99 USD price, localized in-app pricing and
eligible yearly trial remain unchanged.

Privacy, Terms destinations, SEO/share titles, legacy confirmation, robots and
sitemap required no further changes. Apple's
[purchase-type definitions](https://developer.apple.com/help/app-store-connect/reference/in-app-purchases-and-subscriptions/in-app-purchase-types/)
confirm the distinction between a one-time non-consumable and auto-renewing
subscriptions. This audit does not verify live product availability or pricing.

Verification: strengthened assertions first reproduced three missing disclosure
failures (14 passed), then all **17 content checks, 3 gate tests and 85 browser
checks passed**. Browser results report no runtime or HTTP errors across five
widths. Focused pricing/support captures at 390px and 1440px were inspected with
readable wrapping and no overlap. Fresh evidence is in
`qa/2026-10-12-lifetime-billing/`; use that path as `AUDIT_OUTPUT` to reproduce.
Both edited test scripts pass Node syntax checks. The default release check,
with confirmation unset, still exits 2; no valid gate attestation was supplied.

Owner steps remain: independently verify the app and Lifetime are actually live,
the USD/local prices and production purchase/restore/access paths are correct,
and existing subscribers retain access. Only then run the attested release check
and authorize integration into the actual publishing branch, `org/main`, followed
by public-site verification. Neither publishing branch is a push target for this
audit. No deployment, marketing-chat message, Store change or native action was
performed; the dirty primary checkout and untracked `.DS_Store` remain untouched.

### Final Lifetime consistency audit

The follow-up begins at parent-reviewed commit `5c66db8`. The only remaining
customer-facing mismatches were subscription-only analytics terminology in the
account FAQ and privacy policy. These now say purchase analytics, purchase
performance, purchase offer/offering, and conversions to purchases. Read-only
inspection of `PremiumEntitlementService.recordPaywallImpression` confirmed the
event uses the displayed offering shared by the available purchase packages; no
new tracking behavior or fields are claimed or introduced.

| Surface | Result |
| --- | --- |
| Homepage pricing FAQ and download note | Monthly/yearly OR $79.99 USD one-time Lifetime, localized in-app pricing; eligible yearly trial only |
| Homepage account FAQ | Purchase access and limited purchase analytics, no subscription-only implication |
| Support | Restore applies to subscriptions and Lifetime; cancellation applies to subscriptions; Lifetime does not renew |
| Privacy purchases, analytics and retention | Purchase-wide terminology; subscription renewal remains a valid specific example; same event fields, exclusions, retention claims and effective date |
| Terms | No local custom Terms document. Both links retain Apple's standard EULA; no subscription-only terms hosted here |
| Metadata and structured data | All four HTML routes audited, including meta content. No JSON-LD, microdata pricing or subscription-only offer schema present; none invented |
| Legacy confirmation, robots and sitemap | No paid-plan claims or subscription-only assumptions requiring changes |
| Approved product images | Unchanged; website QA captures are separate from source app screenshots |

The [Apple standard EULA](https://www.apple.com/legal/internet-services/itunes/dev/stdeula/)
was read directly; its Scope of License covers content/services purchased within
the app rather than restricting the license to subscriptions. No replacement
legal terms or additional legal promises were drafted.

GitHub API verification confirms both repositories publish Pages from `main` at
`/`: `origin` is `j2004p/solyx-support`; `org` is
`solyxapp/solyxapp.github.io` (the `solyxapp.com` site). Origin's only listed
workflow is the generated Pages build/deployment workflow. The authorized push
target is explicitly `origin HEAD:refs/heads/website/app-store-launch`, never
either `main`, and not `org`. The dirty primary checkout remains untouched.

Content is ready for the coordinated release, but **NOT DEPLOYED** and not a
claim that the app/Lifetime are live. Remaining deployment steps are:

1. Independently verify the new app and Lifetime product are live, localized
   prices are correct, and production purchase/restore/access behavior passes.
2. Run `SOLYX_RELEASE_CONFIRMED=app-and-lifetime-live node scripts/release-check.cjs`
   against the reviewed local build. This is an operator attestation, not an
   automated App Store check; no attestation was supplied during this audit.
3. Obtain the standing coordinated deployment approval, then intentionally
   integrate the reviewed branch into the actual site's `org/main` publishing
   branch through the owner's release workflow. Do not overwrite the dirty
   primary checkout or assume an origin feature-branch push publishes solyxapp.com.
4. After the authorized deploy, check the public homepage, support, privacy,
   official Store/Terms links, localized purchase flow and browser rendering.

No launch copy edits remain. The existing motion-accessibility and real-device
performance limitations below are unchanged and are not Lifetime copy blockers.

Final audit verification: **105 checks passed** (17 preview/content/metadata,
3 fail-closed gate, 85 browser). New checks reproduced the remaining account FAQ
and privacy mismatches before the terminology changes, then passed. Desktop and
mobile account FAQ/privacy captures were inspected; no text overlap was found.
Evidence is in `qa/lifetime-consistency/`, separate from the parent's reviewed
initial captures. `AUDIT_OUTPUT=qa/lifetime-consistency node scripts/browser-audit.cjs`
reproduces the browser evidence without overwriting that initial set.

Follow-up changed paths: `index.html`, `privacy/index.html`,
`scripts/release-check.cjs`, `scripts/browser-audit.cjs`, `README.md`, this report,
and `qa/lifetime-consistency/`. Support, legal destinations, approved app images,
CSS, JavaScript rendering, and the release gate's confirmation requirement did
not need changes. Existing untracked `.DS_Store` is excluded from the commit.

### Initial release preparation

- Exact thesis: `Your habits build your galaxy.` in hero, title and social/search
  metadata. Copy says `100+ planets. 100+ constellations.`
- Homepage FAQ, download note and support contain final launch-ready copy:
  monthly/yearly subscriptions OR Lifetime for $79.99 USD once, with local pricing
  in the app. The yearly trial remains limited to eligible new subscribers.
  Support covers Restore Purchases for subscriptions and Lifetime, and explicitly
  says Lifetime does not renew. No "coming soon" copy remains to edit at launch.
  These local claims are staged for the release, not evidence it is already live.
- Privacy terminology now covers purchases/options/access including Lifetime.
  Effective September 29, 2026 is preserved, as are analytics, retention, data,
  notifications and other legal claims. Parent reports the published ASC privacy
  URL was already verified against the manifest; that verification is not redone
  or represented as a website deployment here.
- The October 11 close Galaxy capture shows constellation bands, spiral dust and
  updated sun. The old reveal screenshot is replaced by the current marketing
  Archive capture rather than misrepresenting an old interaction as the new one.
  Mission Control continues to show history/consistency; no fabricated new-history
  or reveal image is used.
- Five WebP assets total 253,752 bytes vs 5,599,063 bytes for the five formerly
  referenced PNGs (95.5% smaller). Original files remain for provenance/rollback.
- Phone WebGL contexts and textures now initialize within 300px of the viewport.
  Native lazy loading can still prefetch nearby images, as intended.
- Hero fallback is visible with JavaScript disabled or a failed module load,
  then hidden only after the actual galaxy renderer is ready.
- Scroll story preserves real screen-reader text; its previous aria-label on a
  paragraph hid all words from Chromium's accessibility tree. Dim word color now
  starts at #949494 on #050505 instead of #343434, retaining legible contrast.
- Standalone navigation/footer links have 44px minimum height; document text can
  wrap long addresses. Support/privacy gain first-focus skip links and canonicals.
- Local preview serves WebP/JPEG/XML with correct types and exposes robots/sitemap
  for inspection. Existing canonical production URLs, sitemap, robots, official
  App Store link and noindex legacy confirmation route are preserved.
- No invented ratings, reviews, free price, or pre-release Lifetime offer schema.

## Source images

`scripts/prepare-release-images.cjs` creates the following derivatives without
altering the source captures:

| Output under assets/ | Source | Dimensions |
| --- | --- | --- |
| habits-20261011.webp | solyx-screenshots/public/screenshots/solyx/01-habit-list.png | 660x1435 |
| galaxy-overview-20261011.webp | Solyx/Marketing/AppStore/2026-10-11-refresh/sources/iphone/03-galaxy-close.png | 660x1434 |
| archive-20261011.webp | solyx-screenshots/public/screenshots/solyx/04-archive.png | 660x1434 |
| mission-control-20261011.webp | solyx-screenshots/public/screenshots/solyx/02-mission-control.png | 660x1435 |
| galaxy-fallback-20261011.webp | Existing website assets/galaxy.png | 1100x2392 |

External source paths above are relative to `/Users/joseph/Developer/`.
The App Store refresh README identifies the Galaxy as an isolated synthetic
marketing fixture, not owner data. Habit list, Archive and Mission Control are
the unchanged sources used by that refresh. The site hero remains the separately
approved illustrative galaxy, not a claim of a literal in-app screenshot.

## Verification

- Seventeen local preview regressions pass: exact thesis, catalog counts, final
  pricing/trial/download wording, deferred distant textures, accessible story,
  support/privacy canonical and keyboard entry, Lifetime restore/nonrenewal,
  privacy terminology/date, and no-JavaScript hero fallback, plus purchase-wide
  analytics, all-route metadata/content scans, and Terms/cancellation checks.
- Three fail-closed release-gate tests pass: absent, generic `true`, and partial
  `app-live` confirmations all exit 2 before browser checks. New copy/privacy
  assertions and gate tests failed against the previous preparation before the
  fixes, then passed. No real release confirmation was supplied during this work.
- Before implementation, tests reproduced old copy, eager texture requests,
  inaccessible story, and missing document canonicals. The fallback assertion ran
  after its fix, so it is regression coverage, not a recorded red/green result.
- Chromium browser audit rerun with final launch copy: **85/85 checks passed**, zero page exceptions or HTTP
  errors, at 320, 390, 768, 1440 and 1920 CSS-pixel widths. Checks cover actual
  nonblank/changing hero canvas pixels, all four rendered phone textures, catalog
  population, FAQ disclosure, one H1/main per route, all-route horizontal overflow,
  keyboard skip navigation, stable reduced-motion pixels, paused reduced-motion
  catalog, and no-JavaScript image/FAQ fallback. These are emulated viewports, not
  physical-device or synthesized touch testing.
- Desktop/mobile hero, Galaxy chapter and full-page captures were visually
  inspected. Evidence and machine-readable results live under
  `qa/2026-10-11-release/`. No incoherent text/image overlap appeared in the
  inspected captures. The initial audit harness timed out while scrolling at
  1440px; instant test scrolling and a 30-second timeout completed the full rerun.
  Full-page captures are layout-only evidence: Chromium can omit the offscreen
  WebGL phone buffers and displace fixed focus elements when capturing a long
  page. Use the focused `galaxy-chapter-*` captures and per-phone pixel checks
  as rendering evidence, not the blank phone regions in `full-1440.jpg`.
- Final pricing and support were also captured at 390px and 1440px in
  `final-pricing-*.png` and `final-support-*.png`; inspected mobile support and
  both pricing captures have readable wrapping and no text overlap. All product
  screenshots remain the same approved captures; no new simulator work.
- JavaScript syntax checks and `git diff --check` pass.
- This is not a full WCAG certification, physical-device test, field Core Web
  Vitals measurement, or iOS 17 sign-off. The other agent owns native testing.

## Release gates and remaining issues

1. BLOCKER: Joseph must authorize a coordinated website deployment after the new
   app version and Lifetime product are live and production purchase/restore,
   localized pricing, entitlement access and existing-subscriber behavior have
   been independently verified. The launch copy is already final, but this report
   does not assert that availability has been verified.
2. Run the release check with `SOLYX_RELEASE_CONFIRMED=app-and-lifetime-live` only
   after the operator confirms those facts. Without that exact value the default
   command exits 2. `--preview` validates content without satisfying the release
   gate and clearly labels its result NOT DEPLOYED. The command never deploys or
   checks App Store/RevenueCat state itself; the value is an operator attestation,
   not automated proof. GitHub Pages has no new deployment lock: a publishing-
   branch push can bypass this procedural check and remains prohibited here.
3. Privacy terminology preparation is complete. Other legal claims and effective
   date are deliberately unchanged as requested. No launch-day copy rewrite or
   date change is left as a required task.
4. A dedicated current three-second reveal capture and any newly changed history
   surface are not in the approved refresh source set. Keep the truthful Archive
   and Mission Control imagery or obtain approved marketing captures separately.
   No simulators were opened to fill this gap.
5. Residual accessibility risk: the approved auto-moving catalog and hero have no
   on-page pause control. Reduced Motion is supported, but that alone does not
   establish WCAG 2.2.2 compliance. Resolving this requires an approved interaction
   change; the existing design explicitly says no visible motion toggle.
6. Residual performance risk: self-hosted Three.js remains a substantial initial
   script, and desktop headless WebGL is not a mobile GPU/battery benchmark.
   Measure real-device Safari and field CWV before promising performance scores.
7. Main checkout reconciliation remains an owner action. Do not overwrite the
   dirty `solyx-support` tree or blindly commit its unrelated changes.

## Reproduce locally

Use the already installed bundled Node/packages; nothing needs to be purchased
or installed. From this worktree:

```sh
export PATH="/Users/joseph/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH"
export NODE_PATH="/Users/joseph/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules"
PORT=4186 node scripts/preview.mjs
# In another terminal:
node --test scripts/release-gate.test.cjs
node scripts/release-check.cjs --preview
node scripts/browser-audit.cjs
```

After review and independent production verification, the parent/operator may
run the gated check (this command itself does not publish):

```sh
SOLYX_RELEASE_CONFIRMED=app-and-lifetime-live node scripts/release-check.cjs
```

Do not set this value simply to get a passing result during preparation.

Preview: http://127.0.0.1:4186/ (loopback only). Set `PREVIEW_URL` on both test
commands if a different preview port is needed. To regenerate assets, run
`node scripts/prepare-release-images.cjs`; optional `SOLYX_MARKETING` and
`SOLYX_CAPTURES` override external source directories.
The verification preview server was stopped after testing; run the command above
to reopen it. Opening the HTML directly shows the static fallback only.

## Changed paths

- `index.html`, `styles.css`, `site.js`, `assets/product-scenes.js`
- `support/index.html`, `privacy/index.html`
- `scripts/preview.mjs`
- `scripts/release-check.cjs`, `scripts/browser-audit.cjs`, `scripts/prepare-release-images.cjs`
- `scripts/release-gate.test.cjs`
- `assets/habits-20261011.webp`, `assets/galaxy-overview-20261011.webp`
- `assets/archive-20261011.webp`, `assets/mission-control-20261011.webp`
- `assets/galaxy-fallback-20261011.webp`
- `qa/2026-10-11-release/` (browser captures and results)
- `README.md`, `RELEASE-READINESS-2026-10-11.md`

The initial preparation was committed by the parent as `5c66db8` and pushed only
to `origin/website/app-store-launch`. The final consistency follow-up uses the
same scoped branch; deployment remains separately gated.
