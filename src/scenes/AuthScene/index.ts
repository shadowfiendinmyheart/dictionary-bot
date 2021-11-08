import { Scenes } from 'telegraf';

import http from '../../utils/http';
import { editMessage } from '../../utils/message';
import { authKeyboard, allowText } from './utils';

const { enter } = Scenes.Stage;

export interface userDataType {
  authLogin: string;
  authPassword: string;
}

const userData: userDataType = {
  authLogin: '',
  authPassword: '',
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
  const request = await http(
    'https://fierce-ridge-30370.herokuapp.com/api/auth/login',
    'POST',
    userData
  );

  if (request && request.status == 200) {
    await ctx.reply('Вы успешно авторизовались');
    // ctx.scene.enter('home');
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

      userData.authLogin = login;
      await editMessage(ctx, `<i>${userData.authLogin}</i>`);
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

      userData.authPassword = password;
      await editMessage(ctx, '*'.repeat(userData.authPassword.length));
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
