# Validation report — 2026-10-26

## Status

**PARTIAL**: implementation and automated checks complete; visual/device acceptance and real event configuration pending. No deployment occurred. No Playwright was installed, executed or used.

## Executed evidence

| Check | Result | Evidence |
| --- | --- | --- |
| Vitest / React Testing Library | 30 passed, 2 files | `tests.log` |
| TypeScript strict build | PASS, no diagnostics | `typecheck.log` |
| ESLint | PASS, 0 errors/warnings | `lint.log` |
| Production Vite build | PASS, clean isolated output | `build.log` |
| Subdirectory + absolute social URL build | PASS (`/invitation/` fixture) | `build-subpath.log` |
| Configured/HTML static assets | PASS, checker ran on both outputs | build logs |
| Dependency audit | 0 vulnerabilities | `audit.json` |
| axe-core jsdom | No markup violations in demo; contrast explicitly excluded | test suite |
| Browser visual / seven-width matrix | NOT EXECUTED | environment constraints below |
| iOS Safari / Android Chrome hardware | NOT EXECUTED | `MANUAL.md` |
| WhatsApp actual delivery, calendar client import, real audio | NOT EXECUTED | needs supplied data/files and device |

Covered logic: IANA civil time independent of local zone, invalid/missing date/zone/time, DST gap/fold rejection, countdown and completed state, ICS UTC/CRLF/escaping/UTF-8 folding/completeness, Maps encoding/unsafe override, WhatsApp official URL/encoding/decline, RSVP validation and limits. Covered components: opening by keyboard and focus, missing data gates, reduced motion, flag-disabled opening, gallery empty/open/arrows/Escape/focus return/error/swipe, opt-in audio/pause/error, RSVP validation/launch and honest not-sent status.

## TDD disclosure

Tests were authored before event utilities, but the first RED execution was blocked by npm installation/sandbox failures (`initial-red-environment.log`). Logic implementation continued while dependencies were repaired; do NOT interpret the initial suite as a complete demonstrated RED→GREEN history. A later real regression test reproduced disabled-animation navigation still using smooth scroll; `red-motion.log` records the failure, and the final suite records GREEN after correction. Independent review then identified configured dress code without colors showing an undefined-state note, and audio error feedback hidden on mobile; both were reproduced RED in `red-configured-branches.log`, corrected and verified GREEN.

## Refinement

| Before | After | Why |
| --- | --- | --- |
| Disabled animation configuration still requested smooth opening navigation | Immediate scroll when animations are disabled; root CSS also disables smooth anchor scrolling | Config must control both animation and navigation |
| Particle flag only supplied an attribute | Explicit style hides stars for disabled particles | A configuration field must affect the actual surface |
| Invalid/incomplete event could be exported by a decorative button | Validated ICS gate with explicit missing-data explanation | Do not export invented or incomplete events |
| Configured dress code without optional colors showed undefined note | Neutral note when a code exists | Optional palette is not the dress-code identity |
| Mobile audio hid loading/error text | Persistent mobile feedback chip and accessible retry label | Errors must remain actionable on small screens |
| Generic empty photo grid | Original editorial geometric composition labelled demonstration | Preserve visual quality without fictitious personal photos |

Skills read and applied: `emil-design-eng` (feedback, spacing, transitions), `animate` and its recipes (CSS compositor motion, reduced-motion and one-time opening), `mobile-native` (safe areas, svh/dvh, touch/hover capability, input sizes), `impeccable` (product/design context, craft-floor, polish, mechanical detector). Impeccable context and detector ran; detector returned `[]`. Its complete interactive concept/comp/finish-review ceremony was not completed, so there is no claimed independent visual approval.

## Environment and build provenance

The empty project had no Git repository; no commit or Git state changes were made. Initial npm installation partially failed because process spawn/removal returned EPERM. Dependencies were installed in task-owned temporary tooling with scripts disabled, copied non-destructively to this workspace, and audited. `.npmrc` selects `/bin/sh` and commands used `OPENSSL_CONF=/dev/null`.

Vite's first build succeeded. The environment then denied deleting `dist/assets` on rebuild, even after an explicit escalated attempt. Final and subpath builds were produced into new isolated `/private/tmp` output directories and validated with `BUILD_OUT_DIR` selecting that exact output. Validated final files were copied into `dist` without deleting prior build hashes. Consequently **use the clean isolated output or perform a normal clean build outside this sandbox for deployment**; `dist` may contain unused earlier hashed assets, not missing current ones. No permission repair was attempted.

Native computer-use startup failed loading the sandbox's OpenSSL configuration. Explicit Chrome headless attempts exited before exposing a debugging endpoint. No rendered screenshots or layout claims were fabricated. The manual matrix remains required, including actual contrast, overflow, console, keyboard trap behavior, safe areas and audio feel.

## Product limits

Data, photographs, licensed audio and public URL are deliberately absent. Calendar and RSVP disable until valid configuration; no real date/countdown or location is fabricated. End time supports the same civil day only; omit it for overnight events. Client-side phone number is publicly visible by design; there is no response database. Temporal correctness costs bundle weight: approximately 125KB gzipped JS including React/Temporal; fonts are locally hosted. No full WCAG conformance or production visual acceptance is claimed from jsdom.
