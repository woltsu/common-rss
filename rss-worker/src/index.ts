import cron from 'node-cron';
import { ConsumerGroups, logger, redisClient } from '@common-rss/shared';

const main = async () => {
  cron.schedule(
    '* * * * * *',
    async () => {
      const msg = await redisClient.readMessage({ group: ConsumerGroups.RSS_GROUP });
      logger.info('Received message', msg);
    },
    {
      noOverlap: true,
    },
  );
};

main();
