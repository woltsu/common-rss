import { z } from 'zod';

export const rssItem = z.object({
  title: z.string(),
  description: z.string().optional(),
  link: z.string(),
  guid: z.string(),
  category: z.array(z.string()).optional(),
  pubDate: z.string(),
  enclosure: z.string().optional(),
});

export type RssItem = z.infer<typeof rssItem>;

export const rssXmlResponse = z.object({
  rss: z.object({
    channel: z.object({
      item: z.array(rssItem),
    }),
  }),
});
