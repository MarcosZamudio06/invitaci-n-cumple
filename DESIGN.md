# Riviera Pool Party — Coastal Chic

## Direction

A contemporary pool-club invitation, not a wedding stationery system. Outfit ExtraBold gives LUCI and the swimsuit reminder youthful confidence. Broad ivory grounds, pale water, sage and one dark-teal countdown create distinct editorial beats; the original pool-ring and water graphics do the storytelling without fictitious photographs.

## Confirmed tokens

| Token              | Value   | Use                                              |
| ------------------ | ------- | ------------------------------------------------ |
| ivory / background | #F8F6F0 | Hero, venue, gallery ground                      |
| surface            | #FFFFFF | RSVP                                             |
| water              | #D6E9E7 | Date, footer, pool water                         |
| sage               | #A9C2B5 | Swimsuit reminder, wave geometry                 |
| deep-teal / text   | #244D55 | All normal text, buttons, countdown ground       |
| champagne          | #D9C6A5 | Pool ring, artwork ground, countdown accents     |
| dusty-coral        | #C98E81 | Decorative floats only, never normal-text ground |

Outfit 800 headings; Outfit 600 numeric/time details; DM Sans 400/500/600 information. Self-hosted Fontsource Latin assets; no external font request. Body 13–16px, form inputs 16px. 24px mobile gutters, fluid 6vw desktop. Space follows 8/16/24/32/48/64/96px rhythms. Buttons 54px high, 44px secondary targets. Dedicated deep-teal focus rings on light surfaces, inverted on the dark countdown. Shape language: confident type, wide water paths, a ring, and generous section-scale color fields; no equal-card scaffold.

## Narrative and composition

1. Ivory hero: LUCI at massive scale, asymmetrical water sweep, a quietly rotated ring and party stamp. Content is immediately navigable.
2. Dark-teal countdown immediately below, four tabular number columns and champagne separators. Only changed number blocks animate.
3. Pale-water date: oversized 13, compact weekday/month/year/time counterweight and calendar action.
4. Ivory venue: Jardín D-GALICIA dominates, location linework stays decorative; no guessed map.
5. Sage swimsuit reminder: stacked bold text with a coral ring, independent controlled reveal.
6. Gallery or original geometric pool illustration on champagne. This is artwork, not placeholder personal photography.
7. Optional music note only when configured; white RSVP; pale-water emphatic closing.

## Motion contract

GSAP useGSAP scoped context owns all timelines. Hero is about 2 seconds: water entrance, SplitText character masks (stagger .09), welcome/meta and ring. Skip completes the timeline immediately; no intro overlay or scroll lock. ScrollTrigger reveals date, reminder and RSVP once with distinct timing, no pin/scrub or hijack. Countdown transitions only changed values at 220ms. MatchMedia respects reduced motion; disabling configuration creates no timelines. Split DOM and media contexts revert on update/unmount/StrictMode. No continuous animation runs, so there is no background loop to pause. End-of-countdown decorative drops run once and never under reduced motion.

## Contrast and responsive evidence

Authored normal-text pairs: ivory 8.57:1, white 9.26:1, water 7.35:1, sage 4.88:1, champagne 5.54:1 against deep teal. Deep teal/coral is only 3.38:1, so coral remains illustrative. See docs/validation/v2/contrast.json. These are exact token calculations, not rendered-image or full WCAG certification.

320/375/390/430/768/1024/1440px are design targets with explicit mobile and intermediate compositions. Dynamic/small viewport units, safe-area controls, hover capability gating and enabled zoom are implemented. Physical-device and seven-size rendered inspection must still be completed; do not infer visual approval from build/tests.
