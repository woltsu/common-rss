import { commonRss } from './CommonRss';
import { server } from './CommonRss/Server';

const main = async () => {
  await commonRss.buildFeed();
  const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  console.log('Starting RSS Server...');
  server.listen(port);
};

main().catch((error) => {
  console.error('Failed to start RSS server:', error);
  process.exit(1);
});
