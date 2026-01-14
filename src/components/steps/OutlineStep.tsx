import React, { useState } from 'react';
import { ArrowLeft, Copy, Check, PenTool, Eye, Edit, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Props {
    outline: string;
    setOutline: (v: string) => void;
    onBack: () => void;
    onGenerateArticle: () => void;
    loading: boolean;
}

export const OutlineStep: React.FC<Props> = ({ outline, setOutline, onBack, onGenerateArticle, loading }) => {
    const [copied, setCopied] = useState(false);
    const [mode, setMode] = useState<'preview' | 'edit'>('preview');

    const handleCopy = () => {
        navigator.clipboard.writeText(`請根據以下大綱為我撰寫文章：\n\n${outline}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-end border-b border-gray-100 pb-4 mb-6">
                <div>
                    <h2 className="text-2xl font-light text-gray-800">大綱確認</h2>
                    <p className="text-sm text-gray-500 mt-1">請檢視 AI 生成的大綱結構，確認無誤後開始撰寫</p>
                </div>
                {/* Mode Toggle */}
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setMode('preview')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${mode === 'preview' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Eye size={16} /> 預覽
                    </button>
                    <button
                        onClick={() => setMode('edit')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${mode === 'edit' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Edit size={16} /> 編輯
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[60vh] flex flex-col transition-shadow hover:shadow-md">
                <div className="flex-1 p-8">
                    {mode === 'preview' ? (
                        <article className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-h2:text-2xl prose-h2:mt-6 prose-li:text-gray-700 text-gray-900">
                            <ReactMarkdown>{outline}</ReactMarkdown>
                        </article>
                    ) : (
                        <textarea
                            className="w-full h-full min-h-[60vh] p-0 border-none focus:ring-0 bg-white text-gray-900 font-mono text-sm leading-relaxed resize-none"
                            value={outline}
                            onChange={(e) => setOutline(e.target.value)}
                            placeholder="在此編輯大綱..."
                        ></textarea>
                    )}
                </div>
            </div>

            {/* Footer Actions */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-100">
                <button
                    onClick={onBack}
                    className="px-6 py-2.5 text-gray-600 hover:text-gray-900 font-medium transition-colors flex items-center gap-2 hover:bg-gray-50 rounded-lg"
                >
                    <ArrowLeft size={18} /> 返回修改設定
                </button>

                <div className="flex gap-3 w-full md:w-auto">
                    <button
                        onClick={handleCopy}
                        className="flex-1 md:flex-none px-5 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                        複製 Prompt
                    </button>

                    <button
                        onClick={onGenerateArticle}
                        disabled={loading}
                        className="flex-1 md:flex-none px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
                    >
                        {loading ? <Loader2 size={20} className="animate-spin" /> : <PenTool size={18} />}
                        開始撰寫文章
                    </button>
                </div>
            </div>
        </div>
    );
};
