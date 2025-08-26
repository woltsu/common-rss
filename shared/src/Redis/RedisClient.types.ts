export enum XReadTokens {
  GROUP = 'GROUP',
  COUNT = 'COUNT',
  BLOCK = 'BLOCK',
  STREAMS = 'STREAMS',
}

export enum GroupDeliveryOpts {
  /**
   * Read all new messages
   */
  'LATEST' = '>',
  /**
   * Read all messages
   */
  'ALL' = '0',
}

export enum XGroupOpts {
  /**
   * Create a new consumer group
   */
  CREATE = 'CREATE',
  /**
   * Create a new stream if it doesn't exist
   */
  MKSTREAM = 'MKSTREAM',
}

export enum Streams {
  RSS_STREAM = 'rss-stream',
}

export enum ConsumerGroups {
  RSS_GROUP = 'rss-group',
}

export type SendMessageOpts = {
  stream: Streams;
  message: string;
};

export type ReadMessageOpts = {
  group: ConsumerGroups;
};
