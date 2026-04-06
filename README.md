A production-quality movie discovery app built with Next.js 15 App Router, TypeScript, and Tailwind CSS, powered by the TMDB API.

---

## Getting Started

```bash
npm install
echo "TMDB_API_KEY=your_key_here" > .env.local
npm run dev
```

Get a free TMDB API key at [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api).

---

## Deployment

**Platform: Vercel**

Cloudflare Workers was attempted first (as preferred by the assessment). The deployment failed at the `npm ci` step because Cloudflare's build pipeline requires a committed `package-lock.json` and does not expose an easy way to override the install command through configuration files alone. Rather than spend assessment time debugging the Cloudflare build pipeline, Vercel was chosen as the fallback for the following reasons:

- Vercel has first-class Next.js support — it is built and maintained by the same team
- Zero-config deployment — `next build` output is automatically detected
- Environment variables are set via the Vercel dashboard, identical to Cloudflare's approach
- Vercel's Edge Network provides CDN caching equivalent to Cloudflare for static assets
- ISR (Incremental Static Regeneration) works out of the box on Vercel with no additional config

---

## Project Structure

```
app/                          # Next.js App Router pages, layouts, loading/error
  api/tmdb/route.ts           # Proxy Route Handler — keeps API key server-side
  movies/[id]/page.tsx        # Movie detail — SSR prefetch + og:image metadata
  movies/popular/page.tsx     # Popular listing — SSR + dynamic import
  movies/top-rated/page.tsx   # Top rated listing — SSR + dynamic import
  movies/now-playing/page.tsx # Now playing listing — SSR + dynamic import
  search/page.tsx             # Search results — server reads URL params
  layout.tsx                  # Root layout — Navbar, next/font, globals
  globals.css                 # Tailwind entry point only (@import "tailwindcss")

components/
  Clients/                    # Client Components — use React Query hooks
    HomeClient.tsx
    PopularClient.tsx
    TopRatedClient.tsx
    NowPlayingClient.tsx
    NowPlayingClient.tsx
    MovieDetailClient.tsx
    SearchClient.tsx
  HeroBanner.tsx              # Server Component — above-the-fold hero
  MovieCard.tsx               # Server Component — poster card
  MovieGrid.tsx               # Server Component — responsive grid
  Navbar.tsx                  # Client Component — hamburger state
  Pagination.tsx              # Client Component — URL-driven page links
  SearchBar.tsx               # Client Component — debounced input
  SearchFilters.tsx           # Client Component — genre/rating dropdowns
  GenreFilter.tsx             # Client Component — genre pill buttons

lib/
  tmdb.ts                     # Server-only fetch wrapper (uses TMDB_API_KEY)
  tmdb.client.ts              # Client-safe fetch wrapper (proxies via /api/tmdb)
  utilities.ts                # formatRating, formatRuntime, formatCurrency

services/
  tmdb.server.ts              # Server-side service functions with cache settings
  tmdb.services.ts            # Client-side service functions (via proxy)

hooks/
  useTmdb.ts                  # All TanStack Query hooks

types/
  movie.ts                    # Shared TypeScript interfaces

__tests__/
  MovieCard.test.tsx          # 7 tests — rendering, fallbacks, href
  Pagination.test.tsx         # 12 tests — logic, aria, href construction
```

---

## Architecture Decisions

### Server vs Client split

All `page.tsx` files are Server Components. They SSR-prefetch data via `services/tmdb.server.ts` (which uses `process.env.TMDB_API_KEY` directly) and pass it as `initialData` to Client Components via TanStack Query. This means:

- Pages are never blank on first load (SSR)
- Subsequent navigations use the client cache (no re-fetch)
- The API key never reaches the browser

### API key security

`TMDB_API_KEY` is server-side only. Client Components fetch through `/api/tmdb` (a Next.js Route Handler proxy) which appends the key server-side before forwarding to TMDB.

### Two service layers

- `services/tmdb.server.ts` — used only in Server Components and Route Handlers
- `services/tmdb.services.ts` — used only in Client Components via the proxy
  Components never call `fetch()` directly — all fetching goes through these layers.

### No business logic in JSX

Formatting (`formatRating`, `formatRuntime`, `formatCurrency`), URL construction, and pagination logic live in `lib/utilities.ts` and component-local functions. JSX is purely presentational.

### Pagination over infinite scroll

Pagination was chosen because:

1. The URL stays stateful — page 3 is bookmarkable and shareable
2. Works on first load without JavaScript (SSR renders page 1 immediately)
3. Simpler to implement correctly alongside SSR and React Query cache keys
4. TMDB caps results at page 500 — pagination communicates this boundary clearly

---

## Performance Optimisations

All five required optimisations are implemented:

### 1. `next/image` with explicit sizes and `priority`

Every `<Image>` uses the `fill` prop with a responsive `sizes` attribute. Above-the-fold images (hero backdrop, detail page backdrop) use `priority` to trigger `<link rel="preload">`, eliminating LCP delays.

```tsx
// Hero backdrop — above the fold, preloaded
<Image src={backdropUrl} alt={movie.title} fill priority sizes="100vw" />

// Movie card — lazy by default, responsive sizes hint prevents layout shift
<Image src={posterUrl} alt={movie.title} fill
  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw" />
```

### 2. Route-level code splitting via `next/dynamic`

Every heavy Client Component is lazy-loaded with `next/dynamic`. The server renders the skeleton synchronously while the JS bundle downloads asynchronously.

```ts
const HomeClient = dynamic(() => import('@/components/Clients/HomeClient'), {
  loading: () => <HomeSkeleton />,
});
```

Applied to: `HomeClient`, `PopularClient`, `TopRatedClient`, `NowPlayingClient`, `MovieDetailClient`.

### 3. Next.js fetch cache settings

Each endpoint in `services/tmdb.server.ts` uses a deliberate cache strategy:

| Endpoint              | Strategy                 | Reason                                             |
| --------------------- | ------------------------ | -------------------------------------------------- |
| `/trending/movie`     | `revalidate: 3600`       | Trending changes hourly                            |
| `/movie/popular`      | `revalidate: 3600`       | Popular list updates hourly                        |
| `/movie/now_playing`  | `revalidate: 1800`       | More time-sensitive, refresh every 30 min          |
| `/movie/top_rated`    | `revalidate: 86400`      | All-time rankings change very slowly               |
| `/movie/[id]`         | `revalidate: 86400`      | Movie metadata almost never changes                |
| `/movie/[id]/credits` | `force-cache`            | Cast and crew are permanent facts                  |
| `/search/movie`       | `no-store` (client-side) | Search results are user-specific and must be fresh |

### 4. Font optimisation via `next/font`

`Inter` is loaded through `next/font/google` in `app/layout.tsx`. This:

- Self-hosts the font — eliminates the render-blocking third-party request to `fonts.googleapis.com`
- Injects `font-display: swap` automatically, preventing invisible text during load
- Only preloads the weights actually used (`400`, `500`, `600`, `700`, `800`)
- Scopes the font via a CSS variable (`--font-inter`) to avoid global pollution

```ts
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '800'],
});
```

### 5. Cloudflare Cache-Control headers for static assets

Configured in `next.config.ts`:

```ts
async headers() {
  return [
    {
      source: '/_next/static/:path*',
      headers: [{
        key: 'Cache-Control',
        value: 'public, max-age=31536000, immutable',
      }],
    },
  ];
},
```

Next.js content-hashes all `_next/static` filenames on every build (e.g. `_next/static/chunks/abc123.js`), making them permanently immutable. The `immutable` directive tells Cloudflare and browsers never to revalidate these files for 1 year — safe because a new build always produces new filenames.

---

## Testing

```bash
npm test              # run all tests once
npm run test:watch    # watch mode
npm run test:coverage # coverage report
```

**`MovieCard` — 7 tests**
Covers: title render, release year extraction, rating badge, href construction, poster image alt text, fallback initial letter when `poster_path` is null, missing year when `release_date` is empty.

**`Pagination` — 12 tests**
Covers: null render when ≤1 page, no Prev on page 1, no Next on last page, both buttons on middle pages, `aria-current="page"` on active link, correct href construction, `searchQuery` included in href, 500-page cap enforcement, ellipsis rendering.

---

## State Management

No global state library is used. The full state model:

| Concern                   | Solution                                |
| ------------------------- | --------------------------------------- |
| Server / async data       | TanStack Query (`useQuery`)             |
| Navigation & filter state | URL (`searchParams`, `useSearchParams`) |
| Local UI state            | `useState` (hamburger menu toggle)      |

Context API and Redux are not needed — React Query handles all server state, and the URL handles all shareable navigation state.
