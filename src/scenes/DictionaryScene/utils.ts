import { Markup, Scenes } from 'telegraf';
import { IPagination } from '.';
import { API_URL } from '../../const';
import http from '../../utils/http';

export interface IWord {
  word: string;
  translations: string;
}

export enum typeOfDictionary {
  mainDictionary = 'getWordsList',
  draftDictionary = 'getDraftList',
}

export const dictionaryKeyboard = Markup.inlineKeyboard([
  [Markup.button.callback('Основной словарь', 'mainDictionary')],
  [Markup.button.callback('Черновой словарь', 'draftDictionary')],
  [Markup.button.callback('Найти слово', 'find')],
  [Markup.button.callback('Назад', 'home')],
]);

export const getDictionary = async (
  ctx: any,
  dictionary: typeOfDictionary,
  numberOfPage: number
) => {
  const request = await http(
    API_URL + `words/${dictionary}?page=${numberOfPage}&mode=0`,
    'GET',
    null,
    { Authorization: `Bearer ${ctx.session.accessToken}` }
  );

  const words = request.words.map((word: IWord) => {
    return {
      word: word.word,
      translations: word.translations,
    };
  });

  return {
    status: request.status,
    words,
    pagesTotal: request.pagesTotal,
  };
};

export const getKeyboard = async (
  ctx: any,
  pagination: number,
  maxPagination: number
) => {
  if (pagination === 1 && maxPagination === 1) {
    await ctx.reply(
      `${pagination} страница`,
      Markup.keyboard([['В меню']]).resize(true)
    );
    return;
  }

  if (pagination === 1) {
    await ctx.reply(
      `${pagination} страница`,
      Markup.keyboard([['Следующая страница'], ['В меню']]).resize(true)
    );
    return;
  }

  if (pagination < maxPagination) {
    await ctx.reply(
      `${pagination} страница`,
      Markup.keyboard([
        ['Предыдущая страница', 'Следующая страница'],
        ['В меню'],
      ]).resize(true)
    );
    return;
  }

  if (pagination === maxPagination) {
    await ctx.reply(
      `${pagination} страница`,
      Markup.keyboard([['Предыдущая страница'], ['В меню']]).resize(true)
    );
  }
};

export const showWordPage = async (
  ctx: any,
  dictionary: 'mainDictionary' | 'draftDictionary',
  pagination: IPagination
) => {
  const dictionaryReqest = await getDictionary(
    ctx,
    typeOfDictionary[dictionary],
    pagination[dictionary]
  );

  pagination.maxMainDictionary = dictionaryReqest.pagesTotal;
  const max =
    dictionary === 'mainDictionary'
      ? pagination.maxMainDictionary
      : pagination.maxDraftDictionary;
  getKeyboard(ctx, pagination[dictionary], max);

  await showWordList(ctx, dictionaryReqest.words, pagination[dictionary]);
};

const getNumberOfPagination = (page: number, wordNumber: number) => {
  if (page === 1) return wordNumber + 1;
  if (wordNumber === 9) return String(page) + 0;
  if (page > 1) return String(page - 1) + (wordNumber + 1);
};

export const showWordList = async (
  ctx: Scenes.SceneContext<Scenes.SceneSessionData>,
  words: IWord[],
  numberOfPage: number
) => {
  for (const [index, word] of Object.entries<IWord>(words)) {
    await ctx.replyWithHTML(
      `${getNumberOfPagination(numberOfPage, Number(index))}: <b>${
        word.word
      }</b>\n${word.translations[0]}`
    );
  }
};

export const getWord = async (ctx: any, word: string) => {
  const request = await http(
    API_URL + `words/getWord?reqWord=${word}`,
    'GET',
    null,
    { Authorization: `Bearer ${ctx.session.accessToken}` }
  );

  return {
    status: request.status,
    message: request.message,
  };
};
