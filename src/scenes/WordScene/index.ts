import { Scenes } from 'telegraf';
import {
  addWordInDictionary,
  wordKeyboard,
  deleteWordFromDictionary,
} from './utils';

enum InputMode {
  Add,
  Delete,
  Default,
}

// TODO: повторяется
let inputMode: InputMode = InputMode.Default;

const addWordScene = new Scenes.BaseScene<Scenes.SceneContext>('word');

addWordScene.enter((ctx) => {
  ctx.reply('Выберите действие:', wordKeyboard);
});

addWordScene.action('addWord', async (ctx) => {
  ctx.reply('Введите слово или словосочетание для добавления в словарь:');
  inputMode = InputMode.Add;
});

addWordScene.action('deleteWord', async (ctx) => {
  ctx.reply('Введите слово или словосочетание для удаления из словаря:');
  inputMode = InputMode.Delete;
});

addWordScene.action('home', async (ctx) => {
  await ctx.scene.enter('home');
});

addWordScene.on('text', async (ctx) => {
  const word: string = ctx.message.text;
  if (!/^[a-zA-Z\ ]+$/.test(word)) {
    await ctx.reply('Неверные символы');
    return;
  }
  switch (inputMode) {
    case InputMode.Add: {
      const result = await addWordInDictionary(ctx, word);
      if (result.status != 201) {
        await ctx.replyWithHTML(
          `Произошла ошибка:\n${result.message}`,
          wordKeyboard
        );
        inputMode = InputMode.Default;
        break;
      }
      await ctx.replyWithHTML(
        `Успешно!\nСлово: ${result.word}\nПеревод: ${result.translations}`,
        wordKeyboard
      );
      inputMode = InputMode.Default;
      break;
    }
    case InputMode.Delete: {
      const result = await deleteWordFromDictionary(ctx, word);
      if (result.status !== 201) {
        await ctx.reply(
          result.message || 'Произошла ошибка сервера',
          wordKeyboard
        );
        inputMode = InputMode.Default;
        break;
      }
      await ctx.reply('Ваш словарь обновлён', wordKeyboard);
      inputMode = InputMode.Default;
      break;
    }
    default: {
      await ctx.reply('Не понимаю тебя...');
    }
  }
});

export default addWordScene;
