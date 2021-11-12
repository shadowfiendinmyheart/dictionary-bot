import { Context, Telegram } from 'telegraf';
import { ExtraEditMessageText } from 'telegraf/typings/telegram-types';
import { Message } from 'typegram';

const telegram: Telegram = new Telegram(process.env.BOT_TOKEN as string);

export const deleteUserMessage = async (ctx: Context) => {
  if (ctx.message) {
    const messageId: number = ctx.message.message_id;
    await ctx.deleteMessage(messageId);
  }
};

// TODO: сделать обновляемое меню
export const deleteChatMessage = async (message: Message.TextMessage) => {
  await telegram.deleteMessage(message.chat.id, message.message_id);
};

export const editChatMessage = async (
  message: Message.TextMessage,
  text: string,
  keyboard?: ExtraEditMessageText
) => {
  await telegram.editMessageText(
    message.chat.id,
    message.message_id,
    '',
    text,
    keyboard
  );
};

export const editMessage = async (ctx: Context, newText: string) => {
  await deleteUserMessage(ctx);
  await ctx.replyWithHTML(newText);
};
