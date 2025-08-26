import { logger } from '@common-rss/shared';
import cron from 'node-cron';
import { tasks } from './tasks';

class RssScheduler {
  public scheduleJobs() {
    tasks.forEach((task) => {
      const scheduledTask = cron.schedule(
        task.schedule,
        async () => {
          await task.run();
        },
        {
          name: task.name,
          noOverlap: true,
          maxRandomDelay: 500,
          timezone: 'Europe/Helsinki',
        },
      );

      scheduledTask.on('execution:started', () => {
        logger.info(`Task ${task.name} started`);
      });

      scheduledTask.on('execution:finished', () => {
        logger.info(`Task ${task.name} finished`);
      });

      scheduledTask.on('execution:failed', (err) => {
        logger.error(`Task ${task.name} failed: ${err}`);
      });

      scheduledTask.on('execution:missed', () => {
        logger.warn(`Task ${task.name} missed`);
      });

      scheduledTask.start();
    });
  }
}

const rssScheduler = new RssScheduler();
export { rssScheduler };
