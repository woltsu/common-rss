import { Redis } from 'ioredis';
import {
  GroupDeliveryOpts,
  ReadMessageOpts,
  SendMessageOpts,
  Streams,
  XGroupOpts,
  XReadTokens,
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
    return await this.client.xadd(stream, '*', 'message', message);
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

    return await this.client.xreadgroup(
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
  }
}

const redisClient = new RedisClient();

export { redisClient };
