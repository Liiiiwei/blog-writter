import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

async function generateArticle(topic: string, targetAudience: string) {
  const systemPrompt = fs.readFileSync(
    path.join(process.cwd(), ".agent/prompts/seo_writer.md"),
    "utf-8"
  );

  const prompt = `
    主題：${topic}
    目標讀者：${targetAudience}

    請根據系統提示詞中的「立崴風格」，撰寫一篇完整的 SEO 文章。
  `;

  try {
    const result = await model.generateContent([
      { text: systemPrompt }, // 傳入系統風格定義
      { text: prompt }
    ]);

    const response = await result.response;
    const text = response.text();

    const fileName = path.join("output/articles", `article_${Date.now()}.md`);
    fs.writeFileSync(fileName, text);
    console.log(`✅ 文章已生成：${fileName}`);
  } catch (error) {
    console.error("生成失敗：", error);
  }
}

// 範例執行：tsx writer.ts "如何開始基本的 Meta 廣告投放" "想增加業績的小餐廳老闆"
const topic = process.argv[2] || "如何挑選適合的數位行銷工具";
const audience = process.argv[3] || "預算有限的創業家";

generateArticle(topic, audience);
