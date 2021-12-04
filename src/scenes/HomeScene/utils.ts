import { Markup } from 'telegraf';

export const homeKeyboard = Markup.inlineKeyboard([
  [Markup.button.callback('Добавить/удалить слово', 'word')],
  [Markup.button.callback('Добавить картинку для слова', 'image')],
  [Markup.button.callback('Посмотреть словарик', 'dictionary')],
  [Markup.button.callback('Слово-перевод игра', 'game')],
  [Markup.button.callback('Выйти', 'logout')],
]);
