import axios from "axios";
import * as cheerio from "cheerio";
import { embed } from "./embed.js";
import { pool } from "./db.js";

export async function loadLex(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const text = $(".wrapper").text().replace(/\s+/g, " ").trim();
    const chunks = text.match(/.{1,800}/g) || [];

    for (const chunk of chunks) {
      try {
        const vector = await embed(chunk);

        if (!vector) {
          console.warn("Пустой embedding, пропуск chunk");
          continue;
        }

        await pool.query(
          `INSERT INTO documents (url, content, embedding)
           VALUES ($1, $2, $3)`,
          [url, chunk, JSON.stringify(vector)]
        );

      } catch (e) {
        console.error("Ошибка embedding, chunk пропущен:", e);
      }
    }

    console.log(`✔ Загружено: ${url}`);
  } catch (err) {
    console.error(`Ошибка загрузки ${url}:`, err);
  }
}
