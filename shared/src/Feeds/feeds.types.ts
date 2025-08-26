import { z } from 'zod';

export enum FeedType {
  RSS = 'rss',
  ATOM = 'atom',
}

export type Feed = {
  source: string;
  name: string;
  type: FeedType;
};

export type FeedItem = {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
};

export type FeedParser = (xml: string) => Promise<FeedItem[]>;
