import 'dotenv/config';
import { Telegraf, session, Scenes } from 'telegraf';
import { stopLoadingInlineButton } from './middlewares/inlineKeyboardMiddleware';

import { debugLogger } from './middlewares/logger';

import authScene from './scenes/AuthScene';
import homeScene from './scenes/HomeScene';

if (!process.env.BOT_TOKEN) {
  throw new Error('BOT_TOKEN must be provided!');
}

const bot = new Telegraf<Scenes.SceneContext>(process.env.BOT_TOKEN as string);
const stage = new Scenes.Stage<Scenes.SceneContext>([authScene, homeScene]);

bot.use(session());
bot.use(stage.middleware());
bot.use(debugLogger);
bot.use(stopLoadingInlineButton);

bot.start(async (ctx) => {
  await ctx.reply('Добро пожаловать');
  // на время разработки
  ctx.scene.enter('auth');
});

bot.on('message', async (ctx) => {
  await ctx.scene.enter('home');
});

bot.command('q', async (ctx) => {
  await ctx.reply('main scene');
});

bot.launch();

console.log('working . . .');

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
