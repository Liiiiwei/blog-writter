import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

interface Props {
    title: string;
    setTitle: (v: string) => void;
    reference: string;
    setReference: (v: string) => void;
    caseContext: string;
    setCaseContext: (v: string) => void;
    articleType: string;
    setArticleType: (v: string) => void;
    loading: boolean;
    onOptimizeTitle: () => void;
    onNext: () => void;
}

export const InputStep: React.FC<Props> = ({
    title, setTitle,
    reference, setReference,
    caseContext, setCaseContext,
    articleType, setArticleType,
    loading,
    onOptimizeTitle,
    onNext
}) => {
    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">文章類型</label>
                <div className="relative">
                    <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 appearance-none"
                        value={articleType}
                        onChange={(e) => setArticleType(e.target.value)}
                    >
                        <option value="general">一般趨勢/觀點 (General Strategy)</option>
                        <option value="tutorial">手把手教學 (How-To Tutorial)</option>
                        <option value="critique">觀點批判/迷思破解 (Critique & Myth Busting)</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">文章標題</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="於此輸入標題..."
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <button
                        onClick={onOptimizeTitle}
                        disabled={loading || (!title && !reference)}
                        className="px-4 py-3 border border-blue-500 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2 bg-white"
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                        AI 建議
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">核心案例/數據</label>
                <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white text-gray-900 placeholder-gray-400"
                    placeholder="請輸入您實際操作過的案例、數據佐證..."
                    rows={4}
                    value={caseContext}
                    onChange={(e) => setCaseContext(e.target.value)}
                ></textarea>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">參考素材與觀點</label>
                <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white text-gray-900 placeholder-gray-400"
                    placeholder="在此紀錄靈感、其他參考網址..."
                    rows={4}
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                ></textarea>
            </div>

            <div className="flex justify-center pt-4">
                <button
                    onClick={onNext}
                    disabled={!title || loading}
                    className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                    {loading ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
                    下一步：初劃大綱
                </button>
            </div>
        </div>
    );
};
