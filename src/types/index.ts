export type Tab = 'draft' | 'library';
export type Step = 'input' | 'outline' | 'article' | 'finish';

export interface ArticleFile {
    name: string;
    mtime: string;
}

export interface ArticleData {
    article: string;
    title: string;
    content: string;
    seo: string;
    urlSlug: string;
    fileName: string;
}
