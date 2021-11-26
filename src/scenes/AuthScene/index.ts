import { Scenes } from 'telegraf';

import { editMessage } from '../../utils/message';
import { authKeyboard, allowText, auth } from './utils';

export interface IUserData {
  login: string;
  password: string;
}

const userData: IUserData = {
  login: '',
  password: '',
};

const replyMessagesId = {
  login: 0,
  password: 0,
};

enum InputMode {
  Password,
  Login,
  Default,
}

let inputMode: InputMode = InputMode.Default;
const authScene = new Scenes.BaseScene<Scenes.SceneContext>('auth');

authScene.enter((ctx) => {
  ctx.reply('Введите данные для авторизации', authKeyboard);
});

authScene.action('login', async (ctx) => {
  ctx.reply('Логин:');
  inputMode = InputMode.Login;
});

authScene.action('password', async (ctx) => {
  const passwordReply = await ctx.reply('Пароль:');
  replyMessagesId.password = passwordReply.message_id;
  inputMode = InputMode.Password;
});

authScene.action('makeAuth', async (ctx) => {
  if (userData.login.length < 6 && userData.password.length < 6) {
    await ctx.replyWithHTML('Данные введены неверно', authKeyboard);
    inputMode = InputMode.Default;
    return;
  }

  const isAuth: boolean = await auth(ctx, userData);
  if (isAuth) {
    await ctx.reply('Вы успешно авторизовались');
    ctx.scene.enter('home');
  } else {
    await ctx.replyWithHTML('Данные введены неверно', authKeyboard);
  }
});

authScene.on('text', async (ctx) => {
  switch (inputMode) {
    case InputMode.Login: {
      const login: string = ctx.message.text;

      if (login.length < 6) {
        ctx.reply('Поробуй ещё раз');
        break;
      }

      userData.login = login;
      await editMessage(ctx, userData.login);
      ctx.replyWithHTML(allowText(userData), authKeyboard);
      inputMode = InputMode.Default;
      break;
    }
    case InputMode.Password: {
      const password: string = ctx.message.text;

      if (password.length < 6) {
        ctx.reply('Поробуй ещё раз');
        break;
      }

      userData.password = password;
      await editMessage(ctx, '*'.repeat(userData.password.length));
      ctx.replyWithHTML(allowText(userData), authKeyboard);
      inputMode = InputMode.Default;
      break;
    }
    default: {
      await ctx.reply('Не понимаю тебя...');
    }
  }
});

export default authScene;
