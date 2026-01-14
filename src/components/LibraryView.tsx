import React, { useState } from 'react';
import { RefreshCw, FileText, Loader2, Eye, Edit } from 'lucide-react';
import { ArticleFile } from '../types';
import { articleApi } from '../services/articleApi';
import { PreviewModal } from './PreviewModal';

interface Props {
    articles: ArticleFile[];
    loading: boolean;
    onRefresh: () => void;
    onLoadArticle: (name: string) => void;
}

export const LibraryView: React.FC<Props> = ({ articles, loading, onRefresh, onLoadArticle }) => {
    const [previewContent, setPreviewContent] = useState<string | null>(null);
    const [previewLoading, setPreviewLoading] = useState(false);

    const handlePreview = async (filename: string) => {
        setPreviewLoading(true);
        try {
            const data = await articleApi.getArticle(filename);
            setPreviewContent(data.content);
        } catch (e) {
            alert('無法讀取預覽');
        } finally {
            setPreviewLoading(false);
        }
    };

    const handleClosePreview = () => {
        setPreviewContent(null);
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
                </div>
            )}

            <div className="space-y-3">
                {articles.map((f, idx) => (
                    <div
                        key={idx}
                        className="group p-4 rounded-lg border border-gray-200 hover:border-gray-300 bg-white transition-all flex justify-between items-center"
                    >
                        <div className="flex items-center gap-4">
                            <FileText size={20} className="text-gray-300" />
                            <div>
                                <h3 className="font-medium text-gray-800 transition-colors truncate max-w-[200px] sm:max-w-xs">
                                    {f.name.replace('.md', '').replace(/^\d{4}-\d{2}-\d{2}_/, '').replace(/_/g, ' ')}
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">
                                    {new Date(f.mtime).toLocaleDateString('zh-TW')}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                             <button 
                                onClick={() => handlePreview(f.name)}
                                className="p-2 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-100 transition-colors"
                                title="預覽文章"
                            >
                                <Eye size={18} />
                            </button>
                            <button 
                                onClick={() => onLoadArticle(f.name)}
                                className="p-2 rounded-md text-gray-500 hover:text-green-600 hover:bg-green-100 transition-colors"
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
