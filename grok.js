import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function askGrok(context, question) {
  const res = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [
      { role: "system", content: "Ты юридический ассистент. Отвечай ТОЛЬКО по контексту lex.uz." },
      { role: "user", content: `Контекст:\n${context}\n\nВопрос:\n${question}` },
    ],
  });

  return res.choices[0].message.content;
}
