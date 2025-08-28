import { ItemExpiryMessage, logger, redisClient, RedisSortedSets } from '@common-rss/shared';
import { subWeeks } from 'date-fns';
import { RssHandler } from '../RssHandler.types';

export const expireItemsHandler: RssHandler<ItemExpiryMessage> = async () => {
  const weekAgo = subWeeks(Date.now(), 1);

  const itemsToDelete = await redisClient.zrangebyscore({
    key: RedisSortedSets.RSS_ITEMS,
    min: 0,
    max: weekAgo.getTime(),
  });

  if (!itemsToDelete.length) {
    logger.info('No items to delete');
    return true;
  }

  await Promise.all(itemsToDelete.map((item) => redisClient.del(`${RedisSortedSets.RSS_ITEMS}:${item}`)));

  await redisClient.zrem({
    key: RedisSortedSets.RSS_ITEMS,
    members: itemsToDelete,
  });

  logger.info(`Deleted ${itemsToDelete.length} items`);
  return true;
};
