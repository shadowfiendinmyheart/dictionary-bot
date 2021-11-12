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
  ctx.reply('Add word scene!', wordKeyboard);
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
  switch (inputMode) {
    case InputMode.Add: {
      const word: string = ctx.message.text;
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
        `Карточка добавлена!\nСлово: <i>${result.word}</i>\nПеревод: ${result.translations}`,
        wordKeyboard
      );
      inputMode = InputMode.Default;
      break;
    }
    case InputMode.Delete: {
      const word: string = ctx.message.text;
      const result = await deleteWordFromDictionary(ctx, word);
      if (result.status !== 201) {
        await ctx.reply('Произошла ошибка сервера', wordKeyboard);
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