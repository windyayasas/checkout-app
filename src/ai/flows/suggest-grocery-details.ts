'use server';
/**
 * @fileOverview An AI flow to suggest details for a grocery item.
 *
 * - suggestGroceryDetails - A function that suggests quantity, unit, and brand for a grocery item.
 * - SuggestGroceryDetailsInput - The input type for the suggestGroceryDetails function.
 * - SuggestGroceryDetailsOutput - The return type for the suggestGroceryDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestGroceryDetailsInputSchema = z.object({
  name: z.string().describe('The name of the grocery item.'),
  currency: z.string().describe('The currency for the price estimate (e.g., USD, EUR, JPY).'),
});
type SuggestGroceryDetailsInput = z.infer<typeof SuggestGroceryDetailsInputSchema>;

const SuggestGroceryDetailsOutputSchema = z.object({
  quantity: z.number().describe('A common quantity for this item.'),
  unit: z
    .string()
    .describe(
      "A common unit of measurement for this item (e.g., 'pcs', 'kg', 'g', 'ltr', 'ml', 'pack', 'dozen')."
    ),
  brand: z.string().describe('A popular or common brand for this item.'),
  price: z.number().describe('An estimated unit price for this item. Use the specified currency.'),
});
type SuggestGroceryDetailsOutput = z.infer<typeof SuggestGroceryDetailsOutputSchema>;

export async function suggestGroceryDetails(input: SuggestGroceryDetailsInput): Promise<SuggestGroceryDetailsOutput> {
  return suggestGroceryDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestGroceryDetailsPrompt',
  input: {schema: SuggestGroceryDetailsInputSchema},
  output: {schema: SuggestGroceryDetailsOutputSchema},
  prompt: `You are an intelligent grocery list assistant. Based on the item name provided, suggest a common quantity, a suitable unit, a popular brand, and an estimated price in the specified currency.

For the unit, please choose from the following list: 'pcs', 'kg', 'g', 'ltr', 'ml', 'pack', 'dozen'.

If you don't know a good brand or price, you can leave it blank or use a reasonable estimate.

Item Name: {{{name}}}
Currency: {{{currency}}}`,
});


const suggestGroceryDetailsFlow = ai.defineFlow(
  {
    name: 'suggestGroceryDetailsFlow',
    inputSchema: SuggestGroceryDetailsInputSchema,
    outputSchema: SuggestGroceryDetailsOutputSchema,
  },
  async input => {
    if (input.name.length < 3) {
        return {
            quantity: 1,
            unit: 'pcs',
            brand: '',
            price: 0,
        };
    }
    const {output} = await prompt(input);
    return output!;
  }
);
