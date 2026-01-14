import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { articleApi } from './services/articleApi';
import { useArticleFlow } from './hooks/useArticleFlow';
import { Tab, ArticleFile } from './types';

// Components
import { InputStep } from './components/steps/InputStep';
import { OutlineStep } from './components/steps/OutlineStep';
import { ArticleStep } from './components/steps/ArticleStep';
import { FinishStep } from './components/steps/FinishStep';
import { LibraryView } from './components/LibraryView';

export default function App() {
    const [activeTab, setActiveTab] = useState<Tab>('draft');
    const [articles, setArticles] = useState<ArticleFile[]>([]);
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
            const data = await articleApi.fetchArticles();
            setArticles(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLibLoading(false);
        }
    };

    const handleLoadArticle = async (filename: string) => {
        setLibLoading(true);
        try {
            const data = await articleApi.getArticle(filename);
            actions.loadArticleData(data.content, filename);
            setActiveTab('draft');
        } catch (e) {
            alert('無法讀取文章內容');
        } finally {
            setLibLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 pb-20">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Header */}
                <header className="text-center mb-8">
                    <motion.h1
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-light text-gray-800 mb-1 tracking-wide"
                    >
                        LIWEI SIA SEO
                    </motion.h1>
                    <p className="text-xs text-gray-500 tracking-[0.3em] uppercase font-light">Strategic Writing Hub</p>
                </header>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 bg-gray-50/50">
                        {['draft', 'library'].map((t) => (
                            <button
                                key={t}
                                onClick={() => setActiveTab(t as Tab)}
                                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors relative ${activeTab === t ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'
                                    }`}
                            >
                                {t === 'draft' ? '構思大綱' : '文章庫存'}
                                {activeTab === t && (
                                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="p-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
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

                <footer className="text-center mt-12 text-xs text-gray-400 tracking-wider">
                    LIWEI SIA STRATEGIC ASSISTANT © 2025
                </footer>
            </div>
        </div>
    );
}
