import { RedisMessage } from '@common-rss/shared';
import { match } from 'ts-pattern';
import { syncFeedsHandler } from './syncFeedsHandler';

export const handleTask = async (message: RedisMessage): Promise<boolean> => {
  return match(message).with({ type: 'sync-feed' }, syncFeedsHandler).exhaustive();
};
