'use server';
/**
 * @fileOverview A Genkit tool for fetching a random financial health tip.
 * - getFinancialHealthTip - The Genkit tool definition.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const financialHealthTips = [
  "Create a budget and stick to it. Knowing where your money goes is the first step to financial control.",
  "Build an emergency fund. Aim for at least 3-6 months of living expenses.",
  "Pay off high-interest debt as quickly as possible. It can save you a lot in the long run.",
  "Start saving for retirement early. Even small amounts can grow significantly over time due to compound interest.",
  "Review your insurance coverage regularly to ensure it still meets your needs.",
  "Diversify your investments to spread risk.",
  "Understand your credit score and take steps to improve it if necessary.",
  "Set clear financial goals, both short-term and long-term.",
  "Continuously educate yourself about personal finance.",
  "Avoid impulse purchases. Give yourself a 'cooling off' period before buying non-essential items."
];

// No specific input needed for a random tip for this example
const GetFinancialHealthTipInputSchema = z.object({});

const GetFinancialHealthTipOutputSchema = z.string().describe("A helpful financial health tip.");

export const getFinancialHealthTip = ai.defineTool(
  {
    name: 'getFinancialHealthTip',
    description: 'Returns a useful financial health tip for users when they ask for general financial advice or a tip.',
    inputSchema: GetFinancialHealthTipInputSchema,
    outputSchema: GetFinancialHealthTipOutputSchema,
  },
  async () => {
    // In a real scenario, this could fetch from a database, API, etc.
    const randomIndex = Math.floor(Math.random() * financialHealthTips.length);
    const tip = financialHealthTips[randomIndex];
    console.log(`[getFinancialHealthTip Tool] Providing tip: "${tip}"`);
    return tip;
  }
);
