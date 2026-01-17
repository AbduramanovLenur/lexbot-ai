import "dotenv/config";
import { Telegraf } from "telegraf";
import { initDB, pool } from "./db.js";
import { embed } from "./embed.js";
import { semanticSearch } from "./search.js";
import { askGrok } from "./grok.js";

await initDB();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.start(ctx => ctx.reply("⚖️ Привет! Я юридический бот. Задай любой вопрос, и я дам ответ на основе lex.uz."));

bot.on("text", async ctx => {
  const question = ctx.message.text;

  try {
    await ctx.reply("🔍 Ищу ответ...");

    const qVector = await embed(question);

    const { rows } = await pool.query("SELECT content, embedding FROM documents");

    const results = semanticSearch(qVector, rows);
    
    if (results.length === 0) return ctx.reply("❗ В базе нет информации для ответа");

    const context = results.map(r => r.content).join("\n---\n");

    const answer = await askGrok(context, question);
    ctx.reply(answer.slice(0, 4000));
  } catch (e) {
    console.error(e);
    ctx.reply("Ошибка обработки запроса");
  }
});

bot.launch();
console.log("Telegram бот запущен");
