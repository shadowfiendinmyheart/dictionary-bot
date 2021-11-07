import 'dotenv/config';
import { Telegraf } from 'telegraf';

if (!process.env.BOT_TOKEN) {
  throw new Error('BOT_TOKEN must be provided!');
}

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => {
  ctx.reply('Welcome');
  ctx.reply(String(ctx.botInfo.id));
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
