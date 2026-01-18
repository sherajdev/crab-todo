# Deploying Next.js with Cloudflare D1 on Cloudflare Pages

A comprehensive guide to avoid common pitfalls when deploying a Next.js application with Cloudflare D1 database on Cloudflare Pages.

---

## Issue 1: Lock File Out of Sync

**Error:**
```
npm error `npm ci` can only install packages when your package.json and package-lock.json are in sync.
```

**Cause:** Cloudflare Pages uses `npm ci` which requires exact match between `package.json` and `package-lock.json`.

**Fix:**
```bash
rm -rf node_modules package-lock.json
npm install
git add package-lock.json
git commit -m "Sync package-lock.json"
git push
```

---

## Issue 2: Wrong Build Settings for Next.js on Cloudflare Pages

**Wrong settings:**
- Build command: `npm run build`
- Output: `.next`

**Correct settings:**
- Build command: `npx @cloudflare/next-on-pages`
- Output directory: `.vercel/output/static`

---

## Issue 3: Next.js Version Incompatibility

**Error:**
```
peer next@">=14.3.0 && <=15.5.2" from @cloudflare/next-on-pages@1.13.16
```

**Cause:** `@cloudflare/next-on-pages` only supports Next.js up to version 15.5.2.

**Fix:** Downgrade Next.js from 16.x to 15.5.2 in `package.json`:
```json
{
  "dependencies": {
    "next": "15.5.2",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18",
    "@types/react-dom": "^18"
  }
}
```

---

## Issue 4: Missing Cloudflare Adapter

**Cause:** Standard Next.js builds don't work on Cloudflare Pages with D1 bindings.

**Fix:** Install required packages:
```bash
npm install -D @cloudflare/next-on-pages wrangler
```

---

## Issue 5: API Routes Not Using Edge Runtime

**Error:**
```
The following routes were not configured to run with the Edge Runtime:
  - /api/tasks/[id]
  - /api/tasks
```

**Cause:** Cloudflare Pages requires Edge Runtime for API routes.

**Fix:** Add to each API route file:
```typescript
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';
```

---

## Issue 6: D1 Database Access Pattern

**Wrong (using context parameter):**
```typescript
export async function GET(request: NextRequest, context: any) {
  const { results } = await context.env.DB.prepare(...).all();
}
```

**Correct (using getRequestContext):**
```typescript
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function GET() {
  const { env } = getRequestContext();
  const { results } = await env.DB.prepare(...).all();
}
```

---

## Issue 7: Missing Compatibility Flags

**Cause:** Node.js APIs need the `nodejs_compat` flag to work on Cloudflare Workers.

**Fix:** Add to `wrangler.toml`:
```toml
name = "your-project"
compatibility_date = "2026-01-18"
compatibility_flags = ["nodejs_compat"]

[[d1_databases]]
binding = "DB"
database_name = "your-db-name"
database_id = "your-db-id"
```

---

## Issue 8: TypeScript Types for Cloudflare Bindings

**Cause:** TypeScript doesn't know about Cloudflare's D1 bindings.

**Fix:** Create `env.d.ts` in project root:
```typescript
interface CloudflareEnv {
  DB: D1Database;
}

declare module '@cloudflare/next-on-pages' {
  export function getRequestContext(): {
    env: CloudflareEnv;
    ctx: ExecutionContext;
    cf: IncomingRequestCfProperties;
  };
}
```

---

## Issue 9: Scrollbar Flicker (CSS)

**Cause:** Hover effects (transforms, scale changes) causing content to briefly exceed viewport boundaries.

**Fix:** Add to `globals.css`:
```css
html {
  overflow-x: hidden;
  scrollbar-gutter: stable;
}

body {
  overflow-x: hidden;
}
```

---

## Post-Deployment Checklist

1. **Cloudflare Pages Dashboard → Settings → Functions:**
   - Add D1 database binding: Variable name `DB` → Select your database

2. **Build settings:**
   - Build command: `npx @cloudflare/next-on-pages`
   - Output directory: `.vercel/output/static`

---

## Complete API Route Template

```typescript
// src/app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function GET() {
  try {
    const { env } = getRequestContext();
    const { results } = await env.DB.prepare(
      "SELECT * FROM table_name"
    ).all();
    return NextResponse.json({ data: results });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

// For dynamic routes: /api/example/[id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { env } = getRequestContext();
  const { id } = await params;
  // ... use id and env.DB
}
```

---

## Quick Reference

| Aspect | Requirement |
|--------|-------------|
| Next.js version | ≤ 15.5.2 (for @cloudflare/next-on-pages) |
| Build command | `npx @cloudflare/next-on-pages` |
| Output directory | `.vercel/output/static` |
| API routes | Must export `runtime = 'edge'` |
| D1 access | Use `getRequestContext().env.DB` |
| Compatibility flag | `nodejs_compat` in wrangler.toml |
| Lock file | Must be in sync before deploy |

---

## Required Dependencies

```json
{
  "devDependencies": {
    "@cloudflare/next-on-pages": "^1.13.16",
    "wrangler": "^4.x"
  }
}
```

---

## Notes

- The `@cloudflare/next-on-pages` package is deprecated in favor of [OpenNext](https://opennext.js.org/cloudflare). Consider migrating for future projects.
- Always regenerate `package-lock.json` locally and commit it before pushing to avoid CI failures.
- The `wrangler.toml` warning about `pages_build_output_dir` can be ignored if using dashboard build settings.
