# Grocery / Family Checkout App

Smart collaborative grocery & household inventory manager built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, **Radix UI**, and **Genkit + Gemini (Google AI)** for assisted item detail suggestions.

## ✨ Core Features
- Multi‑family context (switch between households)
- Invite & manage members (invitations, join requests, member list)
- AI assisted grocery item detail suggestions (quantity, unit, brand, price)
- Structured grocery list with units (pcs, kg, g, ltr, ml, pack, dozen)
- Per‑family currency handling
- Placeholder auth flows (login / register) ready for real provider integration
- Accessible responsive UI (Tailwind + Radix primitives)
- Strongly typed AI flow (`suggestGroceryDetails`) with server-only key handling

## 📂 Project Structure
```
src/
  app/                         # Next.js App Router pages & layouts
  components/
    auth/                      # Login & auth-related components (mock)
    dashboard/                 # Grocery dialogs, lists, family mgmt
    ui/                        # Reusable UI primitives
  ai/
    genkit.ts                  # Genkit + Gemini config (server-only)
    flows/
      suggest-grocery-details.ts
  context/                     # React context (family, currency, etc.)
  hooks/                       # Reusable hooks
  lib/                         # Utilities/helpers
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (20 recommended)
- npm (or yarn/pnpm – adjust commands accordingly)

### Install
```bash
npm install
```

### Development
```bash
npm run dev
```
Runs at: http://localhost:9002

### Production Build
```bash
npm run build
npm start
```

### Lint & Types
```bash
npm run lint
npm run typecheck
```

## 🔐 Environment Variables
Create `.env.local` in project root:
```env
# Required for AI
GEMINI_API_KEY=YOUR_REAL_KEY
# or (alternative)
# GOOGLE_API_KEY=YOUR_REAL_KEY

# (Future example placeholders)
# NEXT_PUBLIC_FIREBASE_API_KEY=...
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
# NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
```
Restart dev server after editing env vars.

## 🤖 AI Flow
- `src/ai/genkit.ts` sets up Genkit with Gemini Flash (`googleai/gemini-2.0-flash`).
- `src/ai/flows/suggest-grocery-details.ts` defines the typed flow generating structured suggestions.
- Client components never access the API key; they call server code (server action or API route).

## 🛠 Scripts (package.json)
| Script          | Purpose                                      |
| --------------- | -------------------------------------------- |
| dev             | Start dev server (Turbopack, port 9002)      |
| build           | Build for production                         |
| start           | Run production server                       |
| lint            | Run ESLint                                   |
| typecheck       | TypeScript type check (no emit)              |
| genkit:dev      | Genkit local session                         |
| genkit:watch    | Genkit session in watch mode                 |

## ✅ Verifying AI Setup
Temporary route snippet:
```ts
import { aiHealthCheck } from '@/ai/genkit';
export async function GET() { return Response.json(await aiHealthCheck()); }
```
Expect `{ hasKey: true, model: "googleai/gemini-2.0-flash" }`.

## 🧭 Roadmap (Ideas)
- Real authentication (NextAuth / Firebase)
- Database persistence (PostgreSQL / Firestore / Supabase)
- Offline-first / PWA
- Price history & analytics
- Batch AI optimization for entire list
- Localization & unit conversions
- Role-based permissions

## 🩺 Troubleshooting
| Problem                                                        | Cause                            | Fix |
| -------------------------------------------------------------- | -------------------------------- | --- |
| FAILED_PRECONDITION (API key)                                  | Missing env var                  | Add `GEMINI_API_KEY` + restart |
| AI suggestions empty                                           | Model output filtered / schema   | Log raw response, relax prompt |
| Styles not applied                                             | Missing global import            | Confirm `globals.css` in `app/layout.tsx` |
| Module not found after rename                                  | Stale build cache                | Delete `.next/` and rerun dev |
| Env var still undefined                                        | Not restarted / wrong filename   | Use `.env.local`, restart terminal |

## 🛡 Security
- Keep API keys server-only (never in client bundles).
- Validate & sanitize user input before persistence (once DB added).
- Limit future external calls with rate limiting/caching.

## 🤝 Contributing
1. Branch from `main`
2. `npm run lint && npm run typecheck`
3. Open PR with concise summary

## 📄 License
MIT

---

Happy building 🛒