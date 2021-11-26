import { Markup } from 'telegraf';
import { IUserData } from '.';
import { API_URL } from '../../const';
import http from '../../utils/http';

export const authKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('Логин', 'login'),
    Markup.button.callback('Пароль', 'password'),
  ],
  [Markup.button.callback('Авторизоваться', 'makeAuth')],
]);

export const allowText = (userData: IUserData) => {
  return `<b>Принято!</b>\nЛогин: ${userData.login}\nПароль: ${'*'.repeat(
    userData.password.length
  )}`;
};

export const auth = async (ctx: any, userData: IUserData) => {
  const request = await http(API_URL + 'user/apikey', 'POST', userData);

  if (!request || request.status !== 200) return false;

  ctx.session ??= { apikey: '' };
  ctx.session.apikey = request?.message.apikey;

  return true;
};
