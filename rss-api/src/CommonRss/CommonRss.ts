import { feeds, logger } from '@common-rss/shared';
import { Feed, Item } from 'feed';
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
      const item: Item = {
        title: feedItem.title,
        date: new Date(feedItem.pubDate),
        link: feedItem.link,
        guid: feedItem.id,
      };

      if (feedItem.enclosure) {
        item.enclosure = {
          url: feedItem.enclosure,
        };
      }

      if (feedItem.description) {
        item.description = feedItem.description;
      }

      this.feed?.addItem(item);
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
