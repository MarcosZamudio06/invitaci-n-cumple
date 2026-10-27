# V3 — Final Riviera polish and live RSVP

Date: 2026-10-26, America/Mexico_City. Baseline Git commit `8d49564` (`primera versión`) was clean before work. **Implementation and automated validation: PASS. Rendered/mobile-device acceptance: PENDING. No deployment.** No commit, staging, reset, checkout, push or permission repair was performed.

## Preserved identity and actual refinements

This is refinement, not a rebuild: original Riviera palette, Outfit/DM Sans, LUCI hero, water/ring art, dark countdown, pale date, giant venue, sage swimsuit reminder, pool illustration, gallery/audio branches and footer remain. Source audit is recorded in `SOURCE-AUDIT.md`; it makes no invented screenshot claims.

| Before (verified source)                                | After                                                                                     | Why                                                                       |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Main body14px, some mobile informational prose11–13px   | Main supporting copy18–22px; date details22–32px with mobile-aware grouping               | Meet the requested legibility and hierarchy without enlarging every label |
| Shared desktop section padding100px and RSVP gap9vw     | 80px shared padding and bounded32–80px gutter                                             | Reduce isolation while preserving intentional negative space              |
| White RSVP section and transparent underlined fields    | Ivory section, white bordered fields, sage selected rows, champagne graphic               | Preserve identity and make input/selection states explicit                |
| Hidden count default0 companions and utility cap100     | Numeric total appears only for yes, initial1, no event cap when optional config absent    | Do not invent an attendance policy                                        |
| Empty recipient and generic message                     | Central supplied recipient/official base URL and personalized positive/negative templates | Functional reviewable WhatsApp handoff with real event data               |
| Visibility-only countdown refresh                       | Focus + visibility wall-clock refresh                                                     | Avoid stale countdown after returning focus                               |
| Bounded GSAP intro but no explicit visibility ownership | Intro ends2.1s; owned animations pause hidden/resume selectively and clean listeners      | Preserve lifecycle and avoid unnecessary hidden-tab work                  |

All exact palette aliases are exposed: ivory, water, sage, deep-teal, champagne, dusty-coral, text-primary, background-primary and surface. Original compatible aliases remain.

## Executed checks

| Check                                                 | Result                                          | Evidence                        |
| ----------------------------------------------------- | ----------------------------------------------- | ------------------------------- |
| Initial functional baseline                           | 44 PASS                                         | `baseline-tests.log`            |
| Final Vitest / Testing Library                        | 64 PASS,11 files                                | `tests.log`                     |
| TypeScript                                            | PASS, no diagnostics                            | `typecheck.log`                 |
| ESLint                                                | PASS,0 warnings/errors                          | `lint.log`                      |
| Check-only Prettier                                   | PASS                                            | `format.log`                    |
| Fresh root production build                           | PASS                                            | `build.log`                     |
| Subpath `/luci/` and public social metadata fixture   | PASS                                            | `build-subpath.log`             |
| HTML/configured resources                             | PASS in both outputs                            | build logs                      |
| Local HTTP HTML/JS/CSS/favicon/PNG                    | All200, expected MIME types                     | `http-smoke.json`               |
| Local HTTP subpath + absolute OG                      | All200, absolute image fixture correct          | `http-subpath-smoke.json`       |
| Dependency audit                                      | 0 vulnerabilities; no dependencies added for V3 | `audit.json`                    |
| Authored text/focus/control contrast                  | PASS normal≥4.5, input boundary≥3               | `contrast.json`                 |
| Impeccable detector                                   | `[]`                                            | `impeccable-detector.json`      |
| Git whitespace check                                  | PASS                                            | `git diff --check` executed     |
| Playwright installed dependencies                     | None                                            | `no-playwright.json`            |
| Actual browser screenshots/seven-width/hardware proof | NOT EXECUTED                                    | environment startup unavailable |

No Playwright was installed, executed or used. Local HTTP requests were to loopback assets only. Tests mocked `window.open`; no WhatsApp requests or messages were sent to the real recipient.

## TDD and feature coverage

RED before implementation is preserved in `red-rsvp.log`, `red-polish.log`, `red-motion-visibility.log`, `red-popup-recovery.log` and `red-privacy.log`. GREEN retains previous valid functional coverage rather than deleting it. The 44 original tests were adapted only where V3 intentionally changes the contract (live recipient, radio copy, numeric total, optional cap).

New coverage includes: one central endpoint/recipient; affirmative/negative templates; dynamic date/time/name/venue; accents, emoji, reserved characters and encoded newlines; omitted blank personal-message blocks; no count in declines; invalid/missing recipient or event data; explicit cap and safe-integer validation; positive total250 without hidden100 cap; no-input validation; selected attendance; number-field visibility; synchronous secure opening; accidental double-submit guard and deliberate retry; cleanup timer; recovery from thrown browser-opening exception; no browser-storage writes; precise privacy copy distinguishing service vs recipient; exact SEO; semantic palette aliases; focus refresh; owned-motion visibility cleanup; and only changed countdown cell animating220ms with aria-live off.

Existing real GSAP SplitText/context smoke, IANA/DST cases, UTC ICS, Maps, native-dialog keyboard/swipe/error/focus-return, opt-in audio/error feedback, markup axe checks and reduced/disabled motion still pass. Tests with jsdom do not prove layout, native browser focus-trap fidelity, actual audio or touch feel. Motion lifecycle tests instrument ownership; real plugin smoke proves import/split/revert, not rendered fluidity.

## RSVP behavior and privacy

`src/config/whatsapp.ts` owns the supplied public recipient and official `https://wa.me/` base. `invitation.whatsapp` forwards that value to preserve reusable missing-phone fixtures; runtime components/utilities do not repeat the number. `maxCompanions` is unset by default, not zero. When explicitly set, the total maximum is cap+1; technical validation only requires positive safe integers in the uncapped case.

The exact pre-open notice remains visible: **“Se abrirá WhatsApp con tu mensaje preparado. Solo falta presionar Enviar.”** Opening happens synchronously inside the valid submit gesture with noopener/noreferrer, not after an asynchronous callback. A700ms ref guard prevents accidental double activation; editing resets it and cleanup clears its timer. A browser exception produces an actionable error and manual link instead of permanently locking the form.

Privacy correction from independent review: the prepared message is present in the URL, so opening WhatsApp shares it with that service BEFORE the guest presses Send. Copy now explicitly distinguishes service sharing from sending to the recipient. The page does not claim registration or delivery, does not persist answers, and adds no backend, cookies, analytics or database. This does not claim what WhatsApp itself stores or processes.

## Builds, assets and remaining limits

- Clean root output: `/private/tmp/luci-riviera-v3-build-001`.
- Clean subpath output: `/private/tmp/luci-riviera-v3-subpath-001`, using example.org only as a fixture, not a deployment.
- Current root output copied non-destructively into `dist`. Root and copied index SHA256: `b856c6e0557b7f1f4ac83c287c673cebc7e24f9b9bc80d4a4cb8e96e8647ed7b`. Full hashes: `final-hashes.json`.
- Existing local preview at `http://127.0.0.1:4173/` serves V3; local serving is not publication.
- Historical unused hashed outputs may remain in `dist` because this sandbox denies deletion. Deploy the clean isolated output or a clean build outside that restriction. No chmod or destructive cleanup was attempted.
- Real1200×630 social PNG and favicon remain coherent and unchanged from V2; no new personal or fictitious photographs were introduced.
- JS538.05KB /176.92KB gzip. Vite retains its >500KB advisory; no warning limit was raised and no fragile dynamic-import rewrite was added during polish.
- Native computer-use startup again failed before browser inspection. Seven viewport widths, zoom, overflow, console, actual touch, iOS/Android, calendar-client imports, WhatsApp delivery and audio remain manual acceptance items. Follow `../MANUAL.md`.
- The confirmed event remains Friday13 November2026,17:00 America/Mexico_City =23:00Z, Jardín D-GALICIA. Age/address/exact coordinates/end time/photos/music remain unknown and unfilled. The map remains honestly disabled; the RSVP is now configured.
- Tracked `tsconfig.tsbuildinfo` changed as generated output of the repository's existing `tsc -b` command; it was not manually restored or staged.
