import { rssScheduler } from './scheduler';
import { logger } from '@common-rss/shared';

const main = async () => {
  rssScheduler.scheduleJobs();
  logger.info('RSS scheduler started');
};

main();
