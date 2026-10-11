<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project structure

- `src/app/` holds routes only. A `page.tsx` stays thin: read params/session, then render a component from a module.
- `src/modules/<feature>/` holds the feature code behind those routes. Name the module after its route segment in singular form (route `/channel/*` → `src/modules/channel`).
- `src/components/ui/` is shadcn (react-aria based) primitives, `src/components/customs/` shared app components, `src/components/layouts/` app chrome such as the sidebar.
- `src/lib/` holds clients (Supabase, server-only YouTube Data API in `lib/youtube.ts`, utils), `src/hooks/` shared React hooks (e.g. `useInfiniteScroll`), `src/providers/` React context providers, `src/types/` cross-feature types, `src/shared/constants/` shared constants.

## Module layout

Follow the existing modules (`src/modules/home`, `src/modules/channel`) and only create the folders a feature needs:

```
src/modules/<feature>/
  actions.ts          # "use server" server actions; return plain serializable data (bigint → number, dates → ISO string)
  components/         # PascalCase .tsx; a component with its own sub-parts gets a kebab-case folder (profile-section/ProfileSection.tsx)
  hooks/              # React Query hooks, one per file (useChannelList.ts); query keys live in hooks/keys.ts
  types/              # <name>.types.ts; interfaces prefixed with I (IChannelListItem)
  utils/              # pure helpers (formatting, URL tweaks)
  schemas/            # zod schemas when the feature has forms
  <job>/              # server-only jobs, e.g. channel/sync (YouTube sync used by the cron route)
```

- Components import within their module by relative path (`../hooks/useChannelList`) and across modules or shared code via `@/`.
- Channel data is public: channel server actions do not require a session.
