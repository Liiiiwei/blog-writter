import { useState } from 'react';
import { Step } from '../types';
import { createGeminiClient, getStoredApiKey } from '../services/geminiClient';
import { getStorageService, Article } from '../services/storageService';

export function useArticleFlow() {
    const [step, setStep] = useState<Step>('input');
    const [loading, setLoading] = useState(false);

    // Draft State
    const [title, setTitle] = useState('');
    const [reference, setReference] = useState('');
    const [caseContext, setCaseContext] = useState('');
    const [articleType, setArticleType] = useState('general');
    const [outline, setOutline] = useState('');

    // Article State
    const [article, setArticle] = useState('');
    const [articleTitle, setArticleTitle] = useState('');
    const [articleContent, setArticleContent] = useState('');
    const [articleSEO, setArticleSEO] = useState('');
    const [urlSlug, setUrlSlug] = useState('');
    const [currentArticleId, setCurrentArticleId] = useState('');
    const [wpStatus, setWpStatus] = useState<'draft' | 'publish'>('draft');
    const [publishedUrl, setPublishedUrl] = useState('');

    /**
     * 檢查 API Key 是否存在
     */
    const checkApiKey = (): boolean => {
        const apiKey = getStoredApiKey();
        if (!apiKey) {
            alert('請先在設定中輸入 Gemini API Key');
            return false;
        }
        return true;
    };

    /**
     * 優化標題
     */
    const handleOptimizeTitle = async () => {
        if (!title && !reference) {
            alert('請至少輸入標題或參考素材');
            return;
        }

        if (!checkApiKey()) return;

        setLoading(true);
        try {
            const client = createGeminiClient();
            if (!client) throw new Error('無法初始化 AI 客戶端');

            const optimized = await client.optimizeTitle(title, reference);
            setTitle(optimized);
        } catch (e: any) {
            alert(`標題優化失敗: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    /**
     * 生成文章大綱
     */
    const handleGenerateOutline = async () => {
        if (!checkApiKey()) return;

        setLoading(true);
        try {
            const client = createGeminiClient();
            if (!client) throw new Error('無法初始化 AI 客戶端');

            const generatedOutline = await client.generateOutline({
                title,
                reference,
                caseContext,
                articleType
            });

            setOutline(generatedOutline);
            setStep('outline');
        } catch (e: any) {
            alert(`大綱生成失敗: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    /**
     * 生成完整文章
     */
    const handleGenerateArticle = async () => {
        if (!checkApiKey()) return;

        setLoading(true);
        try {
            const client = createGeminiClient();
            if (!client) throw new Error('無法初始化 AI 客戶端');

            // 生成文章內容
            const fullArticle = await client.generateArticle({
                title,
                outline,
                reference,
                caseContext,
                articleType
            });

            // 解析標題
            const lines = fullArticle.split('\n');
            const titleLine = lines.find(line => line.startsWith('# '));
            const parsedTitle = titleLine ? titleLine.replace('# ', '').trim() : title;

            // 生成 URL Slug
            const generatedSlug = await client.generateSlug(parsedTitle);

            // 組裝 SEO 備忘錄
            let articleWithSEO = fullArticle;
            const seoSection = `## SEO 備忘錄

**Focus Keyword:** ${title}
**Meta Description:** ${parsedTitle}
**URL Slug:** ${generatedSlug}`;

            if (fullArticle.includes('## SEO 備忘錄')) {
                articleWithSEO = fullArticle.replace(
                    /## SEO 備忘錄[\s\S]*/,
                    seoSection
                );
            } else {
                articleWithSEO += `\n\n${seoSection}`;
            }

            // 分離內容與 SEO 區塊
            const seoIndex = articleWithSEO.lastIndexOf('## SEO 備忘錄');
            const contentBody = seoIndex > -1
                ? articleWithSEO.substring(0, seoIndex).trim()
                : articleWithSEO;
            const seoBlock = seoIndex > -1
                ? articleWithSEO.substring(seoIndex).trim()
                : seoSection;

            // 儲存到 IndexedDB
            const storage = getStorageService();
            await storage.init();

            const savedArticle = await storage.saveArticle({
                title: parsedTitle,
                content: articleWithSEO,
                outline,
                urlSlug: generatedSlug,
                seo: seoBlock,
                metadata: {
                    reference,
                    caseContext,
                    articleType
                }
            });

            // 更新狀態
            setArticle(articleWithSEO);
            setArticleTitle(parsedTitle);
            setArticleContent(contentBody);
            setArticleSEO(seoBlock);
            setUrlSlug(generatedSlug);
            setCurrentArticleId(savedArticle.id);
            setStep('article');

        } catch (e: any) {
            alert(`文章生成失敗: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    /**
     * 發佈至 WordPress
     */
    const handlePublish = async () => {
        const wpUrl = localStorage.getItem('wp_site_url');
        const wpUser = localStorage.getItem('wp_username');
        const wpPassword = localStorage.getItem('wp_app_password');

        if (!wpUrl || !wpUser || !wpPassword) {
            alert('請先在設定中配置 WordPress 資訊');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${wpUrl}/wp-json/wp/v2/posts`, {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${btoa(`${wpUser}:${wpPassword}`)}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: articleTitle || title,
                    content: articleContent,
                    status: wpStatus,
                    slug: urlSlug
                })
            });

            if (!response.ok) {
                throw new Error(`WordPress API Error: ${response.statusText}`);
            }

            const result = await response.json();
            setPublishedUrl(result.link);
            setStep('finish');

        } catch (e: any) {
            alert(`發佈失敗: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    /**
     * 載入已存在的文章
     */
    const loadArticleData = async (articleId: string) => {
        try {
            const storage = getStorageService();
            await storage.init();
            const loadedArticle = await storage.getArticle(articleId);

            if (!loadedArticle) {
                alert('找不到該文章');
                return;
            }

            setArticle(loadedArticle.content);
            setArticleTitle(loadedArticle.title);
            setCurrentArticleId(loadedArticle.id);
            setUrlSlug(loadedArticle.urlSlug || '');

            // 解析內容與 SEO 區塊
            const seoIndex = loadedArticle.content.lastIndexOf('## SEO 備忘錄');
            const contentBody = seoIndex > -1
                ? loadedArticle.content.substring(0, seoIndex).trim()
                : loadedArticle.content;
            const seoBlock = seoIndex > -1
                ? loadedArticle.content.substring(seoIndex).trim()
                : '';

            setArticleContent(contentBody);
            setArticleSEO(seoBlock);

            // 載入 metadata
            if (loadedArticle.metadata) {
                setReference(loadedArticle.metadata.reference || '');
                setCaseContext(loadedArticle.metadata.caseContext || '');
                setArticleType(loadedArticle.metadata.articleType || 'general');
            }

            if (loadedArticle.outline) {
                setOutline(loadedArticle.outline);
            }

            setStep('article');

        } catch (e: any) {
            alert(`載入文章失敗: ${e.message}`);
        }
    };

    return {
        step,
        setStep,
        loading,
        draft: {
            title,
            setTitle,
            reference,
            setReference,
            caseContext,
            setCaseContext,
            articleType,
            setArticleType,
            outline,
            setOutline
        },
        article: {
            content: article,
            setArticle,
            title: articleTitle,
            setTitle: setArticleTitle,
            body: articleContent,
            setBody: setArticleContent,
            seo: articleSEO,
            setSeo: setArticleSEO,
            urlSlug,
            setUrlSlug,
            currentFile: currentArticleId,
            wpStatus,
            setWpStatus,
            publishedUrl
        },
        actions: {
            optimizeTitle: handleOptimizeTitle,
            generateOutline: handleGenerateOutline,
            generateArticle: handleGenerateArticle,
            publish: handlePublish,
            loadArticleData
        }
    };
}
