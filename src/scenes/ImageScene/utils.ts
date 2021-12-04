import { Markup } from 'telegraf';
import axios from 'axios';

import { API_URL } from '../../const';
import http from '../../utils/http';

export const imageKeyboard = Markup.inlineKeyboard([
    [Markup.button.callback('⬅️', 'prevImage'),
    Markup.button.callback('✅', 'pickImage'),
    Markup.button.callback('➡️', 'nextImage')],
    [Markup.button.callback('🔁', 'rename')]
]);

export const findWord = async (ctx: any, word: string) => {
    const response = await http(
        API_URL + `words/getDraftWord?reqWord=${word}`,
        'GET',
        null,
        { apikey: ctx?.session.apikey }
    );

    return response;
}

export const getImages = async (ctx: any, word: string) => {
    const response = await http(
        API_URL + `images/list?search=${word}&page=1`,
        'GET',
        null,
        { apikey: ctx?.session.apikey }
    );

    return response;
}

export const convertFromUrlToBase64 = async (url: string) => {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const base64 = Buffer.from(response.data, 'binary').toString('base64');
        return base64;
    } catch (e) {
        console.log('error in convertFromUrlToBase64 func', e);
        throw new Error(`Error while converting image - ${e}`);
    }
}

export const updateDraftWordToDefaultWord = async (ctx: any, word: string, translations: string, image: string) => {
    const deleteDraftWordResponse = await http(
        API_URL + 'words/deleteDraftWord',
        'POST',
        {
            reqWord: word
        },
        { apikey: ctx?.session.apikey }
    );

    if (deleteDraftWordResponse.status != 201) return;

    const addDefaultWordResponse = await http(
        API_URL + 'words/saveTranslation',
        'POST',
        {
            reqWord: word,
            reqTranslation: translations,
            reqImageURL: image
        },
        { apikey: ctx?.session.apikey }
    );

    return addDefaultWordResponse;
}
