export type RssSchedulerTask = {
  name: string;
  run: () => Promise<void>;
  schedule: string;
};
