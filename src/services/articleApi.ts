import { ArticleData, ArticleFile } from "../types";

const API_BASE = '/api';

export const articleApi = {
    async fetchArticles(): Promise<ArticleFile[]> {
        const res = await fetch(`${API_BASE}/articles`);
        if (!res.ok) throw new Error('Failed to fetch articles');
        return res.json();
    },

    async getArticle(filename: string): Promise<{ content: string }> {
        const res = await fetch(`${API_BASE}/articles/${filename}`);
        if (!res.ok) throw new Error('Failed to fetch article');
        return res.json();
    },

    async optimizeTitle(title: string, reference: string): Promise<string> {
        const res = await fetch(`${API_BASE}/optimize-title`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, reference }),
        });
        if (!res.ok) throw new Error('Failed to optimize title');
        const data = await res.json();
        return data.title;
    },

    async generateOutline(params: { title: string, reference: string, caseContext: string, articleType: string }): Promise<string> {
        const res = await fetch(`${API_BASE}/generate-outline`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
        });
        if (!res.ok) throw new Error('Failed to generate outline');
        const data = await res.json();
        return data.outline;
    },

    async generateArticle(params: { title: string, outline: string, reference: string, caseContext: string, articleType: string }): Promise<ArticleData> {
        const res = await fetch(`${API_BASE}/generate-article`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
        });
        if (!res.ok) throw new Error('Failed to generate article');
        return res.json();
    },

    async publishToWP(params: { title: string, content: string, status: string }): Promise<{ success: boolean, url: string }> {
        const res = await fetch(`${API_BASE}/publish`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
        });
        if (!res.ok) throw new Error('Failed to publish');
        return res.json();
    }
};
