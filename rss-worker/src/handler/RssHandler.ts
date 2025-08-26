import { ConsumerGroups, logger, redisClient, RedisMessage, sleep } from '@common-rss/shared';
import { handleTask } from './handlers';

class RssHandler {
  async start() {
    while (true) {
      const msg = await redisClient.readMessage({ group: ConsumerGroups.RSS_GROUP });

      if (msg) {
        logger.info('Received message', msg);
        await handleTask(msg);
      }

      await sleep(1000);
    }
  }
}

const rssHandler = new RssHandler();

export { rssHandler };
