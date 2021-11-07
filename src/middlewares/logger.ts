import { Context } from 'telegraf';

import { callbackFunction } from '../types/functions';

export const debugLogger = async (ctx: Context, next: callbackFunction) => {
  console.log('New message:', ctx.message);
  next();
};
