
import { config } from 'dotenv';
config();

import '@/ai/flows/personalized-welcome.ts';
import '@/ai/flows/ai-chat-flow.ts';
import '@/ai/flows/generate-image-flow.ts';
import '@/ai/flows/edit-image-flow.ts'; // Added new image editing flow
