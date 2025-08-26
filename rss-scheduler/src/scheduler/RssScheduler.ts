import cron from 'node-cron';
import { redisClient, Streams } from 'shared/src';

class RssScheduler {
  public scheduleJobs() {
    cron.schedule('* * * * * *', async () => {
      await redisClient.sendMessage({
        stream: Streams.RSS_STREAM,
        message: {
          type: 'hello-world',
          payload: 'Hello, world!',
        },
      });
    });
  }
}

const rssScheduler = new RssScheduler();
export { rssScheduler };
