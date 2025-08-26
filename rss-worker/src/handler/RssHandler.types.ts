import { RedisMessage } from '@common-rss/shared';

export type RssHandler = (message: RedisMessage) => Promise<boolean>;

/* export type RssHandlers = Record<RedisMessage['type'], RssHandler>; */
