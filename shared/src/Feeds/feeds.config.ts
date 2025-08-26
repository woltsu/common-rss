import { Feed, FeedType } from './feeds.types';

export const feedsConfig: Record<string, Feed> = {
  hs: {
    source: 'https://www.hs.fi/rss/tuoreimmat.xml',
    name: 'Helsingin Sanomat',
    type: FeedType.RSS,
  },
};
