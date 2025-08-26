import { logger } from '@common-rss/shared';
import { rssHandler } from './handler';

const main = async () => {
  logger.info('Starting RSS worker');

  rssHandler.start();

  logger.info('RSS worker started');
};

main();
