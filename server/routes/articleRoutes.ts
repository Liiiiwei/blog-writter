import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { GeminiService } from "../services/GeminiService.js";
import { ContentService } from "../services/ContentService.js";
import { CorrectionService } from "../services/CorrectionService.js";
import { PublishService } from "../services/PublishService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const ARTICLES_DIR = path.join(__dirname, "../../generated_articles");

// 1. Suggest Titles
router.post("/suggest-titles", async (req, res) => {
    const { title } = req.body;
    try {
        const text = await GeminiService.generateWithTemplate("suggest-titles", { title });
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (!jsonMatch) throw new Error("AI did not return a valid JSON array");
        res.json(JSON.parse(jsonMatch[0]));
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// 1.5. Optimize Title
router.post("/optimize-title", async (req, res) => {
    const { title, reference } = req.body;
    try {
        const optimizedTitle = await GeminiService.generateWithTemplate("optimize-title", {
            title: title || '（尚未輸入）',
            reference: reference || '（無）'
        });
        res.json({ title: optimizedTitle.trim() });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Generate Outline
router.post("/generate-outline", async (req, res) => {
    const { title, reference, caseContext, articleType } = req.body;
    try {
        const enrichedReference = await ContentService.fetchUrlContent(reference || "");

        let structureInstruction = "";
        if (articleType === 'tutorial') {
            structureInstruction = `5. **結構模式：手把手教學 (How-To Tutorial)**\n- H2 架構需包含：準備工作、詳細步驟（Step-by-Step）、常見地雷區。\n- 務必強調「可操作性」，步驟要具體。`;
        } else if (articleType === 'critique') {
            structureInstruction = `5. **結構模式：觀點批判/迷思破解 (Critique & Myth Busting)**\n- H2 架構需包含：常見迷思（現狀）、立崴觀點（為什麼這樣做是錯的）、正確的底層邏輯、如何轉型。\n- 語氣要更犀利、有觀點，敢於挑戰現狀。`;
        } else {
            structureInstruction = `5. **結構模式：一般趨勢/觀點 (General Strategy)**\n- H2 架構需包含：現象觀察、核心策略分析、執行建議。\n- 聚焦於「為什麼」和「是什麼」。`;
        }

        const rawOutline = await GeminiService.generateWithTemplate("generate-outline", {
            title,
            reference: enrichedReference,
            caseContext: caseContext || "無（請依據參考資料或通用行業知識）",
            structureInstruction
        });

        res.json({ outline: CorrectionService.polish(rawOutline) });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Generate Article
router.post("/generate-article", async (req, res) => {
    const { title, outline, reference, caseContext, articleType } = req.body;
    try {
        const enrichedReference = await ContentService.fetchUrlContent(reference || "");

        const rawBody = await GeminiService.generateWithTemplate("generate-article", {
            title,
            articleType: articleType || "一般",
            caseContext: caseContext || "（無，請嚴格遵守參考資料，若無資料則保守撰寫，避免編造數據）",
            outline,
            reference: enrichedReference
        });

        let body = CorrectionService.polish(rawBody);

        // Extract title and slug
        const lines = body.split('\n');
        const titleLine = lines.find(line => line.startsWith('# '));
        const articleTitle = titleLine ? titleLine.replace('# ', '').trim() : title;

        const urlSlugRaw = await GeminiService.generateWithTemplate("generate-slug", { title: articleTitle });
        const urlSlug = urlSlugRaw.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

        // Append SEO info
        if (body.includes('## SEO 備忘錄')) {
            body = body.replace(/## SEO 備忘錄([\s\S]*)/, (match, content) => `## SEO 備忘錄${content}\n\n**URL Slug:** ${urlSlug}`);
        } else {
            body += `\n\n## SEO 備忘錄\n\n**URL Slug:** ${urlSlug}`;
        }

        // Save file
        if (!fs.existsSync(ARTICLES_DIR)) fs.mkdirSync(ARTICLES_DIR);
        const fileName = ContentService.generateFileName(articleTitle);
        fs.writeFileSync(path.join(ARTICLES_DIR, fileName), body);

        const seoIndex = body.lastIndexOf('## SEO 備忘錄');
        const contentBody = seoIndex > -1 ? body.substring(0, seoIndex).trim() : body;
        const seoSection = seoIndex > -1 ? body.substring(seoIndex).trim() : '';

        res.json({
            article: body,
            title: articleTitle,
            content: contentBody,
            seo: seoSection,
            urlSlug,
            fileName
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// 4. List Articles
router.get("/articles", (req, res) => {
    if (!fs.existsSync(ARTICLES_DIR)) return res.json([]);
    const files = fs.readdirSync(ARTICLES_DIR)
        .filter(f => f.endsWith(".md"))
        .map(f => ({
            name: f,
            mtime: fs.statSync(path.join(ARTICLES_DIR, f)).mtime
        }))
        .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
    res.json(files);
});

// 5. Get Article
router.get("/articles/:filename", (req, res) => {
    const filePath = path.join(ARTICLES_DIR, req.params.filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: "File not found" });
    res.json({ content: fs.readFileSync(filePath, "utf-8") });
});

// 6. Publish
router.post("/publish", async (req, res) => {
    const { title, content, status } = req.body;
    try {
        const result = await PublishService.publishToWordPress(title, content, status);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
