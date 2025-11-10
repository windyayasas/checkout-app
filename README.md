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
  repositories/                # Firestore data access (families, items, invitations, members)
  store/                       # Zustand centralized app state
  docs/                        # Additional documentation (rules, architecture)
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
# Required for AI (Gemini / Google Generative AI)
GEMINI_API_KEY=YOUR_REAL_KEY
# OR
# GOOGLE_API_KEY=YOUR_REAL_KEY

# Firebase (Firestore + optional future services)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-app-id
# Optional extras (if used):
# NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
# NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
# NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abcdef123456
# NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
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
- Real authentication (Firebase Auth / NextAuth)
- Firestore persistence (families, items, invitations)
- Offline-first / PWA (service worker + caching)
- Price history & analytics
- Batch AI optimization for entire list
- Localization & unit conversions
- Role-based permissions & Firestore security rules
- Optimistic UI + conflict resolution for real-time edits

## 🩺 Troubleshooting
| Problem                                   | Cause                               | Fix |
| ----------------------------------------- | ----------------------------------- | --- |
| FAILED_PRECONDITION (API key)             | Missing env var                     | Add `GEMINI_API_KEY` + restart |
| AI suggestions empty                      | Model output filtered / schema      | Log raw response, adjust prompt |
| Styles not applied                        | Missing global import                | Confirm `globals.css` in `app/layout.tsx` |
| Module not found after rename             | Stale build cache                    | Delete `.next/` and rerun dev |
| Env var still undefined                   | Not restarted / wrong filename       | Use `.env.local`, restart terminal |
| Firestore permission denied               | Rules block access                   | Update Firestore security rules |
| Firestore env error                       | Missing NEXT_PUBLIC_FIREBASE_* vars | Add required Firebase vars, restart |

## 🛡 Security
- Keep Gemini API keys server-only (never in client bundles).
- Validate & sanitize user input before persistence.
- Firestore Rules: restrict reads/writes by membership (e.g. familyMembers collection). Deny unless user is member.
- Limit external calls with rate limiting/caching.
- Avoid storing sensitive secrets in NEXT_PUBLIC_* (those are exposed to client). Use server-only vars for future secure ops.

## 🤝 Contributing
1. Branch from `main`
2. `npm run lint && npm run typecheck`
3. Open PR with concise summary

## 📄 License
MIT

---

Happy building 🛒