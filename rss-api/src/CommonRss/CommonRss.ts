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
    const siteDomain = process.env.SITE_DOMAIN;

    if (!siteDomain) {
      throw new Error('SITE_DOMAIN is not set');
    }

    this.feed = new Feed({
      title: 'Common RSS',
      description: 'News RSS feed from various sources',
      id: siteDomain,
      link: `${siteDomain}/rss`,
      copyright: 'Olli Warro 2025',
      updated: new Date(),
    });

    feedItems.forEach((feedItem) => {
      const item: Item = {
        title: feedItem.title,
        date: new Date(feedItem.pubDate),
        link: feedItem.link,
        guid: feedItem.id,
        image: {
          url: 'data:image/png;base64,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',
        },
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
