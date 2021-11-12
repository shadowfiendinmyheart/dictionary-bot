import 'dotenv/config';
import { Telegraf, session, Scenes } from 'telegraf';
import { stopLoadingInlineButton } from './middlewares/inlineKeyboardMiddleware';

import { debugLogger } from './middlewares/logger';

import authScene from './scenes/AuthScene';
import homeScene from './scenes/HomeScene';
import wordScene from './scenes/WordScene';
import dictionaryScene from './scenes/DictionaryScene';

if (!process.env.BOT_TOKEN) {
  throw new Error('BOT_TOKEN must be provided!');
}

const bot = new Telegraf<Scenes.SceneContext>(process.env.BOT_TOKEN as string);
const stage = new Scenes.Stage<Scenes.SceneContext>([
  authScene,
  homeScene,
  wordScene,
  dictionaryScene,
]);

bot.use(debugLogger);
bot.use(stopLoadingInlineButton);
bot.use(session());
bot.use(stage.middleware());

bot.start(async (ctx) => {
  await ctx.reply('Добро пожаловать');
  // на время разработки
  ctx.scene.enter('auth');
});

bot.on('message', async (ctx) => {
  ctx.scene.enter('auth');
});

bot.launch();

console.log('working . . .');

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
