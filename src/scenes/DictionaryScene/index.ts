import { Scenes, Markup } from 'telegraf';

import { unexceptedUserInputHandler } from '../../utils/sceneHandler';

const dictionaryScene = new Scenes.BaseScene<Scenes.SceneContext>('dictionary');

dictionaryScene.enter((ctx) => {
  ctx.reply(
    'Dictionary scene!',
    Markup.keyboard([['Основной словарь', 'Черновой словарь']]).resize(true)
  );
});

dictionaryScene.hears('Основной словарь', (ctx) => {
  ctx.reply('Основной словарь');
});

dictionaryScene.hears('Черновой словарь', (ctx) => {
  ctx.reply('Черновой словарь');
});

dictionaryScene.on('text', (ctx) => {
  ctx.reply('Попробуй воспользоваться кнопками из меню :)');
});

unexceptedUserInputHandler(dictionaryScene);

export default dictionaryScene;
