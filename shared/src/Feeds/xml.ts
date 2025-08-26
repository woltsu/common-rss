import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser();

export const parseXml = (xml: string) => {
  return parser.parse(xml);
};
