import sanitizeHtml from 'sanitize-html';
import { parse } from 'node-html-parser';
import { logger } from '../logger';

type FetchCleanedHtmlOptions = {
  selector: string;
};

export const fetchCleanedHtml = async (url: string, options: FetchCleanedHtmlOptions) => {
  const response = await fetch(url);
  const html = await response.text();

  const root = parse(html);

  const body = root.querySelector(options.selector);
  const actualHtml = body?.innerHTML;

  if (!actualHtml) {
    logger.warn(`No body found in HTML for ${url} with selector ${options.selector}`);
    return '';
  }

  const cleanedHtml = sanitizeHtml(actualHtml, {
    allowedTags: [
      'address',
      'article',
      'aside',
      'footer',
      'header',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'hgroup',
      'main',
      'nav',
      'section',
      'blockquote',
      'dd',
      'div',
      'dl',
      'dt',
      'figcaption',
      'figure',
      'hr',
      'li',
      'main',
      'ol',
      'p',
      'pre',
      'ul',
      'a',
      'abbr',
      'b',
      'bdi',
      'bdo',
      'br',
      'cite',
      'code',
      'data',
      'dfn',
      'em',
      'i',
      'kbd',
      'mark',
      'q',
      'rb',
      'rp',
      'rt',
      'rtc',
      'ruby',
      's',
      'samp',
      'small',
      'span',
      'strong',
      'sub',
      'sup',
      'time',
      'u',
      'var',
      'wbr',
      'caption',
      'col',
      'colgroup',
      'table',
      'tbody',
      'td',
      'tfoot',
      'th',
      'thead',
      'tr',
      'img',
    ],
    nonBooleanAttributes: [],
    allowedAttributes: {
      a: ['href', 'name', 'target'],
      img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading'],
    },
    selfClosing: ['img', 'br', 'hr', 'area', 'base', 'basefont', 'input', 'link', 'meta'],
    allowedSchemes: ['http', 'https', 'ftp', 'mailto', 'tel'],
    allowedSchemesByTag: {},
    allowedSchemesAppliedToAttributes: ['href', 'src', 'cite'],
    allowProtocolRelative: true,
    enforceHtmlBoundary: true,
    parseStyleAttributes: true,
  });

  return cleanedHtml;
};
