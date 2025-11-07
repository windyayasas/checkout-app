import 'server-only';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// Resolve API key from environment. User must set GEMINI_API_KEY or GOOGLE_API_KEY in .env.local.
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

if (!apiKey) {
  // Fail fast so missing configuration is obvious during development.
  throw new Error('Missing GEMINI_API_KEY or GOOGLE_API_KEY. Add it to .env.local and restart the dev server.');
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey,
    }),
  ],
  model: 'googleai/gemini-2.0-flash',
});

// Optionally you can expose a helper for quick health checks.
export async function aiHealthCheck() {
  return { hasKey: Boolean(apiKey), model: 'googleai/gemini-2.0-flash' };
}
