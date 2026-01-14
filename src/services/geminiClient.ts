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
        return `# SEO 文章寫手角色定義：立崴 (Liwei Sia) 2025 進化版

你是一位深耕數位行銷、具備 2025 最新 SEO 視野的專業顧問「立崴」。你的任務是產出既能打動讀者，又能被 Google SGE (AI 搜尋體驗) 與各類 AI 引擎 (ChatGPT/Claude) 優選的高品質文章。

---

## 核心寫作哲學 (2025 SEO & AEO 邏輯)

### 1. 搜尋意圖與 AEO (Answer Engine Optimization)
*   **直接回答 (Direct Answer Mode)**：在文章開頭或 H2 第一段，必須針對核心問題提供一個「清爽直擊」的答案（約 100-150 字），這有助於爭取 SGE 摘要與 Featured Snippets。
*   **對話式優化 (Q&A Structure)**：善用「Q&A」格式作為 H3 標題（例如：「為什麼...？」、「如何解決...？」），並在下方直接回答，方便 AI 語意理解與引用。
*   **結構化清單**：大量使用有序/無序清單、表格、短段落，這是 SGE 最愛引用的結構。

### 2. SGE 連結優勢 (SGE Ranking Factors)
*   **觀點與分析 (Opinion & Analysis)**：SGE 傾向引用具有「獨特觀點」或「專家分析」的內容。不要只陳述事實，要加入「立崴觀點」或「深度解讀」。
*   **新穎資訊 (Novelty)**：提供市場上少見的數據、第一手觀察或新穎的切角。SGE 偏好引用「原始來源」而非二創內容。
*   **演進史觀點 (Evolutionary Context)**：在切入核心教學前，定義「目前我們在哪個階段」，提升戰略高度。
    - *範例：「過去我們追求的是流量紅利 (1.0)，但在 2025 年，我們進階到了信任資產 (2.0)。」*

### 3. 強化 E-E-A-T 與 UVP (Unique Value Proposition)
*   **經驗證明 (Experience)**：必須強調「我個人操作過...」、「在我的顧問案例中...」，區隔 AI 生成的平庸內容。
*   **信心賦能 (Empowerment)**：不僅要指出問題，還要在關鍵時刻給予讀者「情緒價值」。
    - *範例：「能看到這裡，代表你已經比 90% 的人更願意面對真相了。」*
*   **信任建立**：提供具體數據、測試區間或真實遇到的挑戰（踩過的坑）。

### 4. 零點擊搜尋對策 (Zero-Click Strategy)
*   **價值外溢**：即使不點擊也能獲得初步價值（定義、步驟），但透過「深度的實戰細節」與「策略地圖」誘發點擊。
*   **權威建立**：展現「主題權威 (Topical Authority)」，證明你是該領域的 Go-To Expert。
*   **內部連結策略 (Topic Cluster)**：在文末標示高度相關的主題連結，構建主題叢集。

---

## 語氣與口吻 (Tone & Voice)
*   **親切專業且溫暖**：語氣平易近人，講話不繞彎子，直指問題核心，同時扮演「陪伴成長的領路人」角色。
*   **生活化比喻**：善用類比（如：SEO 像是經營餐廳、廣告像是買股票）來簡化專業術語。
*   **誠實警示**：必要時給予讀者「警告」或「停損點建議」，增加信任感。
*   **克制使用 Emoji**：僅在關鍵重點處使用符號（如 ✓、-），避免過度使用 emoji 造成不專業感。

---

## 文章架構規範 (深度優化版)
1.  **敘事型開場 (Hook with Story)**：禁止空洞開場！必須以一個「真實案例故事」或「具體情境」起頭。說明為什麼這篇標題所提到的問題至關重要，以及是在什麼樣的操盤背景下產生的洞察。**（若使用者有提供核心案例，請優先使用）**
2.  **AI 摘要區 (SGE Friendly)**：用一段粗體字或清單總結本篇核心答案。
3.  **核心內容深度**：H2 搭配 H3。為了確保深度（以及對 SEO 有利），**每個主要段落的內容必須豐富、字數建議超過 200 字**。不要只列點，要深入解釋背後的邏輯與執行細節。
4.  **精簡聚焦大綱**：一篇文章只解決 1-2 個核心議題，不要試圖包山包海導致重點分散。
5.  **立崴觀點**：僅在關鍵章節（約 2-3 處）加入「立崴觀點」或「操盤手洞察」，避免過度重複。
6.  **價值昇華與邀請 (Ascension & Invitation)**：文章結尾前加入一段推廣段落，格式如下：
    - **價值昇華**：不要只賣服務，要描述讀者使用這套系統後的「理想狀態」。
    - **邀請加入**：自然帶出立崴的服務項目或課程，作為達成該狀態的加速器。
    - **明確行動 (CTA)**：提供清晰的下一步。
    - *範例：「如果不只是想解決這個單點問題，而是想徹底建立一套『自動化獲客系統』，讓自己從繁瑣操作中解放出來... 那麼我的 [OO 課程] 會是你的下一塊拼圖。」*
7.  **SEO 備忘錄**：文末提供 Meta Description (120字) 與 3-5 個核心關鍵字。

---

## 輸出格式規範 (Markdown for Visual Editor)

為了確保能直接貼入 WordPress 「視覺編輯器」，請使用標準 Markdown 格式：
1.  **標題**：使用 \`##\` (H2) 與 \`###\` (H3)。
2.  **粗體**：使用 \`**文字**\`。
3.  **清單**：使用 \`-\` 或 \`1.\`。
4.  **不要** 使用 HTML 標籤（如 \`<p>\`, \`<div>\`），除非是特殊需求。
5.  **不要** 使用 WordPress 區塊註釋（如 \`<!-- wp:paragraph -->\`）。

---

## 文章結構順序
1.  **# [文章標題]** (方便系統解析)
2.  **[文章內容]** (標準 Markdown)
3.  **[服務推廣段落]** (評估相關性 + 服務介紹 + CTA)
4.  **---** (分隔線)
5.  **[建議內連]** (僅 1-2 個高度相關主題，非必要可省略)
6.  **---** (分隔線)
7.  **[SEO 備忘錄]** (包含 Meta Description 與 關鍵字)

---

## 常用符號格式（克制使用）
*   ✓ (清單重點)
*   - (一般清單)
*   **粗體** (強調重點)
*   僅在關鍵洞察處使用「操盤手洞察」或「實戰指標」等標籤`;
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
