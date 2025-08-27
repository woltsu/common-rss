import { Feed, FeedType } from './feeds.types';

export const feedsConfig: Record<string, Feed> = {
  hs: {
    source: 'https://www.hs.fi/rss/tuoreimmat.xml',
    name: 'Helsingin Sanomat',
    type: FeedType.RSS,
  },
  yle: {
    source: 'https://yle.fi/rss/uutiset/tuoreimmat',
    name: 'YLE',
    type: FeedType.RSS,
  },
  is: {
    source: 'https://www.is.fi/rss/tuoreimmat.xml',
    name: 'Ilta-Sanomat',
    type: FeedType.RSS,
  },
};
