import React, { useState } from 'react';
import { Copy, Check, Loader2, Eye, Edit, Share, Save, UploadCloud, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Props {
    title: string;
    setTitle: (v: string) => void;
    body: string;
    setBody: (v: string) => void;
    seo: string;
    urlSlug: string;
    // wpStatus is no longer used for selection, but passed in spread
    onPublish: (status: 'draft' | 'publish') => void;
    onSave: () => void;
    loading: boolean;
}

export const ArticleStep: React.FC<Props> = ({
    title, setTitle,
    body, setBody,
    seo,
    urlSlug,
    onPublish,
    onSave,
    loading
}) => {
    const [copiedSec, setCopiedSec] = useState('');
    const [mode, setMode] = useState<'preview' | 'edit'>('preview');

    const copy = (text: string, sec: string) => {
        navigator.clipboard.writeText(text);
        setCopiedSec(sec);
        setTimeout(() => setCopiedSec(''), 2000);
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {/* Title Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-shadow hover:shadow-md">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">文章標題</label>
                    <div className="flex gap-2">
                        <button
                            onClick={onSave}
                            className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-blue-50 border border-transparent transition-all"
                            title="儲存標題與內容變更"
                        >
                            <Save size={14} />
                            儲存變更
                        </button>
                        <button
                            onClick={() => copy(title, 'title')}
                            className="text-xs font-medium text-gray-500 hover:text-blue-600 flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-white border border-transparent hover:border-gray-200 transition-all"
                        >
                            {copiedSec === 'title' ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                            {copiedSec === 'title' ? '已複製' : '複製'}
                        </button>
                    </div>
                </div>
                <div className="p-5">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full text-2xl font-bold text-gray-900 border-none focus:ring-0 p-0 placeholder-gray-300 bg-white"
                        placeholder="請輸入文章標題..."
                    />
                </div>
            </div>

            {/* Slug Section */}
            {urlSlug && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-shadow hover:shadow-md">
                    <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">網址後綴 / URL Slug</label>
                        <button
                            onClick={() => copy(urlSlug, 'slug')}
                            className="text-xs font-medium text-gray-500 hover:text-blue-600 flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-white border border-transparent hover:border-gray-200 transition-all"
                        >
                            {copiedSec === 'slug' ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                            {copiedSec === 'slug' ? '已複製' : '複製'}
                        </button>
                    </div>
                    <div className="p-5 font-mono text-blue-600 bg-blue-50/10">
                        {urlSlug}
                    </div>
                </div>
            )}

            {/* Content Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-shadow hover:shadow-md min-h-[500px] flex flex-col">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/80 backdrop-blur-sm sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">文章內容</label>
                        <div className="flex bg-gray-100 p-1 rounded-lg">
                            <button
                                onClick={() => setMode('preview')}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${mode === 'preview' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <Eye size={14} /> 預覽
                            </button>
                            <button
                                onClick={() => setMode('edit')}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${mode === 'edit' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <Edit size={14} /> 編輯
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onSave}
                            className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-blue-50 border border-transparent transition-all"
                        >
                            <Save size={14} />
                            儲存內容
                        </button>
                        <button
                            onClick={() => copy(body, 'body')}
                            className="text-xs font-medium text-gray-500 hover:text-blue-600 flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-white border border-transparent hover:border-gray-200 transition-all"
                        >
                            {copiedSec === 'body' ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                            {copiedSec === 'body' ? '全部' : '複製'}
                        </button>
                    </div>
                </div>

                <div className="flex-1 p-8">
                    {mode === 'preview' ? (
                        <article className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-h1:text-3xl prose-h2:text-2xl prose-h2:mt-8 prose-p:text-gray-700 prose-p:leading-relaxed prose-li:text-gray-700 text-gray-900">
                            <ReactMarkdown
                                components={{
                                    strong: ({ node, children, ...props }) => {
                                        const text = String(children);
                                        const isLiweiView = text.includes('立崴觀點') || text.includes('操盤手洞察');
                                        return <strong className={isLiweiView ? "text-orange-500 font-bold" : "font-bold"} {...props}>{children}</strong>;
                                    }
                                }}
                            >
                                {body}
                            </ReactMarkdown>
                        </article>
                    ) : (
                        <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            className="w-full h-full min-h-[500px] p-0 border-none focus:ring-0 bg-white text-gray-900 font-mono text-sm leading-relaxed resize-none"
                            placeholder="在此輸入 Markdown 內容..."
                        />
                    )}
                </div>
            </div>

            {/* SEO Memo */}
            {seo && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-shadow hover:shadow-md border-l-4 border-l-green-500">
                    <div className="p-5 border-b border-gray-100 bg-green-50/30">
                        <label className="text-sm font-bold text-green-800 uppercase tracking-wide flex items-center gap-2">
                            <Share size={16} /> SEO 備忘錄
                        </label>
                    </div>
                    <div className="p-6 bg-white">
                        <article className="prose prose-sm max-w-none prose-p:text-gray-600 prose-strong:text-gray-900">
                            <ReactMarkdown>{seo}</ReactMarkdown>
                        </article>
                    </div>
                </div>
            )}

            {/* Footer / Actions */}
            <div className="pt-8 flex flex-col md:flex-row justify-end items-center gap-4 border-t border-gray-100 mt-8">
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={() => onPublish('draft')}
                        disabled={loading}
                        className="flex-1 md:flex-none px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <FileText size={18} />}
                        儲存為草稿 (Draft)
                    </button>

                    <button
                        onClick={() => onPublish('publish')}
                        disabled={loading}
                        className="flex-1 md:flex-none px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 disabled:opacity-50 transform active:scale-95"
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <UploadCloud size={18} />}
                        直接發佈 (Publish)
                    </button>
                </div>
            </div>
        </div>
    );
};
