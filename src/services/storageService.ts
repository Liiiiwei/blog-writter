/**
 * 本地儲存服務
 * 使用 IndexedDB 儲存文章，支援匯出/匯入功能
 */

export interface Article {
    id: string;
    title: string;
    content: string;
    outline?: string;
    urlSlug?: string;
    seo?: string;
    createdAt: number;
    updatedAt: number;
    metadata?: {
        reference?: string;
        caseContext?: string;
        articleType?: string;
    };
}

const DB_NAME = 'BlogWriterDB';
const DB_VERSION = 1;
const STORE_NAME = 'articles';

export class StorageService {
    private db: IDBDatabase | null = null;

    /**
     * 初始化 IndexedDB
     */
    async init(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;

                // 創建文章儲存區
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    const objectStore = db.createObjectStore(STORE_NAME, {
                        keyPath: 'id'
                    });

                    // 創建索引
                    objectStore.createIndex('title', 'title', { unique: false });
                    objectStore.createIndex('createdAt', 'createdAt', { unique: false });
                    objectStore.createIndex('updatedAt', 'updatedAt', { unique: false });
                }
            };
        });
    }

    /**
     * 確保 DB 已初始化
     */
    private async ensureDB(): Promise<IDBDatabase> {
        if (!this.db) {
            await this.init();
        }
        if (!this.db) {
            throw new Error('Database initialization failed');
        }
        return this.db;
    }

    /**
     * 儲存文章
     */
    async saveArticle(article: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>): Promise<Article> {
        const db = await this.ensureDB();

        const now = Date.now();
        const fullArticle: Article = {
            ...article,
            id: this.generateId(),
            createdAt: now,
            updatedAt: now
        };

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.add(fullArticle);

            request.onsuccess = () => resolve(fullArticle);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * 更新文章
     */
    async updateArticle(id: string, updates: Partial<Article>): Promise<Article> {
        const db = await this.ensureDB();
        const existing = await this.getArticle(id);

        if (!existing) {
            throw new Error(`Article with id ${id} not found`);
        }

        const updated: Article = {
            ...existing,
            ...updates,
            id, // 確保 id 不被更改
            createdAt: existing.createdAt, // 保留創建時間
            updatedAt: Date.now()
        };

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.put(updated);

            request.onsuccess = () => resolve(updated);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * 取得單篇文章
     */
    async getArticle(id: string): Promise<Article | null> {
        const db = await this.ensureDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result || null);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * 列出所有文章（按更新時間排序）
     */
    async listArticles(): Promise<Article[]> {
        const db = await this.ensureDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.getAll();

            request.onsuccess = () => {
                const articles = request.result || [];
                // 按更新時間降序排列
                articles.sort((a, b) => b.updatedAt - a.updatedAt);
                resolve(articles);
            };
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * 刪除文章
     */
    async deleteArticle(id: string): Promise<void> {
        const db = await this.ensureDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * 匯出所有文章為 JSON
     */
    async exportArticles(): Promise<void> {
        const articles = await this.listArticles();
        const json = JSON.stringify(articles, null, 2);
        const blob = new Blob([json], { type: 'application/json' });

        this.downloadFile(blob, `blog-articles-${this.formatDate()}.json`);
    }

    /**
     * 匯入文章（從 JSON 檔案）
     */
    async importArticles(file: File): Promise<{ success: number; failed: number }> {
        const text = await file.text();
        const articles: Article[] = JSON.parse(text);

        let success = 0;
        let failed = 0;

        for (const article of articles) {
            try {
                // 檢查是否已存在
                const existing = await this.getArticle(article.id);

                if (existing) {
                    // 更新現有文章
                    await this.updateArticle(article.id, article);
                } else {
                    // 直接儲存（保留原始 id）
                    const db = await this.ensureDB();
                    await new Promise<void>((resolve, reject) => {
                        const transaction = db.transaction([STORE_NAME], 'readwrite');
                        const store = transaction.objectStore(STORE_NAME);
                        const request = store.add(article);
                        request.onsuccess = () => resolve();
                        request.onerror = () => reject(request.error);
                    });
                }
                success++;
            } catch (error) {
                console.error('Failed to import article:', article.title, error);
                failed++;
            }
        }

        return { success, failed };
    }

    /**
     * 清空所有文章
     */
    async clearAllArticles(): Promise<void> {
        const db = await this.ensureDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.clear();

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * 匯出單篇文章為 Markdown 檔案
     */
    exportArticleAsMarkdown(article: Article): void {
        const blob = new Blob([article.content], { type: 'text/markdown' });
        const fileName = `${this.slugify(article.title)}.md`;
        this.downloadFile(blob, fileName);
    }

    /**
     * 生成唯一 ID
     */
    private generateId(): string {
        return `article_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * 下載檔案
     */
    private downloadFile(blob: Blob, fileName: string): void {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * 格式化日期（用於檔名）
     */
    private formatDate(): string {
        const now = new Date();
        return now.toISOString().split('T')[0];
    }

    /**
     * 將標題轉為檔名友善格式
     */
    private slugify(text: string): string {
        return text
            .toLowerCase()
            .replace(/[^\u4e00-\u9fa5a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
            .substring(0, 50);
    }
}

// 單例模式
let storageInstance: StorageService | null = null;

export function getStorageService(): StorageService {
    if (!storageInstance) {
        storageInstance = new StorageService();
    }
    return storageInstance;
}
