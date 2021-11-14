import { API_URL } from '../../const';
import http from '../../utils/http';
import { IWord } from '../DictionaryScene/utils';

// TODO: прикрутить картинки
export const getCards = async (ctx: any) => {
  try {
    const requestCards = await http(
      API_URL + 'words/getRandomWords?counterFilter=10&count=10&checkDate=0',
      'GET',
      null,
      {
        Authorization: `Bearer ${ctx.session.accessToken}`,
      }
    );

    const cards: IWord[] = requestCards.message.map((reqCard: IWord) => {
      return {
        word: reqCard.word,
        translations: reqCard.translations[0],
      };
    });

    return cards;
  } catch (e) {
    console.log(e);
    await ctx.reply('Произошла ошибка');
  }
};
