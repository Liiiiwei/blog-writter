# SEO 文章寫手機器人 (Liwei Sia Style)

> 🎯 **全前端 AI 文章生成工具** - 零後端、零成本、即開即用

## ✨ 特色

### 🤖 AI 智能寫作
- **標題優化**：AI 分析並生成 SEO 友善標題
- **大綱生成**：根據主題自動產生文章結構
- **文章撰寫**：完整產出 1500-2500 字的 SEO 文章
- **風格一致**：模仿 Liwei Sia 的專業寫作風格

### 💾 本地優先
- **IndexedDB 儲存**：所有文章儲存在瀏覽器本地
- **離線可用**：文章隨時可訪問，不依賴網路
- **資料安全**：完全掌控自己的內容
- **匯出/匯入**：支援備份與跨裝置同步

### 🚀 WordPress 整合
- **一鍵發佈**：直接發佈至 WordPress 網站
- **草稿/發佈**：支援兩種發佈狀態
- **安全認證**：使用 Application Password

### 🎨 現代化介面
- **流暢動畫**：Framer Motion 驅動
- **響應式設計**：完美支援桌面與行動裝置
- **簡潔設計**：專注於創作體驗

## 🚀 快速開始

### 線上使用（推薦）
部署至 Vercel/Netlify，完全免費：
```bash
npm run build
vercel --prod
```

### 本地開發
```bash
# 安裝依賴
npm install

# 啟動開發服務器
npm run dev

# 訪問 http://localhost:5173
```

### 首次使用設定
1. 點擊右上角「設定」圖示
2. 前往 [Google AI Studio](https://aistudio.google.com/app/apikey) 取得免費 API Key
3. 輸入 API Key 並儲存
4. 開始創作！

## 📖 使用流程

```
1. 輸入標題與參考資料 
   ↓
2. AI 生成文章大綱
   ↓
3. AI 撰寫完整文章（自動儲存至瀏覽器）
   ↓
4. 發佈至 WordPress 或下載 Markdown
```

## 🛠 技術架構

### 前端技術棧
- **框架**: React 18 + TypeScript
- **建置工具**: Vite 5
- **UI**: TailwindCSS + DaisyUI
- **動畫**: Framer Motion
- **儲存**: IndexedDB

### AI 整合
- **模型**: Google Gemini 2.0 Flash
- **調用方式**: 前端直接調用（無後端）

### 部署
- **託管**: Vercel / Netlify / GitHub Pages
- **成本**: 完全免費

## 📚 文件

- [部署指南](./DEPLOYMENT.md) - 詳細的部署教學
- [優化報告](./OPTIMIZATION_REPORT.md) - 架構優化成果

## 🎯 核心風格特徵

根據 Liwei Sia 的現有文章風格分析：

1. **痛點開場**：精確擊中企業主或行銷新手的焦慮
2. **生活化比喻**：將複雜的廣告邏輯比喻為日常事物
3. **極高可讀性**：大量使用清單符號與 H2/H3 分層
4. **誠實建議**：不諱言成本與失敗風險，建立專業信任感

## 🔒 安全性

- **API Key 本地儲存**：僅存於使用者瀏覽器
- **資料本地化**：文章不會上傳至任何伺服器
- **開源透明**：所有程式碼可查閱

## 📝 授權

MIT License

---

**Made with ❤️ by Antigravity (Google Deepmind)**

*為 Liwei Sia 打造的專屬 SEO 寫作助手*
