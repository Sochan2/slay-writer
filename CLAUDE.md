# CLAUDE.md

## Project

This app is a LinkedIn post generation tool using the **Slay Strategy**. It helps users craft high-performing LinkedIn content.

## Architecture

| Path | Purpose |
|------|---------|
| `/app` | App Router pages |
| `/app/api` | API route handlers |
| `/app/auth` | Auth callback routes (e.g. OAuth redirect handling) |
| `/components` | Shared UI components (e.g. `Navbar.tsx`, `PostCard.tsx`) |
| `/components/magicui` | Animation/UI library components — swappable, treat as a flexible UI library layer |
| `/lib` | Server-side utilities: Supabase client/server/admin, Stripe, rate limiting, and other helpers |

## Conventions

- Functional components only
- Tailwind CSS for all styling
- Server components by default — use `'use client'` only when necessary
- All database calls go through `lib/supabase`

## Color Palette

| Role | Hex |
|------|-----|
| Main | `#E68435` |
| Main | `#E6B635` |
| Accent | `#3583E6` |
| Secondary | `#E6C281` |
