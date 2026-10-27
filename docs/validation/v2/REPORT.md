# V2 — Riviera Pool Party validation

Date: 2026-10-26, America/Mexico_City. **PARTIAL visual/device acceptance; implementation and automated validation complete.** This report supersedes V1 reports for the current invitation. Historical evidence is preserved, not silently rewritten.

## Confirmed content

Luci, birthday-pool-party, Friday 13 November 2026, 17:00 America/Mexico_City = 2026-11-13T23:00:00Z; Jardín D-GALICIA. No age, end time, street address, exact Maps point, phone, personal photos or music invented. No demo label or old nighttime identity remains in current UI/HTML/social artwork.

## Executed evidence

| Check                                                        | Result                                                          | Evidence                                         |
| ------------------------------------------------------------ | --------------------------------------------------------------- | ------------------------------------------------ |
| Vitest + React Testing Library                               | 44 PASS, 7 files                                                | `tests.log`                                      |
| Strict TypeScript                                            | PASS, no diagnostics                                            | `typecheck.log`                                  |
| ESLint                                                       | PASS, 0 warnings/errors                                         | `lint.log`                                       |
| Production root build                                        | PASS, fresh isolated output                                     | `build.log`                                      |
| Subpath `/luci/` + absolute public metadata fixture          | PASS                                                            | `build-subpath.log`                              |
| Static HTML/config assets                                    | PASS in both outputs                                            | build logs                                       |
| HTTP root index/JS/CSS/favicon/PNG                           | All 200, correct content types                                  | `http-smoke.json`                                |
| HTTP subpath JS/CSS/favicon/PNG + absolute OG fixture        | All 200                                                         | `http-subpath-smoke.json`                        |
| npm audit                                                    | 0 vulnerabilities                                               | `audit.json`                                     |
| Solid text and focus token contrast                          | All authored normal-text pairs ≥4.5:1                           | `contrast.json`                                  |
| axe-core markup checks                                       | No violations, contrast excluded in jsdom                       | `tests.log`                                      |
| Real GSAP plugin smoke                                       | PASS: SplitText chars/aria/revert; gsap.context timeline revert | `gsap-smoke.test.ts`                             |
| Actual rendered seven-width/device inspection                | NOT EXECUTED                                                    | browser startup unavailable; manual checklist    |
| Full Impeccable independent visual approval                  | NOT CLAIMED                                                     | principles/context applied, no rendered evidence |
| External WhatsApp delivery/audio/real calendar-client import | NOT EXECUTED                                                    | requires real phone/files/device                 |

No Playwright was installed, executed or used.

## TDD and regression scope

`red-countdown.log`: new hook import was absent before implementation. `red-riviera.log`: old hero/content failed new V2 assertions before replacement. `red-review.log`: metadata helper absent and focus token assertions failed before the bounded review fixes. Final GREEN includes the updated previous functional regressions rather than deleting gallery/audio/RSVP coverage.

Current tests cover real event date/time/day; IANA/DST invalid and ambiguous handling; countdown initial value, seconds, tab resume, expiry and timer cleanup; ICS valid named venue without fabricated address/end/duration; UTF-8 folds and escaping; Maps/WhatsApp encoding, RSVP limits and honest non-delivery state; gallery keyboard/swipe/error/empty graphic/focus return; explicit audio and accessible failure state; reduced/disabled motion and complete content; GSAP StrictMode ownership/cleanup and a real plugin/DOM/timeline smoke; multiline central metadata injection and escaping.

## Bounded refinement from independent code review

| Before                                                                          | After                                                                                                     | Why                                                                  |
| ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| currentColor focus on an ivory-text teal button produced an ivory ring on ivory | Dedicated deep-teal focus token on light sections, inverse token on dark countdown                        | Focus must remain visible against its surroundings                   |
| Metadata substitution assumed single-line tags                                  | Build-time helper replaces full meta tags regardless of line wrapping, with multiline/escaping regression | Central description must actually update the HTML shared by crawlers |
| Calendar required an unprovided street address                                  | Named confirmed venue is sufficient; no trailing comma, fabricated end time or duration                   | Preserve true event details without blocking a valid export          |
| V1 placeholder/date-free presentation                                           | Real Luci event and distinct coastal compositions, no false Maps/WhatsApp actions                         | Product truth and reusable config take priority over decoration      |

## Design and motion

Riviera tokens are exact. Deep teal on ivory 8.57, white 9.26, water 7.35, sage 4.88, champagne 5.54. Dusty coral only decorates ring art because normal text contrast would be 3.38. Countdowns use ivory and champagne on teal. Focus pairs are checked too. Rendered images, optical quality, zoom and actual overlay contrast are still manual checks.

GSAP, @gsap/react, ScrollTrigger and SplitText are actual new dependencies, not claimed pre-existing infrastructure. Intro is a nonblocking approximately 2-second staggered timeline. Character masks, localized section reveals and 220ms changed-number transitions use scoped useGSAP contexts. MatchMedia/config flags suppress animation; splits and contexts revert under StrictMode. No continuous loop or scroll hijack exists. Automatic tests are not a frame-rate or visual-feel measurement.

## Assets, delivery and limitations

- Clean root output: `/private/tmp/luci-riviera-v2-build-001`; clean subpath fixture: `/private/tmp/luci-riviera-v2-subpath-001`.
- Root output copied non-destructively into `dist` so preview serves current V2. Prior unreferenced hashed artifacts may remain because sandbox denies directory deletion; use the clean isolated output or a clean ordinary build outside this sandbox when deploying.
- PNG social image is real 1200×630 and was visually opened as a standalone asset. Outfit lettering is converted to paths from the shipped licensed font; artwork is original geometry, no fictitious person. This asset inspection is NOT a screenshot of the website.
- Root build intentionally has no public URL and remains noindex; the subpath uses an example.org fixture for verification only, not a deployed address.
- JS production chunk is approximately 534KB / 176KB gzip due to React, GSAP/ScrollTrigger/SplitText and Temporal. Vite emits its >500KB advisory, not an error. No chunk warning limit was raised to conceal it. Fonts are local; no external fonts or map requests occur by default.
- Preview launched on `http://127.0.0.1:4173/` for HTTP smoke. Local serving is not publication.
- Browser automation startup still fails in the host environment. No website screenshot, seven-width overflow proof, Safari behavior, touch feel or console-clean browser claim is fabricated. Follow `../MANUAL.md` before production acceptance.
- ICS end time remains optional and same-civil-day only. For an overnight event omit unknown end time rather than exporting a wrong day.
