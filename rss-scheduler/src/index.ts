import { rssScheduler } from './scheduler';
import { logger } from 'shared/src';

const main = async () => {
  rssScheduler.scheduleJobs();
  logger.info('RSS scheduler started');
};

main();
