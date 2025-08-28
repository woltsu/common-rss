import { Redis } from 'ioredis';
import {
  GroupDeliveryOpts,
  ReadMessageOpts,
  readResponseSchema,
  SendMessageOpts,
  SetOpts,
  Streams,
  XAddTokens,
  XGroupOpts,
  XReadTokens,
  ZAddOpts,
  ZRangeByScoreOpts,
  ZRangeOpts,
  ZRemOpts,
  ZRevRangeOpts,
} from './RedisClient.types';

export class RedisClient {
  private client: Redis;
  private streamInitialized = false;

  constructor() {
    if (!process.env.REDIS_URL) {
      throw new Error('REDIS_URL is not set');
    }

    this.client = new Redis(process.env.REDIS_URL);
  }

  private getConsumerId() {
    return `consumer-${process.pid}`;
  }

  async sendMessage({ stream, message }: SendMessageOpts) {
    return await this.client.xadd(stream, XAddTokens.ID, XAddTokens.MESSAGE, JSON.stringify(message));
  }

  async readMessage({ group }: ReadMessageOpts) {
    if (!this.streamInitialized) {
      try {
        // NOTE: Create a new consumer group if it doesn't exist
        await this.client.xgroup(
          XGroupOpts.CREATE,
          Streams.RSS_STREAM,
          group,
          GroupDeliveryOpts.ALL,
          XGroupOpts.MKSTREAM,
        );
      } catch (err: unknown) {
        if (err instanceof Error && !err.message.includes('BUSYGROUP')) {
          throw err;
        }
      } finally {
        this.streamInitialized = true;
      }
    }

    const readResponse = await this.client.xreadgroup(
      XReadTokens.GROUP,
      group,
      this.getConsumerId(),
      XReadTokens.COUNT,
      // NOTE: Number of messages to read
      '1',
      XReadTokens.BLOCK,
      // NOTE: Read until new messages are available
      '0',
      XReadTokens.STREAMS,
      Streams.RSS_STREAM,
      GroupDeliveryOpts.LATEST,
    );

    const parsedReadResponse = readResponseSchema.parse(readResponse);
    return parsedReadResponse[0];
  }

  async zadd({ key, items }: ZAddOpts) {
    await this.client.zadd(key, ...items.map((item) => [item.score, item.member]).flat());
  }

  async set({ key, value }: SetOpts) {
    await this.client.set(key, value);
  }

  async del(key: string) {
    await this.client.del(key);
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async zrange({ key, start, stop }: ZRangeOpts) {
    return await this.client.zrange(key, start, stop);
  }

  async zrevrange({ key, start, stop }: ZRevRangeOpts) {
    return await this.client.zrevrange(key, start, stop);
  }

  async zrangebyscore({ key, min, max }: ZRangeByScoreOpts) {
    return await this.client.zrangebyscore(key, min, max);
  }

  async zrem({ key, members }: ZRemOpts) {
    return await this.client.zrem(key, members);
  }
}

const redisClient = new RedisClient();

export { redisClient };
