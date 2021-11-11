import { Markup } from 'telegraf';
import { API_URL } from '../../const';
import http from '../../utils/http';

export const addWordKeyboard = Markup.inlineKeyboard([
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
    await ctx.replyWithHTML(`У вас уже есть такое слово:\nСлово: <i>${checkWord?.message.word}</i>\nПеревод: ${checkWord?.message.translations[0]}`);
    return false;
  }

  // TODO: показать перевод слова

  const addWord = await http(
    API_URL + `words/addWord`,
    'POST',
    {
        reqWord: word,
        reqImageURL: 'mock'
    },
    {
      Authorization: `Bearer ${ctx.session.accessToken}`,
    }
  );
  console.log(addWord);
  return true;
}
