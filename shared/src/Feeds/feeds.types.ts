export enum FeedType {
  RSS = 'rss',
  ATOM = 'atom',
}

export type Feed = {
  source: string;
  name: string;
  type: FeedType;
  contentSelector: string;
};

export type FeedItem = {
  id: string;
  title: string;
  description: string | undefined;
  link: string;
  pubDate: string;
  enclosure: string | undefined;
};

export type FeedParser = (xml: string) => Promise<FeedItem[]>;
