import React, { useState } from 'react';
import { RefreshCw, FileText, Loader2, Eye, Edit, Download } from 'lucide-react';
import { Article, getStorageService } from '../services/storageService';
import { PreviewModal } from './PreviewModal';

interface Props {
    articles: Article[];
    loading: boolean;
    onRefresh: () => void;
    onLoadArticle: (id: string) => void;
}

export const LibraryView: React.FC<Props> = ({ articles, loading, onRefresh, onLoadArticle }) => {
    const [previewContent, setPreviewContent] = useState<string | null>(null);
    const [previewLoading, setPreviewLoading] = useState(false);

    const handlePreview = async (articleId: string) => {
        setPreviewLoading(true);
        try {
            const storage = getStorageService();
            await storage.init();
            const article = await storage.getArticle(articleId);
            if (article) {
                setPreviewContent(article.content);
            } else {
                alert('找不到文章');
            }
        } catch (e) {
            alert('無法讀取預覽');
        } finally {
            setPreviewLoading(false);
        }
    };

    const handleDownload = async (articleId: string) => {
        try {
            const storage = getStorageService();
            await storage.init();
            const article = await storage.getArticle(articleId);
            if (article) {
                storage.exportArticleAsMarkdown(article);
            } else {
                alert('找不到文章');
            }
        } catch (e) {
            alert('下載失敗');
        }
    };

    const handleClosePreview = () => {
        setPreviewContent(null);
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('zh-TW', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-800">已存檔的文章</h2>
                <button
                    onClick={onRefresh}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors text-sm"
                    disabled={loading || previewLoading}
                >
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    重新整理
                </button>
            </div>

            {(loading || previewLoading) && articles.length === 0 && (
                <div className="flex justify-center py-16">
                    <Loader2 size={32} className={`animate-spin ${previewLoading ? 'text-gray-400' : 'text-blue-500'}`} />
                </div>
            )}

            {!loading && articles.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                    <FileText size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="text-sm">尚未有任何文章</p>
                    <p className="text-xs mt-2">開始創作您的第一篇文章吧！</p>
                </div>
            )}

            <div className="space-y-3">
                {articles.map((article) => (
                    <div
                        key={article.id}
                        className="group p-4 rounded-lg border border-gray-200 hover:border-gray-300 bg-white transition-all flex justify-between items-center"
                    >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                            <FileText size={20} className="text-gray-300 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                                <h3 className="font-medium text-gray-800 transition-colors truncate">
                                    {article.title}
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">
                                    {formatDate(article.updatedAt)}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                                onClick={() => handlePreview(article.id)}
                                className="p-2 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                title="預覽文章"
                            >
                                <Eye size={18} />
                            </button>
                            <button
                                onClick={() => handleDownload(article.id)}
                                className="p-2 rounded-md text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                                title="下載 Markdown"
                            >
                                <Download size={18} />
                            </button>
                            <button
                                onClick={() => onLoadArticle(article.id)}
                                className="p-2 rounded-md text-gray-500 hover:text-green-600 hover:bg-green-50 transition-colors"
                                title="載入編輯"
                            >
                                <Edit size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {previewContent && (
                <PreviewModal content={previewContent} onClose={handleClosePreview} />
            )}
        </div>
    );
};
