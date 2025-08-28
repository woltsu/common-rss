import { logger } from '../logger';
import { redisClient, RedisSortedSets } from '../Redis';
import { Feed, FeedItem, FeedType } from './feeds.types';
import { fetchCleanedHtml } from './html';
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

      const feedItemsWithContent = await Promise.all(
        feedItems.map(async (feedItem) => {
          if (feedItem.link) {
            try {
              const html = await fetchCleanedHtml(feedItem.link, {
                selector: feed.contentSelector,
              });

              feedItem.description = html;
            } catch (error) {
              logger.error(`Failed to fetch page content for ${feedItem.link}`, { error });
            }
          }
          return feedItem;
        }),
      );

      await Promise.allSettled(
        feedItemsWithContent.map(async (feedItem) => {
          await redisClient.set({
            key: `${RedisSortedSets.RSS_ITEMS}:${feedItem.id}`,
            value: JSON.stringify(feedItem),
          });
        }),
      );

      await redisClient.zadd({
        key: RedisSortedSets.RSS_ITEMS,
        items: feedItemsWithContent.map((feedItem) => ({
          score: new Date(feedItem.pubDate).getTime(),
          member: feedItem.id,
        })),
      });

      logger.info(`Updated feed ${feed.source}`);
    } catch (error) {
      logger.error(`Failed to fetch feed ${feed.source}`, { error });
      return false;
    } finally {
      clearTimeout(fetchTimeout);
    }

    return true;
  }

  async getFeedItems(): Promise<FeedItem[]> {
    const feedItemIds = await redisClient.zrevrange({
      key: RedisSortedSets.RSS_ITEMS,
      start: 0,
      stop: 999,
    });

    // Get all feed item data from Redis
    const feedItemsData = await Promise.allSettled(
      feedItemIds.map(async (feedItemId) => {
        const feedItemData = await redisClient.get(`${RedisSortedSets.RSS_ITEMS}:${feedItemId}`);
        return feedItemData ? (JSON.parse(feedItemData) as FeedItem) : null;
      }),
    );

    // Filter out failed retrievals and null values
    return feedItemsData
      .filter(
        (result): result is PromiseFulfilledResult<FeedItem> => result.status === 'fulfilled' && result.value !== null,
      )
      .map((result) => result.value);
  }
}

export const feeds = new Feeds();
