import React from 'react';
import ReactMarkdown from 'react-markdown';
import { X } from 'lucide-react';

interface Props {
    content: string;
    onClose: () => void;
}

export const PreviewModal: React.FC<Props> = ({ content, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-medium">文章預覽</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <X size={24} />
                    </button>
                </div>
                <div className="prose lg:prose-lg max-w-none p-6 overflow-y-auto">
                    <ReactMarkdown>{content}</ReactMarkdown>
                </div>
            </div>
        </div>
    );
};