import { Scenes } from 'telegraf';
import { addWordInDictionary, addWordKeyboard } from './utils';

enum InputMode {
  Add,
  Delete,
  Default,
}

// TODO: повторяется
let inputMode: InputMode = InputMode.Default;

const addWordScene = new Scenes.BaseScene<Scenes.SceneContext>('addWord');

addWordScene.enter((ctx) => {
  ctx.reply('Add word scene!', addWordKeyboard);
});

addWordScene.action('addWord', async (ctx) => {
  ctx.reply('Введите слово или словосочетание для добавления в словарь:');
  inputMode = InputMode.Add;
});

addWordScene.action('deleteWord', async (ctx) => {
  ctx.reply('Введите слово или словосочетание для удаления из словаря:');
  inputMode = InputMode.Delete;
});

addWordScene.on('text', async (ctx) => {
  switch (inputMode) {
    case InputMode.Add: {
      const word: string = ctx.message.text;
      const result = addWordInDictionary(ctx, word);
      if (!result) {
          break;
      }
      await ctx.replyWithHTML('Слово добавлено!', addWordKeyboard);
      break;
    }
    case InputMode.Delete: {
      const word: string = ctx.message.text;

      break;
    }
    default: {
      await ctx.reply('Не понимаю тебя...');
    }
  }
});

export default addWordScene;
