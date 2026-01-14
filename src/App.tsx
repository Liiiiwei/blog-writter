import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useArticleFlow } from './hooks/useArticleFlow';
import { getStorageService, Article } from './services/storageService';
import { Settings, Layout, PlusCircle, PenTool } from 'lucide-react';

// Components
import { InputStep } from './components/steps/InputStep';
import { OutlineStep } from './components/steps/OutlineStep';
import { ArticleStep } from './components/steps/ArticleStep';
import { FinishStep } from './components/steps/FinishStep';
import { LibraryView } from './components/LibraryView';
import { SettingsView } from './components/SettingsView';

export default function App() {
    const [activeTab, setActiveTab] = useState<'draft' | 'library' | 'settings'>('draft');
    const [articles, setArticles] = useState<Article[]>([]);
    const [libLoading, setLibLoading] = useState(false);

    const {
        step, setStep,
        loading: flowLoading,
        draft,
        article,
        actions
    } = useArticleFlow();

    // Fetch articles for library
    useEffect(() => {
        if (activeTab === 'library') {
            fetchLibArticles();
        }
    }, [activeTab]);

    const fetchLibArticles = async () => {
        setLibLoading(true);
        try {
            const storage = getStorageService();
            await storage.init();
            const data = await storage.listArticles();
            setArticles(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLibLoading(false);
        }
    };

    const handleLoadArticle = async (articleId: string) => {
        setLibLoading(true);
        try {
            await actions.loadArticleData(articleId);
            setActiveTab('draft');
        } catch (e) {
            alert('無法讀取文章內容');
        } finally {
            setLibLoading(false);
        }
    };

    const handleNewPost = () => {
        if (window.confirm('確定要開始新文章嗎？未儲存的內容將會遺失。')) {
            draft.setTitle('');
            draft.setReference('');
            draft.setCaseContext('');
            draft.setOutline('');
            setStep('input');
            setActiveTab('draft');
        }
    };

    return (
        <div className="flex h-screen bg-stone-50 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 z-20">
                <div className="p-8 pb-4">
                    <h1 className="text-xl font-light text-gray-800 tracking-wider">LIWEI SIA</h1>
                    <p className="text-[10px] text-gray-400 tracking-[0.2em] uppercase mt-1">Strategic Writing Hub</p>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2">
                    <button
                        onClick={handleNewPost}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors mb-6"
                    >
                        <PlusCircle size={18} />
                        開始新文章
                    </button>

                    <div className="space-y-1">
                        <button
                            onClick={() => setActiveTab('draft')}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${activeTab === 'draft' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <PenTool size={18} />
                            撰寫區
                        </button>
                        <button
                            onClick={() => setActiveTab('library')}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${activeTab === 'library' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <Layout size={18} />
                            文章庫存
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${activeTab === 'settings' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <Settings size={18} />
                            系統設定
                        </button>
                    </div>
                </nav>

                <div className="p-4 border-t border-gray-100 text-center">
                    <p className="text-xs text-gray-300">v2.0.1 Stable</p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-hidden relative flex flex-col">
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-12">
                    <div className="max-w-5xl mx-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`${activeTab}-${step}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeTab === 'library' ? (
                                    <LibraryView
                                        articles={articles}
                                        loading={libLoading}
                                        onRefresh={fetchLibArticles}
                                        onLoadArticle={handleLoadArticle}
                                    />
                                ) : activeTab === 'settings' ? (
                                    <SettingsView onBack={() => setActiveTab('draft')} />
                                ) : (
                                    <>
                                        {step === 'input' && (
                                            <InputStep
                                                {...draft}
                                                loading={flowLoading}
                                                onOptimizeTitle={actions.optimizeTitle}
                                                onNext={actions.generateOutline}
                                            />
                                        )}
                                        {step === 'outline' && (
                                            <OutlineStep
                                                outline={draft.outline}
                                                setOutline={draft.setOutline}
                                                loading={flowLoading}
                                                onBack={() => setStep('input')}
                                                onGenerateArticle={actions.generateArticle}
                                            />
                                        )}
                                        {step === 'article' && (
                                            <ArticleStep
                                                {...article}
                                                loading={flowLoading}
                                                onPublish={actions.publish}
                                            />
                                        )}
                                        {step === 'finish' && (
                                            <FinishStep
                                                publishedUrl={article.publishedUrl}
                                                onGoToLibrary={() => setActiveTab('library')}
                                            />
                                        )}
                                    </>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    );
}
