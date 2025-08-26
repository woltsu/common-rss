import { RedisMessage } from '@common-rss/shared';

export type RssHandler = (message: RedisMessage) => Promise<boolean>;
