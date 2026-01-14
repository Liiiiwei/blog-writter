import React from 'react';
import ReactMarkdown from 'react-markdown';
import { X } from 'lucide-react';

interface Props {
    content: string;
    onClose: () => void;
}

export const PreviewModal: React.FC<Props> = ({ content, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden border border-gray-100">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/80 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold text-gray-800 tracking-wide">文章預覽</h3>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 bg-white">
                    <article className="prose prose-lg max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h2:mt-8 prose-p:text-gray-700 prose-p:leading-relaxed prose-li:text-gray-700 text-gray-900">
                        <ReactMarkdown>{content}</ReactMarkdown>
                    </article>
                </div>
            </div>
        </div>
    );
};