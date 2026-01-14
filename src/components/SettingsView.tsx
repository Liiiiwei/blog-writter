import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Download, Upload, Trash2 } from 'lucide-react';
import { getStoredApiKey, setStoredApiKey } from '../services/geminiClient';
import { getStorageService } from '../services/storageService';

interface SettingsViewProps {
    onBack: () => void;
}

export function SettingsView({ onBack }: SettingsViewProps) {
    // Gemini API Settings
    const [apiKey, setApiKey] = useState('');
    const [apiKeyVisible, setApiKeyVisible] = useState(false);

    // WordPress Settings
    const [wpUrl, setWpUrl] = useState('');
    const [wpUser, setWpUser] = useState('');
    const [wpPassword, setWpPassword] = useState('');

    // Data Management
    const [importing, setImporting] = useState(false);
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        // Load existing settings
        const storedApiKey = getStoredApiKey();
        if (storedApiKey) setApiKey(storedApiKey);

        const storedWpUrl = localStorage.getItem('wp_site_url');
        const storedWpUser = localStorage.getItem('wp_username');
        const storedWpPassword = localStorage.getItem('wp_app_password');

        if (storedWpUrl) setWpUrl(storedWpUrl);
        if (storedWpUser) setWpUser(storedWpUser);
        if (storedWpPassword) setWpPassword(storedWpPassword);
    }, []);

    const handleSaveGemini = () => {
        if (!apiKey.trim()) {
            alert('請輸入有效的 API Key');
            return;
        }
        setStoredApiKey(apiKey.trim());
        alert('Gemini API Key 已儲存！');
    };

    const handleSaveWordPress = () => {
        localStorage.setItem('wp_site_url', wpUrl.trim());
        localStorage.setItem('wp_username', wpUser.trim());
        localStorage.setItem('wp_app_password', wpPassword.trim());
        alert('WordPress 設定已儲存！');
    };

    const handleExport = async () => {
        setExporting(true);
        try {
            const storage = getStorageService();
            await storage.init();
            await storage.exportArticles();
        } catch (error: any) {
            alert(`匯出失敗: ${error.message}`);
        } finally {
            setExporting(false);
        }
    };

    const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setImporting(true);
        try {
            const storage = getStorageService();
            await storage.init();
            const result = await storage.importArticles(file);
            alert(`匯入完成！成功: ${result.success} 篇，失敗: ${result.failed} 篇`);
        } catch (error: any) {
            alert(`匯入失敗: ${error.message}`);
        } finally {
            setImporting(false);
            event.target.value = '';
        }
    };

    const handleClearAll = async () => {
        if (!confirm('確定要清空所有文章？此操作無法復原！')) return;

        try {
            const storage = getStorageService();
            await storage.init();
            await storage.clearAllArticles();
            alert('已清空所有文章');
        } catch (error: any) {
            alert(`清空失敗: ${error.message}`);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3 border-b pb-4">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="返回"
                >
                    <ArrowLeft size={20} />
                </button>
                <h2 className="text-2xl font-light text-gray-800">設定</h2>
            </div>

            {/* Gemini API Settings */}
            <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-medium text-gray-800">Gemini AI 設定</h3>
                <div className="space-y-3">
                    <label className="block">
                        <span className="text-sm text-gray-600 mb-1 block">
                            API Key <span className="text-red-500">*</span>
                        </span>
                        <div className="flex gap-2">
                            <input
                                type={apiKeyVisible ? 'text' : 'password'}
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="AIza..."
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                            />
                            <button
                                onClick={() => setApiKeyVisible(!apiKeyVisible)}
                                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
                            >
                                {apiKeyVisible ? '隱藏' : '顯示'}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            請至{' '}
                            <a
                                href="https://aistudio.google.com/app/apikey"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                Google AI Studio
                            </a>{' '}
                            取得免費 API Key
                        </p>
                    </label>
                    <button
                        onClick={handleSaveGemini}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Save size={16} />
                        儲存 API Key
                    </button>
                </div>
            </section>

            {/* WordPress Settings */}
            <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-medium text-gray-800">WordPress 發佈設定（選填）</h3>
                <div className="space-y-3">
                    <label className="block">
                        <span className="text-sm text-gray-600 mb-1 block">網站網址</span>
                        <input
                            type="url"
                            value={wpUrl}
                            onChange={(e) => setWpUrl(e.target.value)}
                            placeholder="https://yoursite.com"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                        />
                    </label>
                    <label className="block">
                        <span className="text-sm text-gray-600 mb-1 block">使用者名稱</span>
                        <input
                            type="text"
                            value={wpUser}
                            onChange={(e) => setWpUser(e.target.value)}
                            placeholder="admin"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                        />
                    </label>
                    <label className="block">
                        <span className="text-sm text-gray-600 mb-1 block">Application Password</span>
                        <input
                            type="password"
                            value={wpPassword}
                            onChange={(e) => setWpPassword(e.target.value)}
                            placeholder="xxxx xxxx xxxx xxxx xxxx xxxx"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                        />
                    </label>
                    <button
                        onClick={handleSaveWordPress}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Save size={16} />
                        儲存 WordPress 設定
                    </button>
                </div>
            </section>

            {/* Data Management */}
            <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-medium text-gray-800">資料管理</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button
                        onClick={handleExport}
                        disabled={exporting}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                        <Download size={16} />
                        {exporting ? '匯出中...' : '匯出文章'}
                    </button>

                    <label className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                        <Upload size={16} />
                        {importing ? '匯入中...' : '匯入文章'}
                        <input
                            type="file"
                            accept=".json"
                            onChange={handleImport}
                            disabled={importing}
                            className="hidden"
                        />
                    </label>

                    <button
                        onClick={handleClearAll}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        <Trash2 size={16} />
                        清空所有文章
                    </button>
                </div>
                <p className="text-xs text-gray-500">
                    💡 提示：定期匯出文章以備份資料，匯入功能可用於跨裝置同步
                </p>
            </section>
        </div>
    );
}
