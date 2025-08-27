import { logger } from '../logger';
import { redisClient, RedisSortedSets } from '../Redis';
import { Feed, FeedItem, FeedType } from './feeds.types';
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

      let feedItems: FeedItem[] = [];

      if (feed.type === FeedType.RSS) {
        feedItems = await parseRss(feedText);
        logger.info(`Parsed RSS feed ${feed.source}`, { nItems: feedItems.length });
      }

      await Promise.allSettled(
        feedItems.map(async (feedItem) => {
          await redisClient.set({
            key: `${RedisSortedSets.RSS_ITEMS}:${feedItem.id}`,
            value: JSON.stringify(feedItem),
          });
        }),
      );

      await redisClient.zadd({
        key: RedisSortedSets.RSS_ITEMS,
        items: feedItems.map((feedItem) => ({
          score: new Date(feedItem.pubDate).getTime(),
          member: feedItem.id,
        })),
      });

      logger.info(`Updated feed ${feed.source}`, { feedItems });
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
