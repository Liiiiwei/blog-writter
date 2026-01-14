import React from 'react';
import { RefreshCw, FileText, Loader2 } from 'lucide-react';
import { ArticleFile } from '../types';

interface Props {
    articles: ArticleFile[];
    loading: boolean;
    onRefresh: () => void;
    onLoadArticle: (name: string) => void;
}

export const LibraryView: React.FC<Props> = ({ articles, loading, onRefresh, onLoadArticle }) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-800">已存檔的文章</h2>
                <button
                    onClick={onRefresh}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors text-sm"
                >
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    重新整理
                </button>
            </div>

            {loading && articles.length === 0 && (
                <div className="flex justify-center py-16">
                    <Loader2 size={32} className="animate-spin text-blue-500" />
                </div>
            )}

            {!loading && articles.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                    <FileText size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="text-sm">尚未有任何文章</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {articles.map((f, idx) => (
                    <div
                        key={idx}
                        onClick={() => onLoadArticle(f.name)}
                        className="group p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer transition-all flex justify-between items-center"
                    >
                        <div>
                            <h3 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors truncate max-w-[200px] sm:max-w-xs">
                                {f.name.replace('.md', '').replace(/^\d{4}-\d{2}-\d{2}_/, '').replace(/_/g, ' ')}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                                {new Date(f.mtime).toLocaleDateString('zh-TW')}
                            </p>
                        </div>
                        <FileText size={20} className="text-gray-300 group-hover:text-blue-400 transition-colors" />
                    </div>
                ))}
            </div>
        </div>
    );
};
