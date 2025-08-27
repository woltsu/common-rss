import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({
  isArray: (tagName) => {
    // NOTE: RSS feeds can have multiple items and categories
    return tagName === 'item' || tagName === 'category';
  },
  ignoreAttributes: false,
  // NOTE: We want to handle nodes consistently
  alwaysCreateTextNode: true,
});

export const parseXml = (xml: string) => {
  return parser.parse(xml);
};
