# TBD Labs Landing Demo

## Project Context
- **Goal:** Deliver a YC-ready landing page that mirrors the layout of Rebolt’s hero section while channeling the premium feel of Cartesia’s dark, cinematic aesthetic.
- **Theme:** Deep red gradient palette with luminous highlights, emphasizing a confident, investor-focused tone.
- **Primary Experience:** Showcase a pre-populated demo console where visitors can review the scripted prompt and context document, then trigger the experience with the send button.

## Implementation Notes
- Built with **Next.js (App Router, TypeScript)** inside the `web-demo` folder.
- Custom global styling defined in `src/app/globals.css` to establish the core color system and typography base.
- Hero content, interactive panel, and dashboard preview implemented in `src/app/page.tsx` with accompanying styles in `src/app/page.module.css`.
- Send button currently decorative; future work can wire it to actual demo execution once backend endpoints are available.

## Instruction Recap
- No top navigation—only the company name centered at the top, no logo yet.
- No primary call-to-action buttons beneath the title; emphasis stays on the guided demo.
- Must feature a stylized text area containing both a prompt and a context document, mirroring the provided inspiration.
- Prepare for future iterations: anticipate enhancements like user-provided uploads, media embeds, or live demo integrations.

## Next Opportunities
- Hook send button into the real demo flow and support user-uploaded context.
- Add responsive tweaks for animation/motion when the viewer presses send.
- Incorporate analytics instrumentation to observe demo interactions once the backend is wired.

