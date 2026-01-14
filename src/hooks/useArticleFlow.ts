import { useState } from 'react';
import { Step, ArticleFile, ArticleData } from '../types';
import { articleApi } from '../services/articleApi';

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
    const [currentFile, setCurrentFile] = useState('');
    const [wpStatus, setWpStatus] = useState<'draft' | 'publish'>('draft');
    const [publishedUrl, setPublishedUrl] = useState('');

    const handleOptimizeTitle = async () => {
        if (!title && !reference) {
            alert('請至少輸入標題或參考素材');
            return;
        }
        setLoading(true);
        try {
            const optimized = await articleApi.optimizeTitle(title, reference);
            setTitle(optimized);
        } catch (e: any) {
            alert(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateOutline = async () => {
        setLoading(true);
        try {
            const generatedOutline = await articleApi.generateOutline({ title, reference, caseContext, articleType });
            setOutline(generatedOutline);
            setStep('outline');
        } catch (e: any) {
            alert(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateArticle = async () => {
        setLoading(true);
        try {
            const data = await articleApi.generateArticle({ title, outline, reference, caseContext, articleType });
            setArticle(data.article);
            setCurrentFile(data.fileName);
            setArticleContent(data.content);
            setArticleSEO(data.seo);
            setArticleTitle(data.title);
            setUrlSlug(data.urlSlug);
            setStep('article');
        } catch (e: any) {
            alert(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePublish = async () => {
        setLoading(true);
        try {
            const result = await articleApi.publishToWP({ title: articleTitle || title, content: article, status: wpStatus });
            if (result.success) {
                setPublishedUrl(result.url);
                setStep('finish');
            }
        } catch (e: any) {
            alert(e.message);
        } finally {
            setLoading(false);
        }
    };

    const loadArticleData = (content: string, filename: string) => {
        setArticle(content);
        setCurrentFile(filename);

        const lines = content.split('\n');
        const titleLine = lines.find((line) => line.startsWith('# '));
        const parsedTitle = titleLine ? titleLine.replace('# ', '').trim() : '';

        setTitle(parsedTitle);
        setArticleTitle(parsedTitle);

        const seoIndex = content.lastIndexOf('## SEO 備忘錄');
        const contentBody = seoIndex > -1 ? content.substring(0, seoIndex).trim() : content;
        const seoSection = seoIndex > -1 ? content.substring(seoIndex).trim() : '';

        setArticleContent(contentBody);
        setArticleSEO(seoSection);

        const slugMatch = seoSection.match(/\*\*URL Slug:\*\* ([\w-]+)/);
        if (slugMatch && slugMatch[1]) {
            setUrlSlug(slugMatch[1]);
        }

        setStep('article');
    };

    return {
        step, setStep,
        loading,
        draft: {
            title, setTitle,
            reference, setReference,
            caseContext, setCaseContext,
            articleType, setArticleType,
            outline, setOutline
        },
        article: {
            content: article, setArticle,
            title: articleTitle, setTitle: setArticleTitle,
            body: articleContent, setBody: setArticleContent,
            seo: articleSEO, setSeo: setArticleSEO,
            urlSlug, setUrlSlug,
            currentFile,
            wpStatus, setWpStatus,
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
