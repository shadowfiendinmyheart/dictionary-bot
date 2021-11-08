import { Scenes } from 'telegraf';

import { homeKeyboard } from './utils';
import { unexceptedUserInputHandler } from '../../utils/sceneHandler';

const homeScene = new Scenes.BaseScene<Scenes.SceneContext>('home');

homeScene.enter((ctx) => {
  ctx.reply('Home scene!', homeKeyboard);
});

homeScene.action('logout', async (ctx) => {
  await ctx.scene.enter('auth');
  await ctx.reply('Вы вышли из аккаунта');
});

homeScene.on('text', (ctx) => {
  ctx.reply('Попробуй воспользоваться кнопками из меню :)');
});

unexceptedUserInputHandler(homeScene);

export default homeScene;
