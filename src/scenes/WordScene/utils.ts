import { Markup } from 'telegraf';
import { API_URL } from '../../const';
import http from '../../utils/http';

export const wordKeyboard = Markup.inlineKeyboard([
  [Markup.button.callback('Добавить слово', 'addWord')],
  [Markup.button.callback('Удалить слово', 'deleteWord')],
]);

export const addWordInDictionary = async (ctx: any, word: string) => {
  const checkWord = await http(
    API_URL + `words/getEngWord?reqWord=${word}`,
    'GET',
    null,
    {
      Authorization: `Bearer ${ctx.session.accessToken}`,
    }
  );

  if (checkWord?.message.translations?.length > 0) {
    return {
      status: checkWord.status,
      message: `У вас уже есть такое слово:\nСлово: <i>${checkWord?.message.word}</i>\nПеревод: ${checkWord?.message.translations[0]}`,
    };
  }

  // TODO: показать перевод слова
  const translations = await http(
    API_URL + `words/translate?word=${word}`,
    'GET',
    null,
    {
      Authorization: `Bearer ${ctx.session.accessToken}`,
    }
  );

  const addWord = await http(
    API_URL + `words/addDraftWord`,
    'POST',
    {
      reqWord: word,
      reqTranslation: translations.message,
    },
    {
      Authorization: `Bearer ${ctx.session.accessToken}`,
    }
  );

  if (addWord.status != 201)
    return {
      status: addWord.status,
      message: addWord.message,
    };

  return {
    status: addWord.status,
    word,
    translations: translations.message,
  };
};

export const deleteWordFromDictionary = async (ctx: any, word: string) => {
  const response = await http(
    API_URL + `words/deleteDraftWord`,
    'POST',
    {
      reqWord: word,
    },
    {
      Authorization: `Bearer ${ctx.session.accessToken}`,
    }
  );

  console.log('response', response);

  return {
    status: response.status,
  };
};
