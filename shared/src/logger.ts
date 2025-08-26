import winston from 'winston';

const transports = [];

if (process.env.NODE_ENV === 'development') {
  transports.push(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

if (process.env.NODE_ENV === 'production') {
  transports.push(new winston.transports.File({ filename: 'error.log', level: 'error' }));
  transports.push(new winston.transports.File({ filename: 'combined.log' }));
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: process.env.SERVICE_NAME },
  transports,
});

export { logger };