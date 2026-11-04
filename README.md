# Calculus Solver

A free, browser-based calculus solver with step-by-step solutions, built with Next.js (App Router), TypeScript and Tailwind CSS.

- **Operations:** derivatives (orders 1–10), indefinite and definite integrals (including improper ones), limits (two-sided, one-sided and at ±∞), Taylor/Maclaurin polynomials (order up to 10), critical points with classification, partial derivatives (up to second order, including mixed partials) and implicit differentiation (dy/dx, with slope and tangent line at a point).
- **Private by design:** all math runs in the visitor's browser, in a Web Worker. There are no accounts, analytics or third-party requests.
- **Reviews and a solve counter (optional):** a small Neon Postgres database stores visitor reviews (shown only after approval) and an anonymous count of problems solved. Without a database the site works exactly as before; these features simply stay hidden.
- **Honest output:** every answer is checked independently before it is shown, and the solver says when it cannot solve a problem.
- **Static:** every page is prerendered as static HTML.
- **Light and dark themes:** follows the device setting by default; the header button switches and remembers the choice (`lib/theme.ts`). Colours are tokens in `app/globals.css`, with dark values under `:root[data-theme="dark"]`.

Canonical domain: `https://calculussolver.pro` (configured in `lib/site-config.ts`).

## Requirements

- Node.js 20.9 or newer (developed on Node 26)
- npm

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

## Scripts

| Command             | What it does                                       |
| ------------------- | -------------------------------------------------- |
| `npm run dev`       | Development server                                 |
| `npm run build`     | Production build (all pages prerendered)           |
| `npm start`         | Serve the production build                         |
| `npm test`          | Unit tests (Vitest): math engine and site content  |
| `npm run typecheck` | TypeScript, no emit                                |
| `npm run lint`      | ESLint                                             |
| `npm run check`     | All of the above, in order                         |

## Reviews and the solve counter

**Setup (once):** in Vercel, open the project → **Storage** → **Create Database** → **Neon** → connect it to this project. Vercel adds `DATABASE_URL` automatically. Then **redeploy** (environment variables apply to new deployments). Tables are created automatically on first use; `db/schema.sql` documents them.

**Moderating reviews:** open the Neon console → SQL Editor:

```sql
SELECT id, name, rating, message, created_at FROM reviews WHERE status = 'pending' ORDER BY created_at;
UPDATE reviews SET status = 'approved' WHERE id = 123;
UPDATE reviews SET status = 'rejected' WHERE id = 124;
```

Approved reviews appear on the homepage and `/reviews` within 5 minutes. `/reviews` is `noindex` and out of the sitemap until at least one review is approved; review structured data is added only from approved reviews.

**Spam protection:** honeypot field, minimum fill time, same-origin check, per-visitor rate limits (2/hour, 5/day, by a daily-rotating IP hash), duplicate text and repeat-email rejection, and no links allowed.

**Solve counter:** each successful solve sends an empty request to `/api/stats/solve` (max 300 counted per visitor per day). The homepage card stays hidden until the count reaches `siteConfig.stats.showSolveCountFrom` (default 1000).

## Deployment

The site needs no environment variables or secrets.

- **Vercel / Netlify / any Node host:** connect the repository. The build command is `npm run build`; on a plain Node host, start with `npm start`.
- **Before launch**, update `lib/site-config.ts` (see the launch checklist below).
- Serve over HTTPS. The privacy policy states that pages should not be altered in transit.

## Project structure

```
app/                     Routes, root layout, sitemap.ts, robots.ts, opengraph-image.png, icon.svg, not-found.tsx
  <calculator>/page.tsx  One small file per calculator page (content lives in data/)
  guides/                Guide index and the two guides
  blog/                  Blog index and posts (content in data/blog.ts)
components/
  solver/                Solver UI (client): form, keypad, KaTeX view, result panel, useSolver (Web Worker hook)
  content/               Server components: Tex (build-time KaTeX), FAQ, breadcrumbs, JSON-LD, page templates
  cookies/               Consent banner, settings dialog, footer button
  layout/                Header, navigation, footer
lib/
  math/                  The math engine (no UI code), described below
  site-config.ts         Name, domain, contact email, navigation, optional services
  seo.ts                 Metadata and structured-data helpers
  consent.ts             Consent storage (one localStorage key)
  routes.ts              List of indexable routes (used by the sitemap)
data/                    Page content: calculators, guides, homepage, FAQ
types/                   Shared TypeScript types
public/images/           Page illustrations (WebP, lazy-loaded via components/content/Figure.tsx)
tests/                   Vitest suites
```

### The math engine (`lib/math`)

| File               | Responsibility                                                                    |
| ------------------ | --------------------------------------------------------------------------------- |
| `parser.ts`        | Text → expression tree, with helpful error messages                               |
| `ast.ts`           | Expression tree types and helpers                                                 |
| `rational.ts`      | Exact fraction arithmetic                                                         |
| `simplify.ts`      | Canonical simplification, expansion, exact special values                         |
| `print.ts`         | LaTeX, plain-text and Algebrite printers                                          |
| `evaluate.ts`      | Real-valued numeric evaluation                                                    |
| `derivative.ts`    | Rule-based differentiation that records steps                                     |
| `integral.ts`      | Rule-based integration with steps, Algebrite fallback, verification               |
| `limit.ts`         | Limits: substitution, factoring, L'Hôpital, degree rule, numeric cross-check      |
| `taylor.ts`        | Taylor polynomials                                                                |
| `critical.ts`      | Critical points and classification                                                |
| `polynomial.ts`    | Polynomial arithmetic, GCD and rational roots                                     |
| `numeric.ts`       | Tanh-sinh quadrature, root finding, constant recognition                          |
| `solve.ts`         | Entry point: request → result with steps, notes and check status                  |
| `solver.worker.ts` | Runs `solve` off the main thread                                                  |

Algebrite (MIT) is loaded only inside the worker, as an integration fallback. KaTeX renders math at build time on content pages and is lazy-loaded in the solver.

## Editing content

- **Calculator pages:** `data/calculators.ts`. Every worked example has a `check` block; `tests/content.test.ts` runs each one through the solver and fails if the published answer does not match. Keep it that way when you add examples.
- **Guides:** `data/guides.ts` (each slug also needs an `app/guides/<slug>/page.tsx`, and an entry in `guideNav` in `lib/site-config.ts`).
- **Homepage and FAQ:** `data/home.ts` and `data/faq.ts`.
- **New pages** must be added to `lib/routes.ts` so they appear in the sitemap.

## Adding analytics later (optional)

Nothing optional is loaded today. If the owner adds a service:

1. Set `siteConfig.services.analytics` (name and privacy URL) in `lib/site-config.ts`. The cookie settings dialog then names it.
2. Load the script only when `useConsent().consent?.analytics === true` (see `components/cookies/CookieConsent.tsx`).
3. Update the Privacy Policy and Cookie Policy to describe the service.

## Keyword map and information architecture

Search volumes were **not** researched: no keyword data source was available, so none are claimed. The map below is based on search intent.

| Page                              | Primary target                    | Secondary / long-tail intent                                                          |
| --------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------- |
| `/`                               | calculus solver                   | calculus calculator, step by step calculus solver, calculus problem solver            |
| `/derivative-calculator`          | derivative calculator             | derivative calculator with steps, second derivative calculator, differentiate online  |
| `/integral-calculator`            | integral calculator               | integral solver, definite integral calculator, antiderivative calculator, improper integral |
| `/limit-calculator`               | limit calculator                  | limit calculator with steps, one-sided limit, limit at infinity, L'Hôpital calculator |
| `/taylor-series-calculator`       | taylor series calculator          | maclaurin series calculator, taylor polynomial calculator                             |
| `/critical-points-calculator`     | critical points calculator        | local max and min calculator, find critical numbers                                   |
| `/second-derivative-calculator`   | second derivative calculator      | concavity, inflection points, f''(x) calculator                                       |
| `/partial-derivative-calculator`  | partial derivative calculator     | fx fy calculator, mixed partial derivative, ∂f/∂x                                     |
| `/chain-rule-calculator`          | chain rule calculator             | derivative of composite functions, chain rule with steps                             |
| `/implicit-differentiation-calculator` | implicit differentiation calculator | dy/dx of an equation, slope and tangent line at a point                       |
| `/guides/derivative-rules`        | derivative rules                  | product rule, quotient rule, chain rule examples (informational)                      |
| `/guides/integration-techniques`  | integration techniques            | u-substitution, integration by parts, partial fractions (informational)               |
| `/how-it-works`, `/faq`, `/about` | trust and E-E-A-T                 | methodology, accuracy, privacy                                                        |

**Cannibalisation safeguards:** the homepage targets the general "calculus solver" intent (all operations); each calculator page targets one operation with distinct content (rules, worked examples, mistakes and FAQs written for that operation); guides target learning intent rather than tool intent. Titles, H1s and descriptions are unique (verified by the QA script below), and anchor text varies.

## Launch checklist (owner action required)

- [ ] **Contact email:** set `siteConfig.contactEmail` in `lib/site-config.ts`. Until then the Contact page shows "not published yet", and the legal pages point to the Contact page.
- [ ] **Domain:** confirm `siteConfig.url` is the final canonical origin (`https://calculussolver.pro`).
- [ ] **Hosting:** the Privacy Policy mentions the host's server logs in general terms. Consider naming your hosting provider and its log retention period.
- [ ] **Legal review:** the Terms, Privacy Policy and Cookie Policy were written to match the implementation, but they are not legal advice. Have them reviewed for your jurisdiction. In particular, the Terms do not name a governing law or venue, because no business details were provided.
- [ ] **Ownership details:** the About page describes an independent project without naming a person or company. Add genuine ownership details if you want them shown; do not invent credentials.
- [ ] Update `legalUpdated` and `contentUpdated` dates in `lib/site-config.ts` whenever those pages change.
- [ ] Submit `https://calculussolver.pro/sitemap.xml` in Google Search Console and validate the structured data with the Rich Results Test after deploying.

## Testing and results (2026-10-30)

| Check | Result |
| ----- | ------ |
| `npm test` | **188 / 188 passed** (incl. 19 review/counter tests running the real SQL on PGlite): 100 known-answer math tests (derivatives, integrals, improper integrals, limits incl. ±∞ and one-sided, Taylor, critical points, invalid input), 63 published worked examples (calculator pages, guides, blog, homepage) reproduced by the solver, 6 consent-storage tests |
| `npm run typecheck` | Passed |
| `npm run lint` | Passed (0 problems) |
| `npm run build` | Passed; 23 routes, all static |
| Browser QA (Chrome 1280 px and 375 px, production build) | 50 / 50 checks passed: all six operations, malformed input, honest "non-elementary" message, examples, copy answer/LaTeX, reset, solving offline after load (including the Algebrite fallback), consent banner (accept/reject/persist/settings/withdraw), desktop dropdown, mobile menu, keypad, unique titles/descriptions, canonicals, valid JSON-LD, one H1 per page, no horizontal overflow at 375 px, 404 status with noindex, zero third-party requests, zero console errors |
| Link crawl | 17 pages crawled from the homepage; 0 broken links; sitemap (17 URLs) matches the crawl exactly, so there are no orphan pages |

**Lighthouse 12.8** (local production build, Chrome headless, default throttling):

| Page | Mobile perf | Desktop perf | Accessibility | Best practices | SEO | CLS |
| ---- | ----------- | ------------ | ------------- | -------------- | --- | --- |
| `/` | 85 | 100 | 100 | 100 | 100 | 0 |
| `/derivative-calculator` | 91 | 100 | 100 | 100 | 100 | 0 |
| `/integral-calculator` | 84 | 100 | 100 | 100 | 100 | 0 |
| `/limit-calculator` | 91 | 100 | 100 | 100 | 100 | 0 |
| `/taylor-series-calculator` | 90 | 100 | 100 | 100 | 100 | 0 |
| `/critical-points-calculator` | 90 | 100 | 100 | 100 | 100 | 0 |
| `/guides/integration-techniques` | 91 | 100 | 100 | 100 | 100 | 0 |
| `/how-it-works` | 92 | 100 | 100 | 100 | 100 | 0 |
| `/privacy-policy` | 97 | 100 | 100 | 100 | 100 | 0 |

Mobile scores varied by about ±5 between runs, mostly in Total Blocking Time; simulated mobile LCP is around 3.0 s. Scores on a real host with a CDN will differ. Re-measure after deployment.

### Known limitations

- Not supported: differential equations, multiple integrals, vector calculus, second derivatives of implicit equations, piecewise functions, complex numbers, series convergence tests.
- Trig substitution and some partial-fraction cases are solved by the Algebrite fallback, without detailed steps.
- Some limits fall back to a clearly labelled numerical estimate.
- Critical points are only searched within the chosen interval.
#   c a l c u l u s s o l v e r  
 