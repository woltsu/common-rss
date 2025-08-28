import { redisClient, Streams } from '@common-rss/shared';
import { RssSchedulerTask } from '../RssScheduler.types';

export const itemExpiry: RssSchedulerTask = {
  name: 'itemExpiry',
  run: async () => {
    await redisClient.sendMessage({
      stream: Streams.RSS_STREAM,
      message: {
        type: 'item-expiry',
      },
    });
  },
  schedule: '0 0 * * *', // NOTE: Every hour
};
