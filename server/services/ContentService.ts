import axios from "axios";
import * as cheerio from "cheerio";

export class ContentService {
    /**
     * URL Content Loader Helper
     */
    static async fetchUrlContent(text: string): Promise<string> {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const urls = text.match(urlRegex);
        if (!urls) return text;

        let enrichedText = text;
        for (const url of urls) {
            try {
                console.log(`🌐 Fetching content from: ${url}`);
                const response = await axios.get(url, {
                    timeout: 5000,
                    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
                });
                const $ = cheerio.load(response.data);

                // Remove scripts, styles and nav elements
                $('script, style, nav, footer, header, noscript').remove();

                // Try to find main content or fallback to body
                let contentText = $('article, main, .post-content, .entry-content').text();
                if (!contentText || contentText.length < 200) {
                    contentText = $('body').text();
                }

                // Cleanup text: remove excessive whitespaces
                const cleanText = contentText
                    .replace(/\s+/g, ' ')
                    .replace(/\n+/g, '\n')
                    .trim()
                    .substring(0, 5000); // Limit each URL to 5000 chars

                enrichedText = enrichedText.replace(url, `\n--- CONTENT FROM ${url} ---\n${cleanText}\n--- END OF URL CONTENT ---\n`);
            } catch (error: any) {
                console.error(`⚠️ Failed to fetch URL ${url}:`, error.message);
            }
        }
        return enrichedText;
    }

    static generateFileName(title: string): string {
        const safeFilename = title.replace(/[^\u4e00-\u9fa5a-z0-9]/g, '_').substring(0, 50);
        return `${new Date().toISOString().split('T')[0]}_${safeFilename}.md`;
    }
}
