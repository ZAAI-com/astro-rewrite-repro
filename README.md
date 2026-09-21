# Astro: `context.rewrite()` picks the wrong dynamic route in `astro dev`

Reproduction for a withastro/astro bug report. Astro 7.3.3, static output, no adapter, no integrations.

## Shape

- `src/pages/[...slug].astro`: `getStaticPaths()` returns `about` and `pricing`.
- `src/pages/[year]/index.astro`: a yearly blog archive, `getStaticPaths()` returns `2025` and
  `2026`.
- `src/middleware.js`: serves `/about.md` by rewriting to `/about/`.

## Steps

```sh
npm install
npm run dev
curl -i http://localhost:4321/2026/     # 200, "Archive 2026"
curl -i http://localhost:4321/about/    # 200, "Page: about"
curl -i http://localhost:4321/about.md  # 500, NoMatchingStaticPathFound
```

## Actual

The rewrite throws:

```
[NoMatchingStaticPathFound] A `getStaticPaths()` route pattern was matched, but no matching
static path was found for requested path `/about/`.
  Hint:
    Possible dynamic routes being matched: src/pages/[year]/index.astro.
```

## Expected

The rewrite renders `src/pages/[...slug].astro`, exactly like the direct request to the same
path in the same dev server. `npm run build` is correct and emits `/about/` and `/pricing/`.

Deleting `src/pages/[year]/index.astro`, or moving it to `src/pages/blog/[year]/index.astro`,
makes the rewrite work.
