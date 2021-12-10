import { Markup, Scenes } from 'telegraf';
import { Message } from 'typegram';
import { deleteChatMessage, editChatMessage } from '../../utils/message';

import { convertFromUrlToBase64, findWord, getImages, imageKeyboard, updateDraftWordToDefaultWord } from './utils';

enum InputMode {
    FindWord,
    FindImage,
    Default,
}

let inputMode: InputMode = InputMode.FindWord;
let imageMessage: Message;
let word: string;
let translations: string;
let images: string[] = [];
let pagination: number = 0;

const showImage = async (ctx: any) => {
    try {
        deleteChatMessage(imageMessage);
        const base64 = await convertFromUrlToBase64(images[pagination]);
        imageMessage = await ctx.replyWithPhoto({ source: Buffer.from(base64, 'base64') }, imageKeyboard);
    } catch (e) {
        throw new Error(String(e));
    }
}

const imageScene = new Scenes.BaseScene<Scenes.SceneContext>('image');

imageScene.enter((ctx) => {
    ctx.reply('Введите слово, к которому нужно добавить картинку:',
        Markup.keyboard([['В меню']]).resize(true));
});

imageScene.action('prevImage', async (ctx) => {
    if (pagination <= 0) {
        await ctx.reply('Туда нельзя');
        return;
    }

    pagination--;
    try {
        await showImage(ctx);
    } catch (e) {
        pagination--;
        await showImage(ctx);
    }
});

imageScene.action('pickImage', async (ctx) => {
    await updateDraftWordToDefaultWord(ctx, word, translations, images[pagination]);
    await ctx.reply('Картинка была добавлена\nТеперь это слово находится в обычном словаре');
    await ctx.scene.enter('home');
});

imageScene.action('nextImage', async (ctx) => {
    if (pagination === images.length) {
        await ctx.reply('Картинки закончились . . .');
        return;
    }

    pagination++;
    try {
        await showImage(ctx);
    } catch (e) {
        pagination++;
        await showImage(ctx);
    }
});

imageScene.action('rename', async (ctx) => {
    await ctx.reply('Введите слово для поиска картинка');
    inputMode = InputMode.FindImage;
});

imageScene.hears('В меню', async (ctx) => {
    inputMode = InputMode.Default;
    word = '';
    translations = '';
    images = [];
    pagination = 0;
    await ctx.reply('Возвращаюсь...', Markup.removeKeyboard());
    await ctx.scene.enter('home');
});

imageScene.on('text', async (ctx) => {
    const userInput: string = ctx.message.text;
    switch (inputMode) {
        case InputMode.FindWord: {
            const response = await findWord(ctx, userInput);
            if (response.status != 200) {
                await ctx.reply('У вас нет такого слова');
                return;
            }

            word = response.message.word;
            translations = response.message.translations[0];
            await ctx.replyWithHTML(`У вас действительно есть это слово\n<b>${response.message.word}</b>\n<i>${response.message.translations[0]}</i>`);

            await ctx.reply('Введите слово для поиска картинка');
            inputMode = InputMode.FindImage
            break;
        }

        case InputMode.FindImage: {
            const response = await getImages(ctx, encodeURIComponent(userInput));
            if (response.status != 200) {
                await ctx.reply('Бот сломалься 0_о');
                return;
            }
            images = response.message;

            try {
                await showImage(ctx);
            } catch (e) {
                await ctx.reply('Бот сломалься 0_о');
                return;
            }

            inputMode = InputMode.Default;
            break;
        }
        default: {
            await ctx.reply('Не понимаю тебя...');
        }
    }
});

export default imageScene;
