import React, { useState } from 'react';
import { ArrowLeft, Copy, Check, PenTool } from 'lucide-react';

interface Props {
    outline: string;
    setOutline: (v: string) => void;
    onBack: () => void;
    onGenerateArticle: () => void;
    loading: boolean;
}

export const OutlineStep: React.FC<Props> = ({ outline, setOutline, onBack, onGenerateArticle, loading }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(`請根據以下大綱為我撰寫文章：\n\n${outline}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">大綱確認</label>
                <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm leading-relaxed"
                    rows={20}
                    value={outline}
                    onChange={(e) => setOutline(e.target.value)}
                ></textarea>
            </div>

            <div className="flex justify-between items-center pt-4">
                <button
                    onClick={onBack}
                    className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors flex items-center gap-2"
                >
                    <ArrowLeft size={18} /> 返回修改
                </button>

                <div className="flex gap-3">
                    <button
                        onClick={handleCopy}
                        className="px-4 py-3 border border-gray-300 hover:bg-gray-50 text-gray-600 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                        複製大綱
                    </button>

                    <button
                        onClick={onGenerateArticle}
                        disabled={loading}
                        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        <PenTool size={18} />
                        開始撰寫文章
                    </button>
                </div>
            </div>
        </div>
    );
};
