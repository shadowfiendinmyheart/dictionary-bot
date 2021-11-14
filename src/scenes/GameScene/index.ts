import { Scenes } from 'telegraf';
import { IWord } from '../DictionaryScene/utils';
import { getCards } from './utils';

interface IGameStat extends IWord {
  isAnswered: boolean;
  userAnswer?: string;
}

const gameScene = new Scenes.BaseScene<Scenes.SceneContext>('game');

let gameStat: Array<IGameStat>;
let gameStatCounter = 0;

gameScene.enter(async (ctx) => {
  await ctx.reply('Введите один из переводов слова');
  const cards = await getCards(ctx);
  if (cards) {
    gameStat = cards.map((card) => {
      return {
        isAnswered: false,
        ...card,
      };
    });
    await ctx.reply(gameStat[gameStatCounter].word);
  }
});

gameScene.on('text', async (ctx) => {
  if (gameStatCounter > gameStat.length) {
    return;
  }

  const answer = ctx.message.text.toLowerCase();
  if (gameStat[gameStatCounter].translations?.includes(answer)) {
    gameStat[gameStatCounter].isAnswered = true;
  } else {
    gameStat[gameStatCounter].userAnswer = answer;
  }
  gameStatCounter++;

  if (gameStatCounter < gameStat.length) {
    await ctx.reply(gameStat[gameStatCounter].word);
  }

  if (gameStatCounter === gameStat.length) {
    gameStatCounter = 0;
    await ctx.reply('Вы прошли игру, ваша статистика:');
    const finalStat = gameStat.reduce(
      (prevStat: string, curStat: IGameStat) => {
        return curStat.isAnswered
          ? prevStat + `✔️<b>${curStat.word}</b>\n${curStat.translations}\n`
          : prevStat +
              `❌<b>${curStat.word}</b> : ${curStat.userAnswer}\n${curStat.translations}\n`;
      },
      ''
    );
    await ctx.replyWithHTML(finalStat);
    await ctx.scene.enter('home');
  }
});

export default gameScene;
