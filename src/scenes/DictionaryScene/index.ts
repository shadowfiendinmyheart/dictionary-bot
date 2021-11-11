import { Markup, Scenes } from 'telegraf';

import { unexceptedUserInputHandler } from '../../utils/sceneHandler';
import { dictionaryKeyboard, showWordPage } from './utils';

enum InputMode {
  MainDictionary,
  DraftDictionary,
  FindWord,
  Default,
}

export interface IPagination {
  mainDictionary: number;
  maxMainDictionary: number;
  draftDictionary: number;
  maxDraftDictionary: number;
}

const pagination: IPagination = {
  mainDictionary: 1,
  maxMainDictionary: 1,
  draftDictionary: 1,
  maxDraftDictionary: 1,
};

let inputMode: InputMode = InputMode.Default;
const dictionaryScene = new Scenes.BaseScene<Scenes.SceneContext>('dictionary');

dictionaryScene.enter(async (ctx) => {
  await ctx.reply('Меню:', dictionaryKeyboard);
});

dictionaryScene.action('mainDictionary', async (ctx) => {
  inputMode = InputMode.MainDictionary;
  await showWordPage(ctx, 'mainDictionary', pagination);
});

dictionaryScene.action('draftDictionary', async (ctx) => {
  inputMode = InputMode.DraftDictionary;
  await showWordPage(ctx, 'draftDictionary', pagination);
});

dictionaryScene.hears('Следующая страница', async (ctx) => {
  switch (inputMode) {
    case InputMode.MainDictionary: {
      pagination.mainDictionary++;
      await showWordPage(ctx, 'mainDictionary', pagination);
      break;
    }
    case InputMode.DraftDictionary: {
      pagination.draftDictionary++;
      await showWordPage(ctx, 'draftDictionary', pagination);
      break;
    }
  }
});

dictionaryScene.hears('В меню', async (ctx) => {
  inputMode = InputMode.Default;
  pagination.mainDictionary = 1;
  pagination.maxMainDictionary = 1;
  pagination.draftDictionary = 1;
  pagination.maxDraftDictionary = 1;

  await ctx.reply('.', Markup.removeKeyboard());
  await ctx.reply('Меню', dictionaryKeyboard);
});

dictionaryScene.on('text', async (ctx) => {
  switch (inputMode) {
    case InputMode.MainDictionary: {
      const page: string = ctx.message.text;

      break;
    }
    case InputMode.DraftDictionary: {
      const page: string = ctx.message.text;

      break;
    }
    case InputMode.FindWord: {
      const word: string = ctx.message.text;

      break;
    }
    default: {
      await ctx.reply('Не понимаю тебя...');
    }
  }
});

unexceptedUserInputHandler(dictionaryScene);

export default dictionaryScene;
