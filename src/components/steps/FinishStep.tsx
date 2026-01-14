import React from 'react';
import { CheckCircle, ExternalLink } from 'lucide-react';

interface Props {
    publishedUrl: string;
    onGoToLibrary: () => void;
}

export const FinishStep: React.FC<Props> = ({ publishedUrl, onGoToLibrary }) => {
    return (
        <div className="text-center py-16">
            <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
            <h2 className="text-2xl font-medium text-gray-800 mb-2">筆耕完成</h2>
            <p className="text-gray-600 mb-8">文章已成功同步至網站</p>
            <div className="flex flex-col gap-4 items-center">
                <a
                    href={publishedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors inline-flex items-center gap-2"
                >
                    前往檢查 <ExternalLink size={18} />
                </a>
                <button
                    onClick={onGoToLibrary}
                    className="text-sm text-gray-600 hover:text-blue-600"
                >
                    回到文章庫存
                </button>
            </div>
        </div>
    );
};
