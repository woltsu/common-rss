import { logger } from '../logger';
import { Feed, FeedType } from './feeds.types';
import { parseRss } from './rss/RssParser';

const FETCH_TIMEOUT = 30_000 as const;

class Feeds {
  async updateFeed(feed: Feed) {
    const fetchAbortController = new AbortController();

    const fetchTimeout = setTimeout(() => {
      fetchAbortController.abort();
    }, FETCH_TIMEOUT);

    try {
      const feedResult = await fetch(feed.source, {
        signal: fetchAbortController.signal,
      });

      if (!feedResult.ok) {
        throw new Error(`Failed to fetch feed ${feed.source}`);
      }

      const feedText = await feedResult.text();

      if (feed.type === FeedType.RSS) {
        const feedItems = await parseRss(feedText);
        logger.info(`Parsed RSS feed ${feed.source}`, { feedItems });

        // TODO: Save feed items into Redis
      }
    } catch (error) {
      logger.error(`Failed to fetch feed ${feed.source}`, { error });
      return false;
    } finally {
      clearTimeout(fetchTimeout);
    }

    return true;
  }
}

export const feeds = new Feeds();
