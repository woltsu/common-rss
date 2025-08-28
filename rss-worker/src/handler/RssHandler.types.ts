import { RedisMessage } from '@common-rss/shared';

export type RssHandler<T extends RedisMessage> = (message: T) => Promise<boolean>;
