import { z } from 'zod';

export const syncFeedMessage = z.object({
  type: z.literal('sync-feed'),
  payload: z.object({
    source: z.string(),
  }),
});

export type SyncFeedMessage = z.infer<typeof syncFeedMessage>;

export const itemExpiryMessage = z.object({
  type: z.literal('item-expiry'),
});

export type ItemExpiryMessage = z.infer<typeof itemExpiryMessage>;

export const redisMessageSchema = z.discriminatedUnion('type', [syncFeedMessage, itemExpiryMessage]);

export type RedisMessage = z.infer<typeof redisMessageSchema>;
