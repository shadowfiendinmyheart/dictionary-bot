import { Scenes } from 'telegraf';

const welcomeScene = new Scenes.BaseScene<Scenes.SceneContext>('welcome');

welcomeScene.enter((ctx) => {
  ctx.reply('Welcome сцена');
});

welcomeScene.on('message', (ctx) => {
  ctx.reply('work in progress . . .');
});

export default welcomeScene;
