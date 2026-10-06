import { z } from 'zod';

export const trackEventSchema = z.object({
  body: z.object({
    cardId: z.string().length(24, 'Invalid Card ID format'),
    eventType: z.enum(['view', 'scan', 'click', 'save']),
    referrer: z.string().optional(),
    buttonId: z.string().optional()
  })
});

export const queryAnalyticsSchema = z.object({
  query: z.object({
    cardId: z.string().length(24, 'Invalid Card ID format'),
    rangeDays: z.string().transform((val) => parseInt(val, 10)).default('7')
  })
});
