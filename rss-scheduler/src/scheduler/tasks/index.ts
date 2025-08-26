import { RssSchedulerTask } from '../RssScheduler.types';
import { syncFeeds } from './syncFeedsTask';

const tasks: RssSchedulerTask[] = [syncFeeds];

export { tasks };
