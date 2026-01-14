import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * 前端 Gemini AI 客戶端
 * 直接在瀏覽器中調用 Gemini API，無需後端伺服器
 */
export class GeminiClient {
    private genAI: GoogleGenerativeAI;
    private systemPrompt: string;

    constructor(apiKey: string) {
        if (!apiKey) {
            throw new Error("Gemini API Key is required");
        }
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.systemPrompt = this.buildSystemPrompt();
    }

    /**
     * 建立系統提示詞（移植自後端）
     */
    private buildSystemPrompt(): string {
        return `# SEO 文章寫手機器人 - Liwei Sia 風格

你是一位專業的 SEO 文章寫手，專門模仿 Liwei Sia 的寫作風格。

## 核心風格特徵
1. **痛點開場**：精確擊中企業主或行銷新手的焦慮
2. **生活化比喻**：將複雜概念比喻為日常事物
3. **極高可讀性**：大量使用清單符號與 H2/H3 分層
4. **誠實建議**：不諱言成本與失敗風險，建立專業信任感

## SEO 規範
- 標題含目標關鍵字，字數 15-25 字
- Meta Description: 120-150 字，包含 CTA
- 內文 1500-2500 字
- H2/H3 結構清晰
- 每段不超過 3-4 行
- 使用數據與案例佐證

## 語氣與用詞
- 第二人稱「你」稱呼讀者
- 避免過度專業術語
- 保持溫暖但專業的語調
- 適當使用 emoji 增加親和力

## 內容結構
1. 痛點開場（1-2 段）
2. 核心觀點/解決方案（H2 分段）
3. 實際案例或數據
4. 行動建議
5. 總結與 CTA`;
    }

    /**
     * 優化標題
     */
    async optimizeTitle(title: string, reference: string): Promise<string> {
        const prompt = `請優化以下文章標題，使其更符合 SEO 規範和 Liwei Sia 風格：

原始標題：${title || '（尚未輸入）'}
參考資料：${reference || '（無）'}

要求：
1. 標題長度 15-25 字
2. 包含核心關鍵字
3. 具吸引力，能激起點擊慾望
4. 符合 Liwei Sia 的語氣（專業但不失親和力）

請直接回傳優化後的標題，不要有任何前綴或說明。`;

        return this.generate(prompt);
    }

    /**
     * 生成文章大綱
     */
    async generateOutline(params: {
        title: string;
        reference: string;
        caseContext: string;
        articleType: string;
    }): Promise<string> {
        const { title, reference, caseContext, articleType } = params;

        let structureInstruction = "";
        if (articleType === 'tutorial') {
            structureInstruction = `### 結構模式：手把手教學 (How-To Tutorial)
- H2 架構需包含：準備工作、詳細步驟（Step-by-Step）、常見地雷區
- 務必強調「可操作性」，步驟要具體`;
        } else if (articleType === 'critique') {
            structureInstruction = `### 結構模式：觀點批判/迷思破解 (Critique & Myth Busting)
- H2 架構需包含：常見迷思（現狀）、立崴觀點（為什麼這樣做是錯的）、正確的底層邏輯、如何轉型
- 語氣要更犀利、有觀點，敢於挑戰現狀`;
        } else {
            structureInstruction = `### 結構模式：一般趨勢/觀點 (General Strategy)
- H2 架構需包含：現象觀察、核心策略分析、執行建議
- 聚焦於「為什麼」和「是什麼」`;
        }

        const prompt = `請為以下主題生成一個詳細的文章大綱：

文章標題：${title}
文章類型：${articleType}
參考資料：${reference || '（無，請依據通用行業知識）'}
案例背景：${caseContext || '（無）'}

${structureInstruction}

請生成包含以下內容的大綱：
1. 痛點開場（1-2個段落概述）
2. 3-5個 H2 主要段落（每個 H2 下包含 2-3個 H3 小節）
3. 總結與行動呼籲

大綱格式範例：
## 痛點開場
- 段落1：...
- 段落2：...

## H2-1: [標題]
### H3-1-1: [子標題]
- 要點...

請直接回傳 Markdown 格式的大綱。`;

        return this.generate(prompt);
    }

    /**
     * 生成完整文章
     */
    async generateArticle(params: {
        title: string;
        outline: string;
        reference: string;
        caseContext: string;
        articleType: string;
    }): Promise<string> {
        const { title, outline, reference, caseContext, articleType } = params;

        const prompt = `請根據以下大綱撰寫一篇完整的 SEO 文章：

文章標題：${title}
文章類型：${articleType}
案例背景：${caseContext || '（無，請嚴格遵守參考資料，若無資料則保守撰寫，避免編造數據）'}
參考資料：${reference || '（無）'}

文章大綱：
${outline}

要求：
1. 完整的 Markdown 格式
2. 內文 1500-2500 字
3. 嚴格遵循大綱結構
4. 每段 3-4 行，保持可讀性
5. 適當使用數據與案例
6. 結尾包含 SEO 備忘錄（Meta Description, Focus Keyword, URL Slug 建議）

請開始撰寫完整文章，以 Markdown 格式輸出。`;

        return this.generate(prompt);
    }

    /**
     * 生成 URL Slug
     */
    async generateSlug(title: string): Promise<string> {
        const prompt = `請為以下文章標題生成一個 SEO 友善的 URL slug：

標題：${title}

要求：
1. 全小寫英文
2. 使用連字符 (-)
3. 簡潔但保留核心關鍵字
4. 長度 3-6 個單字

請直接回傳 slug，不要有任何前綴或說明。
範例格式：seo-article-optimization-guide`;

        const rawSlug = await this.generate(prompt);
        // 清理 slug
        return rawSlug
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }

    /**
     * 核心生成方法
     */
    private async generate(prompt: string): Promise<string> {
        try {
            const model = this.genAI.getGenerativeModel({
                model: "gemini-2.0-flash-exp",
                systemInstruction: this.systemPrompt
            });

            const result = await model.generateContent(prompt);
            const text = result.response.text();

            return this.polishText(text);
        } catch (error: any) {
            console.error("Gemini API Error:", error);
            throw new Error(`AI 生成失敗: ${error.message}`);
        }
    }

    /**
     * 文字後處理：修正常見錯誤
     */
    private polishText(text: string): string {
        let polished = text;

        // Strip markdown code fences if present (e.g. ```markdown ... ```)
        // This prevents the content from being rendered as a single code block
        if (polished.trim().startsWith('```')) {
            polished = polished
                .replace(/^```\w*\n?/, '') // Remove opening fence (e.g. ```markdown)
                .replace(/\n?```\s*$/, ''); // Remove closing fence
        }

        const corrections: Record<string, string> = {
            // 常見術語修正
            "數位行銷": "數位行銷",
            "數碼營銷": "數位行銷",
            "在線": "線上",
            "網絡": "網路",
            "信息": "資訊",
            "軟件": "軟體",
            "硬件": "硬體",
            "用戶": "使用者",
            "數據": "數據",
            // Meta 相關
            "臉書": "Facebook",
            "面書": "Facebook",
            "IG": "Instagram",
            "ins": "Instagram"
        };

        for (const [wrong, correct] of Object.entries(corrections)) {
            const regex = new RegExp(wrong, 'g');
            polished = polished.replace(regex, correct);
        }

        return polished;
    }
}

/**
 * 從 localStorage 取得 API Key
 */
export function getStoredApiKey(): string | null {
    return localStorage.getItem('gemini_api_key');
}

/**
 * 儲存 API Key 到 localStorage
 */
export function setStoredApiKey(apiKey: string): void {
    localStorage.setItem('gemini_api_key', apiKey);
}

/**
 * 創建 Gemini 客戶端實例
 */
export function createGeminiClient(): GeminiClient | null {
    const apiKey = getStoredApiKey();
    if (!apiKey) {
        return null;
    }
    return new GeminiClient(apiKey);
}
