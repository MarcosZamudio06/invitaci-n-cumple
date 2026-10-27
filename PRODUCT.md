# Luci — Birthday Pool Party

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React + TypeScript + Vite. GSAP, @gsap/react, ScrollTrigger and SplitText explicitly requested for V2. Outfit ExtraBold and DM Sans are self-hosted.

## Users

Birthday guests opening a WhatsApp invitation, primarily on mobile, who need the date, place, swimsuit reminder and confirmation action.

## Confirmed Product Truth

- Birthday of Luci, pool-party event, Friday 13 November 2026 at 17:00 America/Mexico_City.
- Venue: Jardín D-GALICIA.
- The V3 recipient is supplied and centralized in src/config/whatsapp.ts. No confirmed age, ending time, street address, exact Maps location, personal photographs or music. These remain blank, not invented.

## Capabilities and Constraints

Static deployment, no backend, no response storage, no paid-service requirement. WhatsApp lets the guest review/send a message and never claims a delivery. No Playwright installation or execution. Exact geographic location must be supplied before enabling navigation; a venue name alone is not sufficient.

## Brand Commitments

Riviera Pool Party — Coastal Chic. The first V2 direction is authoritative: ivory, water, sage, deep teal, champagne and dusty coral. Young, light and expressive, never wedding or nighttime luxury. Only the countdown uses a dark section.

## Accessibility & Inclusion

Keyboard navigation, native modal gallery, accessible media feedback, motion preference override, meaningful labels and authored normal-text contrast at least 4.5:1. Device and rendered acceptance remain separate from jsdom checks.

## V3 RSVP policy

Attendance uses a prepared positive/negative WhatsApp message, never a server-side registration. The number-of-people field is visible only for yes. No event capacity was supplied: maxCompanions is optional/unset, not zero by default. An explicitly configured cap is enforced as additional people plus the invitee. Guest values stay in React memory, with no persistence or analytics.
