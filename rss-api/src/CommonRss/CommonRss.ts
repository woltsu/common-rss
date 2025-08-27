import { feeds, logger } from '@common-rss/shared';
import { Feed } from 'feed';
import cron from 'node-cron';

class CommonRss {
  private feed: Feed | null = null;

  constructor() {
    cron.schedule(
      '*/5 * * * *',
      async () => {
        logger.info('Re-building feed...');
        await this.buildFeed();
        logger.info('Feed re-built');
      },
      {
        noOverlap: true,
      },
    );
  }

  async buildFeed() {
    const feedItems = await feeds.getFeedItems();

    this.feed = new Feed({
      title: 'Common RSS',
      description: 'News RSS feed from various sources',
      /* TODO: Update this to correct value */
      id: 'https://common-rss.com',
      /* TODO: Update this to correct value */
      link: 'https://common-rss.com',
      copyright: 'Olli Warro 2025',
      updated: new Date(),
    });

    feedItems.forEach((feedItem) => {
      this.feed?.addItem({
        title: feedItem.title,
        date: new Date(feedItem.pubDate),
        link: feedItem.link,
        description: feedItem.description ?? '',
        guid: feedItem.id,
      });
    });
  }

  getFeed() {
    if (!this.feed) {
      throw new Error('Feed not initialized');
    }

    return this.feed.rss2();
  }
}

const commonRss = new CommonRss();

export { commonRss };
