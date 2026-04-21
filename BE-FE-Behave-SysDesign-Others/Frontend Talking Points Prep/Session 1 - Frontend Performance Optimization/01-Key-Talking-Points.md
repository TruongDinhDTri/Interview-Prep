# 📝 Key Talking Points: Frontend Performance Optimization

**Goal:** Không chỉ biết tên kỹ thuật — mà giải thích được *tại sao*, *khi nào*, và *đánh đổi gì* khi dùng mỗi kỹ thuật. Đây là phần "client-side scalability" của system design — khi interviewer hỏi "How do you make this fast for the user?", đây là arsenal bro cần.

---

## Trước khi bắt đầu: Core Web Vitals — "Ngôn ngữ của Performance"

Trước khi nói đến kỹ thuật, bro cần hiểu **thước đo**. Interviewer giỏi sẽ không hỏi "How do you optimize performance?" — họ hỏi "How do you improve LCP?" Biết metrics = biết ngôn ngữ của người sẽ chấm bro.

### The Big 3 (Google's Core Web Vitals)

| Metric | Viết tắt | Đo cái gì | Good | Needs Work | Poor |
|--------|----------|-----------|------|------------|------|
| **Largest Contentful Paint** | LCP | Tốc độ load content chính | < 2.5s | 2.5–4s | > 4s |
| **First Input Delay** (→ INP) | FID/INP | Độ phản hồi khi user click | < 100ms | 100–300ms | > 300ms |
| **Cumulative Layout Shift** | CLS | Trang có bị "nhảy" không | < 0.1 | 0.1–0.25 | > 0.25 |

**Và 2 metrics bổ sung quan trọng:**

| Metric | Viết tắt | Đo cái gì |
|--------|----------|-----------|
| **First Contentful Paint** | FCP | Thời gian tới lần đầu thấy BẤT KỲ content nào |
| **Time to Interactive** | TTI | Thời gian tới khi page có thể respond user actions |

### Mental Model: Trải nghiệm người dùng theo thời gian
```
T=0ms        T=500ms      T=1.5s       T=2.5s       T=3.5s
  |            |            |            |            |
User types  FCP fires    LCP fires   TTI fires   User gives up
URL       (thấy gì đó) (content lớn) (click work) (bounce 40%)
                              ↑
                     THIS is what Google measures for SEO ranking
```

> "Every 100ms improvement in LCP increases conversion rate by ~1%." — Google research

### Tại sao CLS quan trọng?
```
User đang đọc: "Mua ngay với giá..."
→ Image loads → page shifts → user accidentally clicks "Cancel Order"
CLS score: 0.3 (Poor)
```
Đây là real UX nightmare. CLS bị ảnh hưởng bởi: images không có width/height, ads inject sau render, web fonts load late.

---

## Section 1: Code Splitting — "Đừng bắt user load cả menu khi họ chỉ muốn gọi 1 món"

### The Story: Bữa tối 10 món

Tưởng tượng bro vào nhà hàng và người phục vụ ra ngay với **tất cả 10 món cùng một lúc**. Không ai ăn hết 10 món cùng lúc — nhưng bro phải chờ bếp nấu xong hết trước khi ăn được món đầu tiên.

Đây chính xác là vấn đề của **monolithic bundle** — JavaScript build ra 1 file duy nhất, user phải download tất cả code của `/dashboard`, `/settings`, `/admin` dù họ chỉ vào trang `/login`.

### Bundle Size Reality Check

```
Typical React SPA bundle (NO splitting):
┌─────────────────────────────────────────────────┐
│  main.bundle.js                        2.4 MB   │
│  ├── React + ReactDOM                  130 KB   │
│  ├── React Router                       50 KB   │
│  ├── Home page                          80 KB   │
│  ├── Dashboard (heavy charts)          400 KB   │
│  ├── Admin panel                       300 KB   │
│  ├── Settings                          150 KB   │
│  ├── lodash                             70 KB   │
│  └── ... other dependencies          1.2 MB    │
└─────────────────────────────────────────────────┘
User visits Home page → must download ALL 2.4MB before seeing anything
```

### How Code Splitting Works

```javascript
// ❌ BEFORE: Static import — bundled together regardless of usage
import HeavyDashboard from './HeavyDashboard'      // 400KB
import AdminPanel from './AdminPanel'               // 300KB
import SettingsPage from './SettingsPage'           // 150KB

// ✅ AFTER: Dynamic import — separate chunk, loaded on demand
const HeavyDashboard = React.lazy(() => import('./HeavyDashboard'))
const AdminPanel = React.lazy(() => import('./AdminPanel'))
const SettingsPage = React.lazy(() => import('./SettingsPage'))

// React Router v6 with code splitting
import { Suspense, lazy } from 'react'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Admin = lazy(() => import('./pages/Admin'))

function App() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Suspense>
  )
}
```

### After Code Splitting — What Actually Gets Downloaded

```
Initial load (visiting Home):
  main.chunk.js           180 KB  ← React + Router + Home only
  vendors.chunk.js         80 KB  ← React, ReactDOM (separate cache)

User navigates to /dashboard:
  dashboard.chunk.js      400 KB  ← Downloaded ONLY when needed

User navigates to /admin:
  admin.chunk.js          300 KB  ← Downloaded ONLY when needed
```

Result: **Initial load drops from 2.4MB → 260KB** → FCP dramatically faster.

### 3 Levels of Code Splitting

**Level 1 — Route-based (Most Common)**
```javascript
// Split by page/route — every page is its own chunk
const LoginPage = lazy(() => import('./pages/Login'))
const DashboardPage = lazy(() => import('./pages/Dashboard'))
```

**Level 2 — Component-based (For Heavy Components)**
```javascript
// Heavy UI components that aren't needed on initial render
const RichTextEditor = lazy(() => import('./components/RichTextEditor'))  // 800KB Quill
const DataChart = lazy(() => import('./components/DataChart'))             // 200KB Chart.js
const PDFViewer = lazy(() => import('./components/PDFViewer'))             // 1.2MB PDF.js
```

**Level 3 — Vendor splitting (For Caching)**
```javascript
// webpack.config.js — split node_modules into separate chunks
optimization: {
  splitChunks: {
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',        // React, ReactDOM → vendors.chunk.js
        chunks: 'all'
        // Why? Vendors change rarely → browser caches them across deploys
        // Your app code changes every deploy → new hash → cache busted
        // But vendors.chunk.js keeps same hash → still from cache ✅
      }
    }
  }
}
```

### Trade-off: Waterfall Requests

Code splitting creates a new problem: **navigation waterfall**.
```
User clicks /dashboard
  → Browser sees component is lazy
  → Starts fetching dashboard.chunk.js
  → User sees loading spinner for 200-500ms
  → Chunk arrives, component renders
```
**Fix:** Prefetch the chunk before user navigates (covered in Section 6).

---

## Section 2: Lazy Loading — "Load khi mắt thấy, không phải khi trang load"

### The Story: Tờ báo với 200 ảnh

Hãy nghĩ về một tờ báo điện tử có 200 bài với ảnh minh họa. Nếu load tất cả 200 ảnh khi user mở trang → **200 × 500KB = 100MB** chỉ cho ảnh — chỉ để user đọc 5 bài đầu tiên.

Lazy loading = chỉ load ảnh khi user **sắp scroll tới** nó.

### Browser Native Lazy Loading (HTML)

```html
<!-- ❌ BEFORE: All images download immediately on page load -->
<img src="article-1.jpg" alt="Article 1">
<img src="article-2.jpg" alt="Article 2">
<!-- ... 198 more images, all loading simultaneously -->

<!-- ✅ AFTER: Images load only when near viewport -->
<img src="article-1.jpg" loading="lazy" alt="Article 1">
<img src="article-2.jpg" loading="lazy" alt="Article 2">

<!-- IMPORTANT: Hero image should NOT be lazy! It's above the fold. -->
<img src="hero.jpg" alt="Hero"
     loading="eager"           <!-- or just omit loading attribute -->
     fetchpriority="high">     <!-- Tell browser: prioritize this -->
```

> **Anti-pattern:** Adding `loading="lazy"` to the LCP image. This delays your most important image and tanks your LCP score. Lazy loading is for **below-the-fold** content only.

### IntersectionObserver — Under the Hood

When browser doesn't support `loading="lazy"` (older browsers), you implement it manually:

```javascript
// IntersectionObserver watches when elements enter the viewport
const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Element is now visible (or close to viewport)
      const img = entry.target
      img.src = img.dataset.src      // Swap data-src → src → triggers download
      img.classList.remove('lazy')
      observer.unobserve(img)        // Stop watching — no need anymore
    }
  })
}, {
  rootMargin: '200px'  // Start loading 200px BEFORE entering viewport
                       // This is the "trigger distance" — prevents visible pop-in
})

// Attach observer to all lazy images
document.querySelectorAll('img.lazy').forEach(img => {
  imageObserver.observe(img)
})

// HTML: use data-src instead of src so browser doesn't load it
// <img class="lazy" data-src="photo.jpg" src="placeholder.jpg" alt="...">
```

### React Component Lazy Loading Pattern

```javascript
import { useState, useEffect, useRef } from 'react'

function LazyComponent({ children }) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '100px' }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref}>
      {isVisible ? children : <Skeleton />}
    </div>
  )
}

// Usage: Heavy analytics chart only renders when scrolled into view
<LazyComponent>
  <HeavyAnalyticsChart data={data} />
</LazyComponent>
```

### Metrics Impact

| Without Lazy Loading | With Lazy Loading |
|---------------------|------------------|
| 100MB initial download (200 images) | 2MB initial (10 above-fold images) |
| LCP: 8s (waiting for all images) | LCP: 1.2s (only hero image) |
| Bandwidth wasted on unseen images | Bandwidth only for viewed content |

---

## Section 3: SSR vs SSG vs CSR — "Rendering Strategy là Architecture Decision"

### The Story: Ba tiệm bánh

Hãy nghĩ về 3 cách phục vụ bánh mì:

- **CSR** = Tiệm bánh giao cho bạn *nguyên liệu thô*. Bạn về nhà tự nướng.
  → Linh hoạt, nhưng bạn phải tốn thời gian nướng trước khi ăn.

- **SSR** = Mỗi khi có đơn, đầu bếp *nướng bánh fresh* theo yêu cầu.
  → Bánh luôn tươi, nhưng cần thời gian để nướng mỗi đơn.

- **SSG** = Buổi sáng sớm, tiệm *nướng sẵn 1,000 ổ* bánh. Khi có khách → lấy ngay.
  → Nhanh nhất, nhưng không thể customize từng ổ.

### CSR — Client-Side Rendering

```
Timeline:
T=0     → Browser requests page
T=100ms → Server sends: <div id="root"></div> (empty HTML + JS bundle link)
T=100ms → Browser starts downloading bundle.js (1-2MB)
T=1.5s  → JS downloaded, React hydrates, component renders
T=1.5s  → FCP fires ← user sees first content HERE
T=1.8s  → API calls fire, data loads
T=2.5s  → Full content visible, TTI ready

User experience: blank white screen for 1.5 seconds
Crawler experience: sees empty HTML → can't index content → SEO broken
```

```javascript
// CSR: React creates and manages all HTML in the browser
// index.html
<div id="root"></div>  <!-- This is literally all the server sends -->

// main.jsx
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
// Everything is JavaScript-driven, nothing is server-rendered
```

**Use when:** Admin dashboards, internal tools, authenticated apps where:
- SEO is irrelevant (login-gated content)
- Users are power users who tolerate initial load
- You need rich interactivity with complex client state

### SSR — Server-Side Rendering

```
Timeline:
T=0     → Browser requests /products/123
T=0     → Server: runs React, fetches data from DB, renders full HTML
T=300ms → Server sends: fully-populated HTML (user sees content immediately)
T=300ms → FCP fires ← user sees first content HERE (3x faster than CSR!)
T=300ms → Browser starts downloading hydration JS (smaller than full bundle)
T=800ms → Hydration complete → page is interactive (TTI)

User experience: sees real content at 300ms
Crawler experience: sees complete HTML → full SEO ✅
```

```javascript
// Next.js SSR: getServerSideProps runs on server, per request
export async function getServerSideProps(context) {
  const { id } = context.params
  const product = await db.products.findById(id)   // Real DB call, server-side
  const reviews = await db.reviews.findByProduct(id)

  return {
    props: { product, reviews }  // Injected into page as props
  }
}

export default function ProductPage({ product, reviews }) {
  // Renders with real data already available — no loading states needed
  return (
    <div>
      <h1>{product.name}</h1>          {/* Not empty — real data */}
      <p>{product.description}</p>
      <ReviewList reviews={reviews} />
    </div>
  )
}
```

**Trade-offs:**
- ✅ Fast FCP, good SEO, works with personalized/dynamic data
- ❌ Server must handle rendering load (CPU expensive at scale)
- ❌ TTFB slightly higher (server must fetch data before responding)
- ❌ Cannot be served from pure CDN (needs a Node.js server)

**Use when:** Product pages, news articles, search results — dynamic + needs SEO.

### SSG — Static Site Generation

```
Build time (once, not per-request):
  → Build script runs, fetches all data, renders ALL pages
  → Outputs static HTML files: /products/1.html, /products/2.html, ...
  → Deploy to CDN

Runtime:
T=0     → Browser requests /products/123
T=50ms  → CDN serves pre-built products-123.html (no server computation)
T=50ms  → FCP fires ← instant!
T=200ms → Hydration JS loads → interactive
```

```javascript
// Next.js SSG: getStaticProps runs at BUILD TIME, not per request
export async function getStaticProps({ params }) {
  const product = await db.products.findById(params.id)
  return {
    props: { product },
    revalidate: 60  // ISR: Rebuild this page every 60 seconds (optional)
  }
}

// getStaticPaths: Tell Next.js which pages to pre-build
export async function getStaticPaths() {
  const products = await db.products.findAll({ limit: 1000 })
  return {
    paths: products.map(p => ({ params: { id: p.id } })),
    fallback: 'blocking'  // Pages not pre-built: SSR on first request, then cached
  }
}
```

**Trade-offs:**
- ✅ Fastest possible (CDN-served static HTML)
- ✅ Scales infinitely (CDN handles load, no origin server needed)
- ✅ Cheapest hosting
- ❌ Content is stale until rebuild (unless using ISR)
- ❌ 10,000 products = 10,000 HTML files built at deploy time
- ❌ No personalization (same HTML for all users)

**Use when:** Marketing pages, blog posts, documentation, landing pages.

### ISR — Incremental Static Regeneration (Next.js)

The hybrid: pre-build pages, but automatically rebuild in background when content changes. Best of SSG (speed) + SSR (freshness).

```
revalidate: 60 means:
  - First request after 60s → serve stale page, trigger background rebuild
  - Next request → serve freshly rebuilt page
  - Result: max 60s stale, but always fast (no blocking rebuild)
```

### Decision Framework

```
Does this page need SEO?
  └── No → CSR (dashboard, admin, authenticated features)
  └── Yes →
        Is the content the same for every user?
          └── Yes →
                Does content change frequently? (< every few minutes)
                  └── No  → SSG (blog, docs, marketing)
                  └── Yes → SSR with aggressive CDN caching
          └── No (personalized per user) → SSR
```

---

## Section 4: Minification — "Xóa những thứ máy tính không cần nhưng con người cần"

### What Gets Removed

```javascript
// BEFORE minification — 312 bytes (human-readable)
/**
 * Calculate the total price including tax
 * @param {number} price - The base price
 * @param {number} taxRate - Tax rate as decimal (e.g., 0.1 for 10%)
 * @returns {number} Total price with tax
 */
function calculateTotalPrice(price, taxRate) {
  const taxAmount = price * taxRate;
  const totalPrice = price + taxAmount;
  return totalPrice;
}

// AFTER minification — 52 bytes (61% reduction)
function c(p,t){return p+(p*t)}
```

What was removed:
- Comments (3 lines of JSDoc = ~200 bytes)
- Whitespace and newlines
- Long variable names → single letters
- Unnecessary braces and syntax sugar

### Compression Stack: The Full Picture

Minification is just step 1. The real magic is the **compression stack**:

```
Source code: 500 KB
  → Minification:      350 KB  (30% reduction)
  → Gzip compression:   90 KB  (74% reduction from minified)
  → Brotli compression: 75 KB  (15% better than Gzip, 85% from minified)

What gets sent over the network: 75 KB instead of 500 KB → 85% smaller
```

**Gzip vs Brotli:**
| | Gzip | Brotli |
|--|------|--------|
| Browser support | 100% | ~95% (all modern browsers) |
| Compression ratio | Baseline | 15-25% better than Gzip |
| Speed | Fast | Slightly slower to compress (but pre-compressed for static files) |
| Use case | Dynamic content (generated per request) | Static files (pre-compress at build time) |

**In practice:** Your build tool (Webpack, Vite) minifies. Your server (Nginx) or CDN applies Brotli/Gzip automatically. You configure once, benefit forever.

### Who Does This Automatically?

```bash
# Vite (modern default)
vite build  # Outputs minified JS/CSS with source maps stripped

# webpack with TerserPlugin (default in production mode)
mode: 'production'  # Automatically enables TerserPlugin for JS, CSSMinimizerPlugin for CSS

# You don't need to think about this — just run production builds
```

### CSS Minification Tricks

```css
/* BEFORE: 180 bytes */
.button {
  margin-top: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
  margin-left: 10px;
  background-color: #ff0000;
  font-weight: bold;
}

/* AFTER: 60 bytes (67% reduction) */
.button{margin:10px;background:#f00;font-weight:700}
```

---

## Section 5: Tree Shaking — "Chỉ đóng gói code bro THỰC SỰ dùng"

### The Lodash Trap — A Real Story

Câu chuyện này xảy ra ở hàng nghìn projects:

```javascript
// Developer muốn dùng debounce — chỉ 1 function thôi
import _ from 'lodash'     // ← imports ENTIRE lodash library: 71KB

// Used in code:
_.debounce(handler, 300)   // Only debounce is actually used
```

Bundle size added: **71KB** — for 1 function.

```javascript
// Tree-shaking friendly alternative:
import debounce from 'lodash-es/debounce'  // ← Only: 2.3KB

// OR with named imports from ES module version:
import { debounce } from 'lodash-es'       // Tree shaker removes everything else
```

Bundle size added: **2.3KB** — 97% reduction.

### How Tree Shaking Works

```javascript
// math-utils.js
export function add(a, b) { return a + b }          // USED
export function subtract(a, b) { return a - b }     // NOT USED
export function multiply(a, b) { return a * b }     // NOT USED
export function complexAlgorithm(data) {            // NOT USED
  // 500 lines of complex code
}

// app.js
import { add } from './math-utils'    // Only imports add

// What webpack/Rollup includes in bundle:
// → add function ONLY
// → subtract, multiply, complexAlgorithm → REMOVED (tree shaken)
```

### Critical Requirement: ES Modules

Tree shaking **only works with ES Modules (`import`/`export`)**. It does NOT work with CommonJS (`require`/`module.exports`).

```javascript
// ❌ CommonJS — tree shaking impossible
const { debounce } = require('lodash')  // require() is dynamic, analyzed at runtime
                                         // Bundler can't know what you'll use

// ✅ ES Modules — tree shaking works
import { debounce } from 'lodash-es'   // Static import analyzed at build time
                                        // Bundler knows exactly what's used
```

**Why does this matter?** Many old npm packages ship CommonJS. Always look for:
- `lodash-es` instead of `lodash`
- `date-fns` (ES modules native) instead of `moment` (CommonJS, 70KB)
- `nanoid` instead of `uuid` (tree-shakeable)

### Side Effects Trap

```javascript
// package.json
{
  "sideEffects": false    // ← This tells tree shaker: "All files are safe to remove if unused"
}

// If you don't set this, webpack is conservative and keeps everything
// (Can't remove something that might have side effects it doesn't know about)
```

---

## Section 6: Prefetch vs Preload — "Tài nguyên đúng chỗ, đúng lúc"

### The Story: Quản gia và quần áo

Bạn có một quản gia. Hai kịch bản:

**Preload:** Bạn đang chuẩn bị cho buổi họp 9 giờ sáng. Bạn nói: *"Lấy bộ vest của tôi NGAY BÂY GIỜ — tôi cần nó trong 5 phút."* Quản gia bỏ hết việc khác, mang vest tới ngay.

**Prefetch:** Tối qua, bạn nói: *"Ngày mai tôi có tiệc tối lúc 7 giờ. Khi nào rảnh, hãy chuẩn bị bộ đồ tối hôm đó."* Quản gia làm khi đang rảnh, không cần rush.

### Preload — "Tôi cần cái này NGAY cho trang này"

```html
<!-- Fonts: Without preload, font loads AFTER CSS parsed → FOUT (Flash of Unstyled Text) -->
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>

<!-- Hero image: Critical for LCP -->
<link rel="preload" href="/images/hero.jpg" as="image">

<!-- Critical CSS for above-the-fold content -->
<link rel="preload" href="/css/critical.css" as="style">

<!-- What "as" attribute does: tells browser the resource TYPE so it can:
     - Set correct Accept header
     - Apply correct Content-Security-Policy
     - Prioritize correctly (font > image in some cases) -->
```

**How it improves LCP:**
```
Without preload for hero image:
  HTML parsing → CSS parsing → image tag discovered → fetch image → LCP: 3.2s

With preload:
  <link rel="preload"> → fetch starts IMMEDIATELY → image ready when tag discovered → LCP: 1.8s
  (fetch happened in parallel with HTML/CSS parsing, not after)
```

**Warning:** Over-preloading = wasted bandwidth + bandwidth contention
```html
<!-- ❌ Preloading everything defeats the purpose -->
<link rel="preload" href="/js/dashboard.js" as="script">    <!-- Not needed on homepage! -->
<link rel="preload" href="/images/product-1.jpg" as="image"> <!-- Below the fold! -->
<link rel="preload" href="/images/product-2.jpg" as="image"> <!-- Below the fold! -->
```

### Prefetch — "Tôi CÓ THỂ cần cái này cho trang tiếp theo"

```html
<!-- User is on /products list page — likely to click a product next -->
<link rel="prefetch" href="/js/product-detail.chunk.js">
<link rel="prefetch" href="/images/product-placeholder.jpg">

<!-- In React Router: use React.lazy + prefetch hint -->
```

```javascript
// React Router prefetch on hover (before user clicks)
function ProductLink({ productId }) {
  const handleMouseEnter = () => {
    // Start prefetching chunk when user HOVERS — they haven't clicked yet!
    const chunk = import('./pages/ProductDetail')  // Fires prefetch
  }

  return (
    <Link to={`/products/${productId}`} onMouseEnter={handleMouseEnter}>
      View Product
    </Link>
  )
}
// Typical hover → click time: 200-400ms
// Chunk download time: 200-600ms
// Result: chunk often arrives before user clicks → instant navigation
```

### Comparison Table

| | Preload | Prefetch |
|--|---------|----------|
| Priority | **High** — browser fetches ASAP | **Idle** — browser fetches when nothing else to do |
| When to use | Current page, above-the-fold, LCP resources | Next likely page's resources |
| Risk if unused | Bandwidth wasted (high cost, high priority fetch) | Bandwidth wasted (low cost, idle fetch) |
| `<link>` attribute | `rel="preload"` | `rel="prefetch"` |
| Impact on LCP | Improves (fetches critical resources early) | No impact on current page |
| Impact on next page | No impact | Improves (resource already cached) |

### DNS Prefetch and Preconnect (Bonus)

```html
<!-- For 3rd party domains you'll connect to -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://analytics.example.com" crossorigin>
<link rel="dns-prefetch" href="https://api.example.com">

<!-- preconnect: DNS + TCP + TLS handshake (full connection setup, 100-300ms saved)
     dns-prefetch: DNS only (10-100ms saved, lighter weight) -->
```

---

## Section 7: Putting It All Together — The Full Interview Answer Framework

### Khi interviewer hỏi: "How would you optimize this React application's performance?"

**Đừng liệt kê kỹ thuật. Hãy nói về PROCESS.**

#### Step 1: Measure First (không optimize blind)
> "Before anything else, I'd run Lighthouse and look at Core Web Vitals — specifically LCP, CLS, and TTI. I need to know what the actual bottleneck is. Is it a massive JS bundle? Render-blocking resources? Slow API responses? The fix is completely different depending on the diagnosis."

#### Step 2: Network Optimization (giảm bytes gửi qua mạng)
> "If I find a large bundle, I'd analyze it with webpack-bundle-analyzer to see what's taking up space. Most of the time it's either: one or two heavy libraries that can be tree-shaken or replaced with lighter alternatives, or pages loading code they don't need yet — which I'd solve with route-based code splitting.
> 
> I'd also ensure minification and Brotli compression are enabled in the CDN — this alone typically reduces payload by 80%."

#### Step 3: Loading Strategy (load thông minh hơn)
> "For loading strategy, I'd preload critical resources — specifically the LCP image and any web fonts that affect above-the-fold content, since those directly impact Core Web Vitals scores. For images below the fold, native lazy loading with `loading='lazy'`.
>
> For navigation performance, I'd add prefetch hints for likely next pages — most of our users follow predictable patterns through the funnel."

#### Step 4: Rendering Strategy (chọn đúng rendering mode)
> "Finally, I'd question whether we're using the right rendering strategy. Product pages and content that needs SEO should be SSR or SSG with ISR — there's no reason to have a blank screen while React loads if the content is the same for every visitor. Dashboards and authenticated features stay CSR since SEO isn't a concern there."

#### Step 5: Monitor Continuously
> "And I'd set up Real User Monitoring — Lighthouse measures lab conditions, but real users on slow 3G connections or old Android phones behave differently. I'd track Core Web Vitals with tools like Datadog RUM or web-vitals.js, and set alerts if P75 LCP degrades."

---

## Section 8: Common Anti-Patterns — "What NOT to Do"

### 1. Lazy loading the LCP image
```html
<!-- ❌ Kills LCP score — browser delays fetching most important image -->
<img src="hero.jpg" loading="lazy" alt="Hero">

<!-- ✅ Hero is above-the-fold → eager load + preload hint -->
<link rel="preload" href="hero.jpg" as="image">
<img src="hero.jpg" loading="eager" fetchpriority="high" alt="Hero">
```

### 2. Importing full lodash with CommonJS
```javascript
// ❌ 71KB for one function — tree shaking won't save you here (CommonJS)
const _ = require('lodash')
_.debounce(fn, 300)

// ✅ 2.3KB — tree shaking works on ES modules
import { debounce } from 'lodash-es'
```

### 3. SSR everything (even content that doesn't need it)
```
User profile dashboard → SSR makes no sense
  - Content is auth-gated (no SEO benefit)
  - Data is unique per user (can't cache on CDN)
  - You're spending server CPU to render what could be CSR

Only SSR when you gain something: SEO, faster FCP for public content
```

### 4. Preloading resources from future pages
```html
<!-- ❌ Preloading dashboard.js on the homepage wastes high-priority bandwidth -->
<link rel="preload" href="/js/dashboard.chunk.js" as="script">

<!-- ✅ Prefetch (idle, low cost) if user is likely to go to dashboard -->
<link rel="prefetch" href="/js/dashboard.chunk.js">
```

### 5. Not setting width/height on images (CLS killer)
```html
<!-- ❌ Browser doesn't know image dimensions → layout shifts when image loads -->
<img src="product.jpg" alt="Product">

<!-- ✅ Reserve space upfront → no layout shift → CLS: 0 -->
<img src="product.jpg" width="400" height="300" alt="Product">
<!-- OR: aspect-ratio CSS as modern alternative -->
<img src="product.jpg" style="aspect-ratio: 4/3; width: 100%" alt="Product">
```

---

## Quick Reference Card

```
MEASURE FIRST: Lighthouse → LCP target < 2.5s, CLS < 0.1, TTI < 3.8s

CODE SPLITTING:
  → React.lazy(() => import('./Page'))  +  <Suspense fallback={<Spinner/>}>
  → Route-based: each page = 1 chunk
  → Vendor splitting: node_modules → separate cached chunk

LAZY LOADING:
  → Images below fold: <img loading="lazy">
  → Hero/LCP image: <img loading="eager" fetchpriority="high">
  → Components: IntersectionObserver or React.lazy

RENDERING STRATEGY:
  → CSR  = auth/dashboard (no SEO needed)
  → SSR  = product pages, search results (SEO + dynamic)
  → SSG  = blog, docs, marketing (SEO + static content)
  → ISR  = SSG + auto-rebuild = best of both

MINIFICATION: Automatic in production build (Vite/Webpack). Gzip=baseline, Brotli=15% better.

TREE SHAKING:
  → Requires ES Modules (import/export, NOT require)
  → lodash → lodash-es | moment → date-fns | uuid → nanoid
  → "sideEffects": false in package.json

PRELOAD  = "I need this NOW for current page" (fonts, hero image, critical CSS)
PREFETCH = "I might need this for NEXT page" (next route chunk, next page data)

TOP ANTI-PATTERNS:
  ❌ loading="lazy" on LCP/hero image
  ❌ import _ from 'lodash' (CommonJS, no tree shaking)
  ❌ SSR for authenticated dashboards (no SEO gain, wastes server)
  ❌ Images without width/height (CLS)
  ❌ Preloading resources from other pages (wasted high-priority bandwidth)
```
