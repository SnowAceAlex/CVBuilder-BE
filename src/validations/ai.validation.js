import { z } from 'zod';

export const aiSuggestionSchema = z.object({
  section: z.string().trim().min(1, 'Section is required'),
  draftText: z.string().trim().min(5, 'Text must be at least 5 characters'),
  tone: z.string().trim().optional(),
});
