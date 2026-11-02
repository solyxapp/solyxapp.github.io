# Solyx Website Design

Mobile-first, product-led, dark celestial design. The app's real screenshot artwork provides the visual identity rather than invented planets or decorative clouds. The homepage is a persuasion surface; support and privacy are reading surfaces.

## System

- Background #050505; secondary section #0b0b0d; foreground #f4f4f5; secondary text #b9b7c0; lines #303034; interaction accent #f1c94b.
- Opal's inspected system font stack, using the native Apple system face on iOS/macOS. No negative tracking or viewport-scaled type. Mobile section titles 40px, desktop 48px; body 16-20px.
- Mobile content has 22px side margins. Desktop content is capped at 1120px. Sections are unframed; rounded geometry is reserved for actual phone displays and controls.
- Pricing is an unframed list (no cards), matching the FAQ and personal sections.
- Preserve the existing screenshots. No fabricated ratings, testimonials, awards, or user counts.
- Full-bleed galaxy opening with Solyx as the H1. Plain App Store availability until the release is verified. No signup collection.
- Full-bleed live Three.js spiral galaxy, not a scaled screenshot. Layered stellar arms, unresolved starlight, slow rotation, and restrained pointer parallax on desktop. Continuous while visible; static for system Reduced Motion, suspended offscreen and in background tabs. No visible motion toggle, as requested.
- Opening scene ("the phone rises out of the galaxy"): the galaxy, hero, and app tour share one pinned viewport (`.cosmos`, 600svh of scroll). The first 16% of the scroll fades the hero up and raises one dark-titanium CSS iPhone from the galaxy core while the Three.js camera dollies in and the sky dims; the rest crossfades the real Habits, Galaxy, Archive, and Mission Control screenshots, with captions that hand off rather than overlap. Mobile puts the caption under the phone; desktop puts it left with the phone at 64%. Driven by `assets/sky.js` writing `--rise`, `--shown`, and `--copy`; transform and opacity only. Without JS or with Reduced Motion the steps stack in normal flow.
- Opposing discovery rows use native Solyx Rare and Legendary planet portraits and canonical constellation coordinates. Repeated copies are hidden from accessibility APIs. Reduced Motion makes the rows manually scrollable.
- On phones (700px and narrower) a solid App Store bar (`.dock`) slides up once the hero badge is gone and steps aside for the closing download section. One elevation: a 1px line, no shadow.
- No interactive demo on the site; the app's onboarding covers that.

## References

- https://www.bevel.health: smooth, product-first scrolling with the phone early (Joseph, November 2, 2026).
- https://opalapp.com: restrained celestial presentation and a prominent store destination.
- https://scrollmine.com: product-led transitions and direct copy.
- https://wisprflow.ai: distinctive typography and continuous visual storytelling.
- https://www.calai.app: real app imagery and a clear acquisition path.
- https://github.com/pbakaus/impeccable: craft, responsive behavior, accessibility, and bounded visual review.

These are visual references, not evidence for Solyx conversion claims.
