import { Markup, Scenes } from 'telegraf';

import { unexceptedUserInputHandler } from '../../utils/sceneHandler';
import {
  dictionaryKeyboard,
  getDictionary,
  getWord,
  showWordList,
  showWordPage,
  typeOfDictionary,
  getKeyboard,
} from './utils';

import { IPagination } from '../../types/interfaces';

enum InputMode {
  MainDictionary,
  DraftDictionary,
  FindWord,
  Default,
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

dictionaryScene.action('find', async (ctx) => {
  inputMode = InputMode.FindWord;
  await ctx.reply('Введите слово, которое нужно найти:');
});

dictionaryScene.action('home', async (ctx) => {
  inputMode = InputMode.Default;
  pagination.mainDictionary = 1;
  pagination.maxMainDictionary = 1;
  pagination.draftDictionary = 1;
  pagination.maxDraftDictionary = 1;

  await ctx.reply('Возвращаюсь...', Markup.removeKeyboard());
  await ctx.scene.enter('home');
});

dictionaryScene.hears('Следующая страница', async (ctx) => {
  switch (inputMode) {
    case InputMode.MainDictionary: {
      if (pagination.mainDictionary < pagination.maxMainDictionary) {
        pagination.mainDictionary++;
        await showWordPage(ctx, 'mainDictionary', pagination);
        break;
      }
      await ctx.reply('Ошибочка вышла, упс');
      break;
    }
    case InputMode.DraftDictionary: {
      if (pagination.draftDictionary < pagination.maxDraftDictionary) {
        pagination.draftDictionary++;
        await showWordPage(ctx, 'draftDictionary', pagination);
        break;
      }
      await ctx.reply('Ошибочка вышла, упс');
      break;
    }
  }
});

dictionaryScene.hears('Предыдущая страница', async (ctx) => {
  switch (inputMode) {
    case InputMode.MainDictionary: {
      if (pagination.mainDictionary > 1) {
        pagination.mainDictionary--;
        await showWordPage(ctx, 'mainDictionary', pagination);
        break;
      }
      await ctx.reply('Ошибочка вышла, упс');
      break;
    }
    case InputMode.DraftDictionary: {
      if (pagination.draftDictionary > 1) {
        pagination.draftDictionary--;
        await showWordPage(ctx, 'draftDictionary', pagination);
        break;
      }
      await ctx.reply('Ошибочка вышла, упс');
      break;
    }
    default: {
      await ctx.reply('Не понимаю тебя');
    }
  }
});

dictionaryScene.hears('В меню', async (ctx) => {
  inputMode = InputMode.Default;
  pagination.mainDictionary = 1;
  pagination.maxMainDictionary = 1;
  pagination.draftDictionary = 1;
  pagination.maxDraftDictionary = 1;

  await ctx.reply('Возвращаюсь...', Markup.removeKeyboard());
  await ctx.reply('Меню', dictionaryKeyboard);
});

dictionaryScene.on('text', async (ctx) => {
  switch (inputMode) {
    case InputMode.MainDictionary: {
      const page = Number(ctx.message.text);
      if (Number(page) > 0 && Number(page) <= pagination.maxMainDictionary) {
        pagination.mainDictionary = page;
        await getKeyboard(ctx, page, pagination.maxMainDictionary);
        const dictionaryPage = await getDictionary(
          ctx,
          typeOfDictionary.mainDictionary,
          page
        );
        await showWordList(ctx, dictionaryPage.words, page);
      } else {
        await ctx.reply('Что-то пошло не так...');
      }
      break;
    }
    case InputMode.DraftDictionary: {
      const page = Number(ctx.message.text);
      if (Number(page) > 0 && Number(page) <= pagination.maxDraftDictionary) {
        pagination.draftDictionary = page;
        await getKeyboard(ctx, page, pagination.draftDictionary);
        const dictionaryPage = await getDictionary(
          ctx,
          typeOfDictionary.draftDictionary,
          page
        );
        await showWordList(ctx, dictionaryPage.words, page);
      } else {
        await ctx.reply('Что-то пошло не так...');
      }
      break;
    }
    case InputMode.FindWord: {
      const userWord: string = ctx.message.text;
      const wordRequest = await getWord(ctx, userWord);

      if (wordRequest.status !== 200) {
        await ctx.replyWithHTML(`Произошла ошибка:\n${wordRequest.message}`);
        break;
      }

      await ctx.replyWithHTML(
        `<b>${wordRequest.message.word}</b>\n${wordRequest.message.translations[0]}`,
        Markup.keyboard([['В меню']]).resize(true)
      );
      break;
    }
    default: {
      await ctx.reply('Не понимаю тебя...');
    }
  }
});

unexceptedUserInputHandler(dictionaryScene);

export default dictionaryScene;
