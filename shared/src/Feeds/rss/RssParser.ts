import { FeedParser } from '../feeds.types';
import { rssXmlResponse } from './Rss.types';
import { parseXml } from '../xml';

export const parseRss: FeedParser = async (xml: string) => {
  const parsedXml = parseXml(xml);
  const parsedXmlSchema = rssXmlResponse.parse(parsedXml);

  return parsedXmlSchema.rss.channel.item.map((item) => ({
    id: item.guid,
    title: item.title,
    description: item.description,
    link: item.link,
    pubDate: item.pubDate,
  }));
};
