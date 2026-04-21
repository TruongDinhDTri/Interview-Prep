# 🎯 Practice Questions & Answers: Frontend Performance Optimization

**Cách dùng file này:**
1. Đọc câu hỏi → đóng file → tự trả lời to trong 2 phút
2. Mở file, so sánh với Strong Answer
3. Tìm gap: thiếu số cụ thể? thiếu trade-off? quên mention metrics?

---

## Q1: "Your React app's JavaScript bundle is 2.4MB. Walk me through how you diagnose and fix this."

**Weak Answer:**
> "I would use code splitting to split the bundle into smaller chunks and use lazy loading."

**Strong Answer:**

*Step 1 — Diagnose before fixing:*
> "First, I'd run `webpack-bundle-analyzer` or Vite's built-in `--report` flag to get a visual treemap of what's inside the bundle. Without diagnosis, you're guessing. The most common culprits are: one large library imported entirely when only a part is needed (classic example: `import _ from 'lodash'` brings in 71KB but you only use `debounce`), or pages loading code for routes the user hasn't visited yet."

*Step 2 — Address the root causes:*
> "If I see lodash taking 71KB, I'd replace with `import { debounce } from 'lodash-es'` — ES module version, so tree shaking removes the other 300+ functions. That might drop it to 2-3KB for just what we use. If I see the Admin panel (300KB) and Dashboard charts (400KB) in the initial bundle, those should be route-based code split — `React.lazy(() => import('./AdminPanel'))` — so they only download when the user navigates there."

*Step 3 — Measure the improvement:*
> "I'd re-run the analyzer and benchmark with Lighthouse — specifically tracking TTI (Time to Interactive) and FCP. A 2.4MB bundle taking 8+ seconds on 3G is unacceptable; after code splitting and tree shaking, the initial bundle should be under 300KB — fast FCP on any connection."

*Connect to architecture:*
> "One more lever: vendor chunk splitting. Separate `react`, `react-dom`, and other stable dependencies into a `vendors` chunk. Those don't change between deploys, so browsers cache them across releases. The app code chunk gets a new hash and redownloads; vendors chunk stays cached."

---

## Q2: "We're building a product page for an e-commerce site. Should we use SSR, SSG, or CSR? Why?"

**Weak Answer:**
> "I would use SSR because it's better for SEO and faster."

**Strong Answer:**

*Ask the right clarifying question first (actually say this):*
> "Before I answer, let me clarify: is the product page content the same for every user, or does it show personalized data like 'you recently viewed' or dynamic pricing?"

*If content is mostly the same (90% of product pages):*
> "I'd use SSG with ISR — Static Site Generation with Incremental Static Regeneration. Here's why: the product title, images, description, and base price are identical for every visitor. There's no reason to render this fresh on every server request. With SSG, we pre-build the HTML at deploy time, push it to a CDN, and users get sub-100ms responses from edge nodes globally. For a company with 100,000 products, that's 100,000 pre-built HTML files — each served by CDN with no origin server needed.
>
> The freshness concern is solved by ISR: I'd set `revalidate: 300` — the page auto-rebuilds in the background every 5 minutes. Product info rarely changes faster than that, and when it does (flash sale price), we can trigger on-demand revalidation."

*If content is personalized (user-specific recommendations, pricing, stock):*
> "I'd use SSR via Next.js `getServerSideProps` for the personalized sections, with aggressive CDN caching of the non-personalized parts using `stale-while-revalidate` headers. Or better: hybrid approach — SSG the static skeleton of the page, then client-side fetch the personalized sections. That way the fast SSG shell renders immediately (LCP fires early), and personalized content fills in within 200-300ms."

*What NOT to use:*
> "CSR is a non-starter for product pages — Google's crawler sees an empty `<div id='root'></div>`, can't index the page, and we lose all organic traffic. The 1-2 second blank screen while React boots is also bad for conversion on first visit."

---

## Q3: "What's the difference between `rel='preload'` and `rel='prefetch'`? Give me a concrete example of when you'd use each."

**Weak Answer:**
> "Preload is for loading important things first, prefetch is for loading things you might need later."

**Strong Answer:**

*Precise definition with timing:*
> "Preload tells the browser: 'Start fetching this resource immediately, with high priority — I need it for the current page.' Prefetch says: 'Fetch this when you have idle time — I might need it for a future navigation.'
>
> The critical distinction is *priority and timing*. Preload competes with other high-priority resources (HTML, critical CSS, render-blocking scripts) in the current page's critical path. Prefetch happens in the background during browser idle time and doesn't compete with anything."

*Concrete preload example:*
> "I'd use preload for the LCP image — the hero photo on a product page. Without preload, the browser discovers the image tag only after parsing HTML and CSS. With `<link rel='preload' href='hero.jpg' as='image'>` in the `<head>`, the browser starts fetching the image in parallel with HTML parsing. This can improve LCP from 3.2s to 1.8s — a 44% improvement for the most important performance metric."

*Concrete prefetch example:*
> "I'd use prefetch for the next page's JavaScript chunk. If a user is on the product list page `/products`, they'll likely click a product next. I'd add a prefetch hint for `product-detail.chunk.js` — or better, trigger it programmatically with `import()` on link hover. By the time they click, the chunk is already in cache. Navigation feels instant."

*The risk:*
> "Overusing preload is dangerous. Every preloaded resource competes for bandwidth with your LCP image. I've seen sites preload 10 things 'just to be safe' and actually make their LCP worse because the hero image is now competing with 10 other high-priority fetches. Preload should be reserved for 3-5 truly critical resources per page."

---

## Q4: "Walk me through how you would diagnose and improve a page with an LCP of 4.5 seconds."

**Weak Answer:**
> "I would optimize images and use a CDN to make the page faster."

**Strong Answer:**

*First, identify what the LCP element is:*
> "LCP measures the time until the largest visible element renders. First, I'd open Chrome DevTools → Performance tab → run a profile to identify which element is the LCP element. It's usually a hero image, a large text heading, or a video thumbnail. Knowing the element tells me where to focus."

*Common root causes and fixes:*

> "**If LCP is a large unoptimized image:** The fix is multi-layered. First, serve modern formats — WebP or AVIF instead of JPEG/PNG. A 500KB JPEG hero image is typically 200KB as WebP (60% smaller). Second, add `<link rel='preload'>` for the LCP image so the browser starts fetching it before CSS is fully parsed. Third, ensure the image has `fetchpriority='high'` attribute. Together, these routinely halve LCP."
>
> "**If LCP is slow because of render-blocking CSS:** The browser won't render anything until all CSS files in `<head>` are downloaded and parsed. Solution: inline critical above-the-fold CSS directly in the HTML, and load non-critical CSS asynchronously. Critical CSS is only 3-5KB for the visible area; everything else can load after."
>
> "**If LCP is a server-side issue (slow TTFB):** If the server itself takes 2+ seconds to respond, no amount of client optimization helps. Fix is on the backend: CDN caching for static pages, server-side caching (Redis) for dynamic data, database query optimization."

*Measurement loop:*
> "I'd iterate with Lighthouse in a controlled environment — same device, same network conditions — so I can see if changes actually improve the number. A change that improves LCP by 0.5s on my MacBook might make zero difference for real users on mid-range Android. That's why I'd also set up Real User Monitoring with `web-vitals.js` to track P75 LCP across real user sessions."

---

## Q5: "We want to add a third-party analytics library to every page. What performance concerns do you have?"

**Weak Answer:**
> "Third-party scripts can slow down the page, so we should be careful about when we load them."

**Strong Answer:**

*Lead with the specific risks:*
> "Third-party scripts are one of the most common LCP and TTI killers because you don't control their performance. My first concern is **render blocking**: if the analytics script is in `<head>` without `async` or `defer`, it blocks HTML parsing entirely until the script downloads, parses, and executes. On a slow connection, this can add 500ms+ to FCP. I'd always use `<script async>` or `<script defer>` for analytics."

*Second concern — main thread blocking:*
> "Analytics libraries often do significant work on the main thread: DOM queries, event listener setup, sending beacons. This increases the **Total Blocking Time** metric, which tanks TTI. The mitigation: load analytics **after** the page is interactive. I'd add the script dynamically after the `load` event or after the user first interacts, not in the initial HTML payload."

*Third concern — third-party latency:*
> "The analytics vendor's servers might be slow or geographically far from your users. I'd add `<link rel='dns-prefetch' href='https://analytics.vendor.com'>` to at least pre-warm the DNS connection. For performance-critical pages, consider loading the analytics asynchronously and accepting that some page views might be missed on very fast bounces."

*Ask about necessity:*
> "I'd also ask: do we need the full analytics library, or can we use a lighter-weight solution? Google Analytics 4 with `gtag.js` is 45KB; `plausible.io` is 1KB. If full-featured analytics isn't required, the lightweight alternative is a significant win."

*Production approach:*
> "My final recommendation: load analytics in `requestIdleCallback` — this schedules execution during browser idle time, ensuring it never competes with user-visible rendering. The user sees a fast, interactive page; analytics runs quietly in the background."

---

## Q6: "What is tree shaking and why might it fail to remove unused code?"

**Weak Answer:**
> "Tree shaking removes unused code from the final bundle to make it smaller."

**Strong Answer:**

*Definition with the core mechanism:*
> "Tree shaking is dead code elimination at build time. The bundler — Webpack, Rollup, or Vite — statically analyzes import/export relationships before running any code. It builds a graph of what's actually used and excludes everything else. A utility library with 300 functions? Only the 2 you import end up in the bundle."

*Why it requires ES Modules — and why CommonJS breaks it:*
> "Tree shaking only works with ES Modules (`import`/`export`). The reason is fundamental: ES module imports are *static* — analyzed at parse time, before execution. CommonJS `require()` is *dynamic* — it can be called conditionally, in loops, with computed paths. A bundler can't know what CommonJS will require without running the code. So when you write `require('lodash')`, the bundler has no choice but to include everything."

*When tree shaking fails — concrete scenarios:*

> "**Failure 1 — Library ships CommonJS:** Even if your code uses `import`, if the library itself only ships CommonJS, tree shaking is blocked. `import _ from 'lodash'` → lodash is CommonJS → entire 71KB included. Fix: use `lodash-es` which ships ES modules."
>
> "**Failure 2 — Side effects:** If a module has side effects — code that runs when imported regardless of what you use, like modifying prototypes or initializing globals — the bundler keeps it. The `sideEffects: false` field in `package.json` tells the bundler the module is safe to tree shake."
>
> "**Failure 3 — Dynamic imports that look static:** If the import path is computed or conditional, the bundler can't analyze it statically and must include everything."

*Interview punchline:*
> "The practical takeaway: always check if a dependency ships ES modules. Before adding a new library, I'll look at its `package.json` for a `module` field (ES module entry) or check if there's an `-es` variant. Libraries like `date-fns`, `nanoid`, and `rxjs` are designed to be fully tree-shakeable; older libraries like `moment` (230KB, not tree-shakeable) are being replaced specifically for this reason."

---

## Key Phrases to Remember

| Situation | What to say |
|-----------|-------------|
| Starting performance answer | "Before optimizing, I'd run Lighthouse to identify the actual bottleneck..." |
| Mentioning any metric | Always include the number: "LCP target is < 2.5s", "CLS < 0.1" |
| Code splitting | "Route-based splitting drops initial bundle from Xmb to Ymb — only the code for that route loads" |
| Choosing rendering | "It depends on SEO requirement and content freshness..." |
| Tree shaking | "Requires ES Modules — CommonJS requires can't be statically analyzed" |
| Third-party scripts | "Load with `async`/`defer` or in `requestIdleCallback` — never blocking in `<head>`" |
| Preload vs prefetch | "Preload = high priority, current page. Prefetch = idle time, future page." |
| After any optimization | "Measure with Lighthouse before and after — optimize for data, not assumptions" |

---

## Practice Strategy

**Numbers to know by heart:**
- LCP good: < 2.5s | CLS good: < 0.1 | TTI good: < 3.8s
- Brotli is 15-25% better than Gzip
- Minification: typically 30-40% reduction | + Gzip: 70-80% total
- `import _ from 'lodash'`: 71KB | `import { debounce } from 'lodash-es'`: 2.3KB

**For each technique, practice saying:**
1. What problem does it solve?
2. How does it work (one sentence)?
3. What is the trade-off?
4. When would you NOT use it?

**Say the full Q1 answer out loud — all 4 steps — in under 90 seconds.**
That's the bar for a strong performance answer: structured, specific, shows depth, connects to metrics.
