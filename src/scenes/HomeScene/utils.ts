import { Markup } from 'telegraf';

export const homeKeyboard = Markup.inlineKeyboard([
  [Markup.button.callback('Добавить/удалить слово', 'word')],
  [Markup.button.callback('Посмотреть словарик', 'dictionary')],
  [Markup.button.callback('Возможно игра ? ? ?', 'game')],
  [Markup.button.callback('Выйти', 'logout')],
]);
