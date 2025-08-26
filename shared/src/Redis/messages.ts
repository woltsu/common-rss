import { z } from 'zod';

export const SyncFeedMessage = z.object({
  type: z.literal('sync-feed'),
  payload: z.object({
    source: z.string(),
  }),
});

export const redisMessageSchema = z.discriminatedUnion('type', [SyncFeedMessage]);

export type RedisMessage = z.infer<typeof redisMessageSchema>;
