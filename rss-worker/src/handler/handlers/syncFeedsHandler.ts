import { logger } from '@common-rss/shared';
import { RssHandler } from '../RssHandler.types';

export const syncFeedsHandler: RssHandler = async ({ payload }) => {
  const { source } = payload;

  logger.info(`Syncing feed ${source}`);

  return false;
};
