import { logger, RedisMessage } from '@common-rss/shared';
import { match } from 'ts-pattern';
import { syncFeedsHandler } from './syncFeedsHandler';
import { expireItemsHandler } from './expireItemsHandler';

export const handleTask = async (message: RedisMessage): Promise<boolean> => {
  logger.info(`Handling message: ${message.type}`);

  return match(message)
    .with({ type: 'sync-feed' }, syncFeedsHandler)
    .with({ type: 'item-expiry' }, expireItemsHandler)
    .exhaustive();
};
