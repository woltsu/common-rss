import cron from 'node-cron';
import { logger } from 'shared/src';

class RssScheduler {
  public scheduleJobs() {
    cron.schedule('* * * * *', () => {
      logger.info('Running a task every minute');
    });
  }
}

const rssScheduler = new RssScheduler();
export { rssScheduler };
