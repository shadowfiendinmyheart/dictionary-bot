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
  [Markup.button.callback('Зарегистрироваться', 'makeRegistration')],
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

export const registration = async (ctx: any, userData: IUserData) => {
  try {
    const requestRegistrarion = await http(API_URL + 'api/auth/registration', 'POST', {
      regNickname: userData.login,
      regLogin: userData.login,
      regPassword: userData.password,
      regPasswordRepeat: userData.password
    });

    if (!requestRegistrarion || requestRegistrarion.status !== 201) {
      ctx.reply(requestRegistrarion.message);
      return false;
    }

    const requestCreateDictionary = await http(API_URL + 'words/createDictionary',
      'POST',
      {},
      { apikey: requestRegistrarion.apiKey }
    );

    if (!requestCreateDictionary || requestCreateDictionary.status !== 201) {
      ctx.reply(requestCreateDictionary.message);
      return false;
    }

    return true;
  } catch (e) {
    console.log(e);
    return false
  }
};
