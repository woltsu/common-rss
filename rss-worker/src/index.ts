import { logger, redisClient } from 'shared/src';
import cron from 'node-cron';
import { ConsumerGroups } from 'shared/src';

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
