
import { config } from 'dotenv';
config();

import '@/ai/flows/personalized-welcome.ts';
import '@/ai/flows/ai-chat-flow.ts';
import '@/ai/flows/generate-image-flow.ts';
import '@/ai/flows/edit-image-flow.ts';
import '@/ai/tools/get-financial-health-tip-tool.ts'; // Added the new tool
