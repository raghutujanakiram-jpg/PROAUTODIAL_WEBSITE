# ProAutoDial Public Website

Public website for ProAutoDial Telephony Services (OPC) Private Limited.

## Experience

- Responsive, multi-page public website built with vanilla JavaScript and CSS.
- Shared ProAutoDial visual system: red and white palette, premium navy typography, consistent page heroes, image-led sections, rounded content cards and responsive navigation.
- Original supplied ProAutoDial logo and founder portrait.
- Approved Home and Use Cases reference artwork.
- Accessible navigation controls, focus styles and reduced-motion support.

## Public pages and routes

- Home: `/`
- Solutions: `/solutions`
- AI Voice Agents: `/voice-agents`
- Industries index: `/industries`
- Industry detail pages: `/industries/real-estate`, `/industries/healthcare`, `/industries/dental-clinics`, `/industries/education`, `/industries/banking-finance`, `/industries/insurance`, `/industries/travel-hospitality`, `/industries/restaurants`, `/industries/retail-ecommerce`, `/industries/recruitment-hr`, `/industries/bpo-customer-support`
- Use Cases: `/use-cases`
- Pricing: `/pricing`
- Countries / Global Markets: `/countries`
- Insights: `/blog`
- Insight articles: `/blog/ai-voice-agent-readiness`, `/blog/human-handoff`, `/blog/industry-campaigns`
- Workflow Blueprints: `/case-studies`
- Client References: `/testimonials`
- About Us: `/about-us`
- Careers: `/careers`
- Contact: `/contact`
- Request Demo: `/request-demo`
- Live Call Simulator Preview: `/live-demo`
- ProAutoDial Voice for Good: `/voice-for-good`
- Arabic overview: `/ar`

## Vercel

- Framework preset: Other
- Build command: leave blank
- Output directory: `.`
- Root directory: `.`
- `vercel.json` rewrites direct page and nested industry / insight routes to `index.html` for SPA routing.

## WhatsApp contact and chatbot

- The floating WhatsApp button opens a click-to-chat conversation with the ProAutoDial contact number `+91 8898 724 365` (`918898724365` in the WhatsApp link).
- The button includes a prefilled first message about AI voice agents, the call-centre platform, use cases and demo options.
- This website shortcut does not itself create an automated bot or confirm that the number is registered on WhatsApp.
- Automated product-knowledge replies require a verified WhatsApp Business Platform number or approved WhatsApp provider, an inbound message webhook, secure credentials, and a private, approved ProAutoDial product-knowledge source.
- Do not place WhatsApp access tokens, Meta app secrets, OpenAI keys or private product documents in this public repository. Store service credentials in Vercel encrypted environment variables and keep the knowledge source in a private authorised repository/vector store.
- Until the channel and knowledge source pass end-to-end tests, messages must be handled by the ProAutoDial team rather than being represented as answered by an AI bot.

## Enquiry handling

- Contact and Demo Request forms validate in the browser and open a prefilled email draft addressed to `contact@proautodial.in`.
- The visitor must review and send the email in their own mail application.
- The website does not store form submissions or send them to a CRM. Connect an approved backend / CRM before describing these forms as direct online lead capture.
- Phone actions use the public ProAutoDial contact number shown in the site header and contact page.

## Product demonstrations and commercial scope

- Live Call Simulator is a scripted browser preview. It does not access a microphone, place an actual call or create a recording.
- Pricing contains three service packages with custom quotes. The currency selector changes the quote currency label by billing location; it does not perform automatic currency conversion.
- Customer stories and workflow blueprints are illustrative workflow examples, not fabricated customer testimonials or performance claims.
- Supplied client logos are reference assets. Publishing remains subject to each brand’s permissions and current relationship status.
- Careers lists capability areas where professional interest is welcome; it does not assert that listed vacancies are currently open.
- Country listings identify target markets. They do not imply local number availability, telecom licensing or activated operations.

## Voice for Good

All free services are subject to eligibility verification, terms and conditions, technical feasibility, resource availability and applicable laws. Emergency hotline activation, mobile support, connectivity and field operations require coordination with relevant authorities. ProAutoDial Voice for Good is supplementary communication support and does not replace official emergency services or government disaster-response systems. Commercial drone operations require aviation permissions and qualified operators.

## Release boundaries

- Public production site only: `www.proautodial.in`.
- The ProAutoDial Admin repository, Admin database and Admin Vercel project are separate and are not part of this public-site release.
- Legal, privacy, cookie and telecom compliance copy must be reviewed and approved by the accountable business/legal owners before being presented as formal policy.
- Full Arabic localisation beyond the overview page requires translation and native linguistic review.
