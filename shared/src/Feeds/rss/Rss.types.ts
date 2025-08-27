import { z } from 'zod';

export const textNode = z.object({
  '#text': z.string(),
});

export const enclosureNode = z.object({
  '@_url': z.string(),
});

export const rssItem = z.object({
  title: textNode,
  description: textNode.optional(),
  link: textNode,
  guid: textNode,
  category: z.array(textNode).optional(),
  pubDate: textNode,
  enclosure: enclosureNode.optional(),
});

export type RssItem = z.infer<typeof rssItem>;

export const rssXmlResponse = z.object({
  rss: z.object({
    channel: z.object({
      item: z.array(rssItem),
    }),
  }),
});
