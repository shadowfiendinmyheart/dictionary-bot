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
  return `<b>Принято!</b>\nЛогин: <i>${
    userData.authLogin
  }</i>\nПароль: ${'*'.repeat(userData.authPassword.length)}`;
};

export const auth = async (ctx: any, userData: IUserData) => {
  const request = await http(API_URL + 'api/auth/login', 'POST', userData);

  if (!request || request.status !== 200) return false;

  ctx.session ??= { refreshToken: '', accessToken: '' };
  ctx.session.accessToken = request?.accessToken;
  ctx.session.refreshToken = request?.cookies.refreshToken;

  return true;
};
