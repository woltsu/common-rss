import cron from 'node-cron';
import { sendMessage } from 'shared/src';

class RssScheduler {
  public scheduleJobs() {
    cron.schedule('* * * * *', async () => {
      await sendMessage({ channel: 'test', message: 'Hello, world!' });
    });
  }
}

const rssScheduler = new RssScheduler();
export { rssScheduler };
