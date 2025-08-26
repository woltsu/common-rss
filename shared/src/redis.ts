import Redis from 'ioredis';

if (!process.env.REDIS_URL) {
  throw new Error('REDIS_URL is not set');
}

const redis = new Redis(process.env.REDIS_URL);

type SendMessageOpts = {
  channel: string;
  message: string;
};

export const sendMessage = async ({ channel, message }: SendMessageOpts) => {
  return await redis.xadd(channel, '*', 'message', message);
};

type GetMessageOpts = {
  channel: string;
};

export const getMessage = async ({ channel }: GetMessageOpts) => {
  try {
    await redis.xgroup('CREATE', channel, 'default', '0', 'MKSTREAM');
  } catch (err: any) {
    if (!err.message.includes('BUSYGROUP')) {
      throw err;
    }
  }

  return await redis.xreadgroup('GROUP', 'default', 'consumer', 'COUNT', '1', 'BLOCK', '0', 'STREAMS', channel, '>');
};
