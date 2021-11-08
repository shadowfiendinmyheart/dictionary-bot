import { Markup } from 'telegraf';
import { userDataType } from '.';

export const authKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('Логин', 'login'),
    Markup.button.callback('Пароль', 'password'),
  ],
  [Markup.button.callback('Авторизоваться', 'makeAuth')],
]);

export const allowText = (userData: userDataType) => {
  return `<b>Принято!</b>\nЛогин: <i>${
    userData.authLogin
  }</i>\nПароль: ${'*'.repeat(userData.authPassword.length)}`;
};
