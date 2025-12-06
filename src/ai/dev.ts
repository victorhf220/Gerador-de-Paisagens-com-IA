import { config } from 'dotenv';
config();

import '@/ai/flows/extract-keywords-from-url.ts';
import '@/ai/flows/customize-summary-with-prompt.ts';
import '@/ai/flows/summarize-content-from-url.ts';