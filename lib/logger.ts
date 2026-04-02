import { Logtail } from '@logtail/node';

const logger = process.env.LOGTAIL_TOKEN
  ? new Logtail(process.env.LOGTAIL_TOKEN)
  : null;

export async function logError(message: string, context?: Record<string, unknown>) {
  console.error(message, context);
  if (logger) {
    await logger.error(message, context);
    await logger.flush();
  }
}

export async function logInfo(message: string, context?: Record<string, unknown>) {
  console.log(message, context);
  if (logger) {
    await logger.info(message, context);
    await logger.flush();
  }
}
