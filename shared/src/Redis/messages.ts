import { z } from 'zod';

export const HelloWorldMessage = z.object({
  type: z.literal('hello-world'),
  payload: z.string(),
});

export const redisMessageSchema = z.discriminatedUnion('type', [HelloWorldMessage]);

export type redisMessageSchema = z.infer<typeof redisMessageSchema>;
