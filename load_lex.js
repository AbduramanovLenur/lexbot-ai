import "dotenv/config";
import { initDB } from "./db.js";
import { loadLex } from "./parser.js";

const urls = [
  "https://lex.uz/docs/35869",
  "https://lex.uz/docs/111457",
];

async function run() {
  try {
    await initDB();

    for (const url of urls) {
      await loadLex(url);
    }

    console.log("Весь контент загружен");
  } catch (err) {
    console.error("Ошибка при загрузке:", err);
  }
}

run().catch(err => {
  console.error("Критическая ошибка:", err);
});
