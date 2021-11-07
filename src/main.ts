import 'dotenv/config';
import { Telegraf, session, Scenes } from 'telegraf';

import { debugLogger } from './middlewares/logger';

import welcomeScene from './scenes/WelcomeScene';

if (!process.env.BOT_TOKEN) {
  throw new Error('BOT_TOKEN must be provided!');
}

const bot = new Telegraf<Scenes.SceneContext>(process.env.BOT_TOKEN as string);

const stage = new Scenes.Stage<Scenes.SceneContext>([welcomeScene]);

bot.use(session());
bot.use(debugLogger);
bot.use(stage.middleware());

bot.start(async (ctx) => {
  ctx.reply('Добро пожаловать');
  ctx.scene.enter('welcome');
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
