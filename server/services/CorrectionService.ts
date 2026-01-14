import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface DictionaryItem {
    cn: string;
    tw: string;
}

interface Dictionary {
    mappings: DictionaryItem[];
    forbidden_phrases: string[];
}

export class CorrectionService {
    private static dictionary: Dictionary | null = null;

    private static loadDictionary() {
        if (!this.dictionary) {
            const dictPath = path.join(__dirname, "terminology_dictionary.json");
            try {
                const content = fs.readFileSync(dictPath, "utf-8");
                this.dictionary = JSON.parse(content);
            } catch (error) {
                console.error("Failed to load terminology dictionary:", error);
                this.dictionary = { mappings: [], forbidden_phrases: [] };
            }
        }
        return this.dictionary;
    }

    /**
     * Polishes the text based on Taiwan terminology standards (Babel-Taiwan logic)
     */
    static polish(text: string): string {
        const dict = this.loadDictionary();
        if (!dict) return text;
        let polished = text;

        // 1. Dictionary-based replacement (CN -> TW)
        for (const item of dict.mappings) {
            // Use word boundary if possible, but for Chinese characters we just replace
            // Be careful not to break words. Using a simple replace for now as most are distinct.
            const regex = new RegExp(item.cn, 'g');
            polished = polished.replace(regex, item.tw);
        }

        // 2. Remove forbidden repetitive phrases
        for (const phrase of dict.forbidden_phrases) {
            const regex = new RegExp(phrase, 'g');
            polished = polished.replace(regex, "");
        }

        // 3. Simple CKIP-like structural cleanup (Simulated)
        // e.g., removing redundant "的" or fixing common translation artifacts
        polished = polished
            .replace(/（(這)項(工作|任務)?）/g, "") // Remove common AI placeholders
            .replace(/您可以參考(以下|下列)?/g, "參考以下")
            .trim();

        return polished;
    }

    /**
     * A specialized prompt fragment to instruct the AI to follow CKIP/Babel-Taiwan standards
     */
    static getSystemPromptFragment(): string {
        const dict = this.loadDictionary();
        if (!dict) return "";
        const mappingStr = dict.mappings
            .slice(0, 20) // Show top 20 for prompt space
            .map(m => `${m.cn} -> ${m.tw}`)
            .join(", ");

        return `
## 台灣語法與用語標準 (Babel-Taiwan & CKIP 標準)
1. **用語對標**：優先使用台灣習慣用語。範例：${mappingStr} ...等。
2. **句式校正**：避免「歐化中文」或「支語句式」。禁用「給到」、「進行一個...的動作」、「基本上來說」等贅詞。
3. **專業度**：數位行銷術語需符合台灣產業習慣（例：Landing Page 稱為「登陸頁」或「一頁式網頁」，而非「落地頁」）。
4. **精簡原則**：H2/H3 下方的第一段必須直搗黃龍，不准有「在現代社會中...」或「隨著科技發展...」等廢話開場。
`;
    }
}
