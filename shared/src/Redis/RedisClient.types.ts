import { redisMessageSchema } from './messages';
import { json, z } from 'zod';

export enum XReadTokens {
  GROUP = 'GROUP',
  COUNT = 'COUNT',
  BLOCK = 'BLOCK',
  STREAMS = 'STREAMS',
}

export enum XAddTokens {
  /**
   * Auto incrementing ID
   */
  ID = '*',
  MESSAGE = 'MESSAGE',
}

export enum GroupDeliveryOpts {
  /**
   * Read all new messages
   */
  'LATEST' = '>',
  /**
   * Read all messages
   */
  'ALL' = '0',
}

export enum XGroupOpts {
  /**
   * Create a new consumer group
   */
  CREATE = 'CREATE',
  /**
   * Create a new stream if it doesn't exist
   */
  MKSTREAM = 'MKSTREAM',
}

export enum Streams {
  RSS_STREAM = 'rss-stream',
}

export enum ConsumerGroups {
  RSS_GROUP = 'rss-group',
}

export type SendMessageOpts = {
  stream: Streams;
  message: redisMessageSchema;
};

export type ReadMessageOpts = {
  group: ConsumerGroups;
};

const stringToJSONSchema = z.string().transform((str, ctx): z.infer<ReturnType<typeof json>> => {
  try {
    return JSON.parse(str);
  } catch (e) {
    ctx.addIssue({ code: 'custom', message: 'Invalid JSON' });
    return z.NEVER;
  }
});

export const readResponseSchema = z
  .array(
    z.tuple([
      z.string(), // stream name
      z.array(
        z.tuple([
          z.string(), // message ID
          z.tuple([
            z.literal('MESSAGE'),
            stringToJSONSchema.pipe(redisMessageSchema), // message content
          ]),
        ]),
      ),
    ]),
  )
  .transform((streams) => {
    // Extract just the message content from all streams
    return streams.flatMap(([_streamName, messages]) =>
      messages.map(([_messageId, [_messageLiteral, messageContent]]) => messageContent),
    );
  });
