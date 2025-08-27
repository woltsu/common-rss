import { FeedParser } from '../feeds.types';
import { rssXmlResponse } from './Rss.types';
import { parseXml } from '../xml';

export const parseRss: FeedParser = async (xml: string) => {
  const parsedXml = parseXml(xml);
  const parsedXmlSchema = rssXmlResponse.parse(parsedXml);

  return parsedXmlSchema.rss.channel.item.map((item) => {
    return {
      id: item.guid['#text'],
      title: item.title['#text'],
      description: item.description?.['#text'],
      link: item.link['#text'],
      pubDate: item.pubDate['#text'],
      enclosure: item.enclosure?.['@_url'],
    };
  });
};
