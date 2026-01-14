import axios from "axios";
import * as fs from "fs";
import * as dotenv from "dotenv";

dotenv.config();

/**
 * WordPress 發佈服務
 * 使用 REST API v2 實作
 */
export class WordPressPublisher {
    private readonly apiUrl: string;
    private readonly auth: string;

    constructor() {
        const siteUrl = process.env.WP_SITE_URL; // 例如: https://liweisia.com
        const username = process.env.WP_USERNAME;
        const appPassword = process.env.WP_APP_PASSWORD; // 剛申請的 24 位密碼

        if (!siteUrl || !username || !appPassword) {
            throw new Error("Missing WordPress configuration in .env");
        }

        this.apiUrl = `${siteUrl.replace(/\/$/, "")}/wp-json/wp/v2`;
        // 使用 Basic Auth (Base64 編碼)
        this.auth = Buffer.from(`${username}:${appPassword}`).toString("base64");
    }

    async publishMarkdown(filePath: string, status: "draft" | "publish" = "draft") {
        const content = fs.readFileSync(filePath, "utf-8");

        // 簡單解析標題 (假設第一行是 # 標題)
        const lines = content.split("\n");
        const title = lines[0].replace("# ", "").trim();
        const body = lines.slice(1).join("\n");

        try {
            const response = await axios.post(
                `${this.apiUrl}/posts`,
                {
                    title: title,
                    content: body,
                    status: status, // 建議先用 draft 檢查，確定沒問題再改 publish
                },
                {
                    headers: {
                        Authorization: `Basic ${this.auth}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log(`🚀 文章已成功傳送到 WordPress！`);
            console.log(`🔗 編輯網址: ${process.env.WP_SITE_URL}/wp-admin/post.php?post=${response.data.id}&action=edit`);
            return response.data;
        } catch (error: any) {
            console.error("發佈失敗:", error.response?.data || error.message);
            throw error;
        }
    }
}

// 執行範例: npx tsx publisher.ts "./generated_articles/xxxx.md"
if (require.main === module) {
    const filePath = process.argv[2];
    if (!filePath) {
        console.error("請提供 Markdown 檔案路徑");
        process.exit(1);
    }
    const publisher = new WordPressPublisher();
    publisher.publishMarkdown(filePath, "draft");
}
