import { feeds, feedsConfig, logger } from '@common-rss/shared';
import { RssHandler } from '../RssHandler.types';

export const syncFeedsHandler: RssHandler = async ({ payload }) => {
  const { source } = payload;
  const feed = feedsConfig[source];

  logger.info(`Syncing feed ${source}`);

  if (!feed) {
    logger.error(`Feed ${source} not found`);
    return false;
  }

  await feeds.updateFeed(feed);
  return true;
};
