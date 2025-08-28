import { RssSchedulerTask } from '../RssScheduler.types';
import { syncFeeds } from './syncFeedsTask';
import { itemExpiry } from './itemExpiryTask';

const tasks: RssSchedulerTask[] = [syncFeeds, itemExpiry];

export { tasks };
