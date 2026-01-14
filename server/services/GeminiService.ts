import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { CorrectionService } from "./CorrectionService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

export class GeminiService {
    private static genAI: GoogleGenerativeAI;
    private static systemPrompt: string = "";

    private static init() {
        if (!this.genAI) {
            const apiKey = process.env.GEMINI_API_KEY || "";
            this.genAI = new GoogleGenerativeAI(apiKey);
        }
    }

    private static loadSystemPrompt() {
        if (this.systemPrompt) return this.systemPrompt;

        try {
            // Path relative to execution context (usually root/server.ts)
            // But here we are in server/services. So we go up.
            const promptPath = path.join(__dirname, "../../.agent/prompts/seo_writer.md");
            let prompt = fs.readFileSync(promptPath, "utf-8");
            prompt += "\n" + CorrectionService.getSystemPromptFragment();
            this.systemPrompt = prompt;
            return prompt;
        } catch (e) {
            console.error("Failed to load system prompt, using fallback.");
            return "You are a professional SEO writer named Liwei Sia.";
        }
    }

    static async generate(prompt: string): Promise<string> {
        this.init();
        const systemPrompt = this.loadSystemPrompt();
        const model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const result = await model.generateContent([
            { text: systemPrompt },
            { text: prompt }
        ]);
        return result.response.text();
    }

    static async generateWithTemplate(templateName: string, variables: Record<string, string>): Promise<string> {
        const templatePath = path.join(__dirname, "../prompts", `${templateName}.md`);
        let prompt = fs.readFileSync(templatePath, "utf-8");

        for (const [key, value] of Object.entries(variables)) {
            prompt = prompt.replace(new RegExp(`{{${key}}}`, 'g'), value || "");
        }

        return this.generate(prompt);
    }
}
