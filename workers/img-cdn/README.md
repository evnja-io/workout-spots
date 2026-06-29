# evnja-img-cdn

Image reverse-proxy + edge cache for `spots.evnja.gg`, served from the
Cloudflare-proxied hostname **`img.evnja.gg`**.

The app rewrites image URLs to this host at render time via
`src/lib/cdn/images.ts` (`cdnImageUrl`), gated by the `VITE_IMAGE_CDN_URL`
env var. No DB migration — stored URLs keep their original origin.

## Routes

| Incoming path        | Upstream                                                          |
| -------------------- | ---------------------------------------------------------------- |
| `/sb/<rest>`         | `https://puewbgczxvlcckspbfzv.supabase.co/storage/v1/object/public/<rest>` |
| `/ext/<host>/<path>` | `https://<host>/<path>` — only if `<host>` is allowlisted        |
| `/app/<path>`        | `https://spots.evnja.gg/<path>` (static assets, e.g. og-image)   |
| anything else        | `404`                                                            |

The `/ext` allowlist (`EXT_ALLOWLIST` in `index.js`) must stay in sync with the
allowlist in `src/lib/cdn/images.ts`.

## Caching

Cache API (`caches.default`). Successful responses are stored with
`Cache-Control: public, max-age=31536000, immutable`. The full URL (incl. query
string) is the cache key, so cache-busted URLs invalidate correctly.

## Deploy

Initial deploy is via the Cloudflare dashboard:

1. **Workers & Pages → Create → Worker**, name `evnja-img-cdn`, paste `index.js`, **Deploy**.
2. **Worker → Settings → Domains & Routes → Add Custom Domain** `img.evnja.gg`.

Or, with `wrangler login` / an API token available locally:

```bash
cd workers/img-cdn && npx wrangler deploy
```

## Verify

```bash
curl -sI https://img.evnja.gg/sb/location-images/<known-path>      # 200, cf-cache-status MISS→HIT
curl -sI https://img.evnja.gg/ext/calisthenics-parks.com/<path>    # 200, caches
curl -sI https://img.evnja.gg/ext/evil.example.com/x.jpg           # 403 (allowlist)
```

Notes: Workers Free tier = 100k requests/day (ample at current traffic). If the
set of scraped hosts in `location_images.image_url` changes, update both
allowlists.
