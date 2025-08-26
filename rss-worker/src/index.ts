import { getMessage, logger } from 'shared/src';
import cron from 'node-cron';

const main = async () => {
  cron.schedule(
    '* * * * * *',
    async () => {
      const messages = await getMessage({ channel: 'test' });
      logger.info(messages);
    },
    {
      noOverlap: true,
    },
  );
};

main();
