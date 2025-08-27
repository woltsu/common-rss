import { feedsConfig, logger, redisClient, Streams } from '@common-rss/shared';
import { RssSchedulerTask } from '../RssScheduler.types';

export const syncFeeds: RssSchedulerTask = {
  name: 'syncFeeds',
  run: async () => {
    const sources = Object.keys(feedsConfig);

    for (const source of sources) {
      logger.info(`Syncing feed ${source}`);

      await redisClient.sendMessage({
        stream: Streams.RSS_STREAM,
        message: {
          type: 'sync-feed',
          payload: {
            source,
          },
        },
      });
    }
  },
  schedule: '*/10 * * * *', // NOTE: Every 10 minutes
};
