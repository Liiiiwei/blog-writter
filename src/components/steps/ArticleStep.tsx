import React, { useState } from 'react';
import { Copy, Check, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Props {
    title: string;
    setTitle: (v: string) => void;
    body: string;
    setBody: (v: string) => void;
    seo: string;
    urlSlug: string;
    wpStatus: 'draft' | 'publish';
    setWpStatus: (v: 'draft' | 'publish') => void;
    onPublish: () => void;
    loading: boolean;
}

export const ArticleStep: React.FC<Props> = ({
    title, setTitle,
    body, setBody,
    seo,
    urlSlug,
    wpStatus, setWpStatus,
    onPublish,
    loading
}) => {
    const [copiedSec, setCopiedSec] = useState('');

    const copy = (text: string, sec: string) => {
        navigator.clipboard.writeText(text);
        setCopiedSec(sec);
        setTimeout(() => setCopiedSec(''), 2000);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
                {/* Title */}
                <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                        <label className="text-sm font-semibold text-gray-700">文章標題</label>
                        <button onClick={() => copy(title, 'title')} className="text-xs text-gray-600 hover:text-blue-600 flex items-center gap-1 border border-gray-300 px-2 py-1 rounded">
                            {copiedSec === 'title' ? <Check size={14} className="text-green-500" /> : <Copy size={14} />} 複製
                        </button>
                    </div>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                </div>

                {/* Slug */}
                {urlSlug && (
                    <div className="border border-gray-200 rounded-lg p-4 bg-blue-50/30">
                        <div className="flex justify-between items-center mb-3">
                            <label className="text-sm font-semibold text-gray-700">網址後綴</label>
                            <button onClick={() => copy(urlSlug, 'slug')} className="text-xs text-gray-600 hover:text-blue-600 border border-gray-300 px-2 py-1 rounded bg-white">
                                {copiedSec === 'slug' ? <Check size={14} className="text-green-500" /> : <Copy size={14} />} 複製
                            </button>
                        </div>
                        <div className="font-mono text-sm bg-white px-4 py-2 rounded border border-gray-300">{urlSlug}</div>
                    </div>
                )}

                {/* Body */}
                <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                        <label className="text-sm font-semibold text-gray-700">內容</label>
                        <button onClick={() => copy(body, 'body')} className="text-xs text-gray-600 hover:text-blue-600 border border-gray-300 px-2 py-1 rounded">
                            {copiedSec === 'body' ? <Check size={14} className="text-green-500" /> : <Copy size={14} />} 複製全部
                        </button>
                    </div>
                    <textarea value={body} onChange={(e) => setBody(e.target.value)} className="w-full h-96 px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm" />
                </div>

                {/* SEO */}
                {seo && (
                    <div className="border border-gray-200 rounded-lg p-4 bg-green-50/30">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">SEO 備忘錄</label>
                        <div className="bg-white px-4 py-3 rounded border border-gray-300">
                            <ReactMarkdown className="prose prose-sm max-w-none">{seo}</ReactMarkdown>
                        </div>
                    </div>
                )}
            </div>

            <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">發佈狀態方</label>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg bg-white" value={wpStatus} onChange={(e) => setWpStatus(e.target.value as any)}>
                        <option value="draft">📁 儲存為草稿</option>
                        <option value="publish">🚀 直接發佈文章</option>
                    </select>
                </div>
                <button
                    onClick={onPublish}
                    disabled={loading}
                    className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                    {loading && <Loader2 size={20} className="animate-spin" />}
                    同步至 WORDPRESS
                </button>
            </div>
        </div>
    );
};
