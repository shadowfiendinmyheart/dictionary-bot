import { Context } from 'telegraf';

export const deleteUserMessage = async (ctx: Context) => {
  if (ctx.message) {
    const messageId: number = ctx.message.message_id;
    await ctx.deleteMessage(messageId);
  }
};

export const editMessage = async (ctx: Context, newText: string) => {
  await deleteUserMessage(ctx);
  await ctx.replyWithHTML(newText);
};
