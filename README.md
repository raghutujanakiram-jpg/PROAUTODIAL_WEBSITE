# ProAutoDial Website

Frontend implementation for ProAutoDial Telephony Services (OPC) Private Limited.

## Stack
- Responsive static multi-page SPA (vanilla JavaScript + CSS)
- Vercel path rewrites for direct page access
- Original supplied ProAutoDial logo and supplied founder portrait
- Page navigation and page-specific UI interactions without a backend dependency

## Pages
- Home
- Solutions
- Voice Agents
- Industries and industry detail routes
- Use Cases with selectable workflow steps and campaign tabs
- Pricing with exactly three packages; INR default and a billing-location currency selector (AED, GBP, EUR, KWD, SGD, USD)
- Countries / Global Reach
- Blog / Insights
- Case Studies
- Testimonials and supplied client reference logos
- About Us / Founder
- Careers
- Contact
- Request Demo
- Live Call Simulator preview
- ProAutoDial Voice for Good
- Initial Arabic RTL overview for UAE / Middle East audiences at /ar

## Local Preview
Serve the repository root with any static server, or open `index.html` in a browser. Use a local server to test the path-based pages.

## Vercel
- Framework preset: Other
- Build command: leave blank
- Output directory: `.`
- Root directory: `.`
- `vercel.json` rewrites paths to `index.html` for SPA route handling.

## Current implementation boundaries
- Contact and demo forms validate in the browser only. They do not transmit or store personal data.
- Live call simulator is a scripted preview. No microphone access, actual call or recording is performed.
- Pricing uses custom quotes because final approved package rates have not yet been provided.
- Customer case summaries are workflow descriptions, not fabricated testimonials or performance claims.
- Social profile and review destinations remain to be connected after official URLs are confirmed.
- Arabic implementation currently covers an initial RTL overview. Full page-by-page UAE / Middle East Arabic localisation and native review are still required.

## Production readiness work
1. Connect enquiries to the approved backend / CRM, including consent, privacy and spam protection.
2. Integrate AI speech services, telephony, recordings, call transfer, campaigns and analytics.
3. Load verified production dashboard metrics and approved customer stories.
4. Confirm commercial prices, billing location rules and local tax presentation.
5. Connect official social profile and review URLs.
6. Complete Arabic localisation and native linguistic QA page by page.
7. Review legal, telecom, privacy, aviation and emergency-response statements before public release.
8. Treat disaster response, toll-free hotline and drone delivery operations as conditional on feasibility, partner availability, safety and local authorisation.

## Voice for Good operational statement
All free services are subject to eligibility verification, terms and conditions, technical feasibility, resource availability and applicable laws. Emergency hotline activation, mobile support vehicles, connectivity and field operations require coordination with relevant authorities. ProAutoDial is supplementary communication support and does not replace official emergency services or government disaster-response systems. Commercial drone operations require aviation permissions and qualified operators.
