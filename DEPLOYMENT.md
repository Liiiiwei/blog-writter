# Blog Writer - 部署指南

## ✅ 架構優化完成

本專案已完成**全前端化重構**，現在可以作為純靜態網站部署，無需後端伺服器。

## 🎯 主要改進

### 前端化架構
- ✅ 移除 Express 後端依賴
- ✅ 使用 Gemini SDK 直接在瀏覽器中調用 AI API
- ✅ 使用 IndexedDB 儲存文章（本地瀏覽器儲存）
- ✅ 新增設定頁面（API Key 配置、匯出/匯入功能）
- ✅ 支援 WordPress 發佈（直接透過 REST API）

### 使用者體驗提升
- 🚀 零延遲啟動（無需等待後端）
- 💰 零成本部署（靜態託管免費方案）
- 📦 離線可用（文章儲存在瀏覽器）
- 🔄 跨裝置同步（透過匯出/匯入功能）

---

## 📦 部署步驟

### 方案 A: Vercel 部署（推薦）

1. **安裝 Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **登入 Vercel**
   ```bash
   vercel login
   ```

3. **部署專案**
   ```bash
   npm run build
   vercel --prod
   ```

4. **完成！** Vercel 會自動偵測為 Vite 專案並部署

**部署後網址範例**: `https://blog-writer.vercel.app`

---

### 方案 B: Netlify 部署

1. **安裝 Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **登入 Netlify**
   ```bash
   netlify login
   ```

3. **建置並部署**
   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```

---

### 方案 C: GitHub Pages

1. **安裝 gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **更新 vite.config.ts**（設定 base path）
   ```typescript
   export default defineConfig({
     base: '/blog-writer/',  // 改為你的 repo 名稱
     plugins: [react()],
   })
   ```

3. **新增部署指令到 package.json**
   ```json
   {
     "scripts": {
       "deploy": "npm run build && gh-pages -d dist"
     }
   }
   ```

4. **部署**
   ```bash
   npm run deploy
   ```

---

## 🔑 首次使用設定

部署成功後，使用者需要完成以下設定：

### 1. 設定 Gemini API Key（必須）

1. 點擊右上角「設定」圖示
2. 前往 [Google AI Studio](https://aistudio.google.com/app/apikey) 取得免費 API Key
3. 在「Gemini AI 設定」區塊輸入 API Key 並儲存

### 2. 設定 WordPress（選填）

如需發佈文章至 WordPress：

1. 在設定頁面填寫：
   - **網站網址**: 你的 WordPress 網站 URL
   - **使用者名稱**: WordPress 帳號
   - **Application Password**: 在 WordPress 後台生成

2. 生成 Application Password 的步驟：
   - 登入 WordPress 後台
   - 前往「使用者」→「個人資料」
   - 找到「Application Passwords」區塊
   - 輸入名稱（例如：Blog Writer）並點擊「Add New」
   - 複製生成的密碼貼入設定頁面

---

## 📱 使用流程

### 創作文章
1. **填寫基本資訊** → 標題、參考資料、案例背景
2. **生成大綱** → AI 根據輸入生成文章結構
3. **生成文章** → AI 撰寫完整文章（自動儲存至瀏覽器）
4. **發佈或下載** → 可發佈至 WordPress 或下載 Markdown

### 管理文章
- **文章庫存**：查看所有已儲存的文章
- **匯出備份**：下載所有文章為 JSON 檔案
- **匯入同步**：在其他裝置匯入備份檔案

---

## 🛠 本地開發

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 建置生產版本
npm run build

# 預覽生產版本
npm run preview
```

---

## 📝 技術架構

```
前端 (React + Vite)
├─ services/
│  ├─ geminiClient.ts       # Gemini AI 客戶端
│  ├─ storageService.ts     # IndexedDB 儲存服務
│  └─ (已移除 articleApi)
├─ hooks/
│  └─ useArticleFlow.ts     # 文章流程管理
└─ components/
   ├─ SettingsView.tsx      # 設定頁面
   ├─ LibraryView.tsx       # 文章庫存
   └─ steps/                # 各步驟組件

已移除：
✗ server/                   # 後端 Express 服務器
✗ scripts/dev.js            # 開發腳本
```

---

## 🔒 安全性說明

### API Key 安全
- API Key 儲存在瀏覽器 `localStorage`
- **未寫死在程式碼中**，不會外洩
- 建議使用者定期更換 API Key

### 資料隱私
- 所有文章儲存在**使用者本地瀏覽器**（IndexedDB）
- 不會上傳至任何伺服器（除非使用者主動發佈至 WordPress）

---

## 💰 成本分析

| 項目 | 舊架構（後端） | 新架構（全前端） |
|------|--------------|----------------|
| 託管費用 | $5-10/月 | **免費** |
| 維護成本 | 需要維護後端 | **零維護** |
| Gemini API | 免費額度 | 免費額度 |
| **總成本** | $60-120/年 | **$0/年** |

---

## 🎉 完成！

現在你的 Blog Writer 已經是一個完全獨立的前端應用，可以部署在任何靜態託管平台上。

**優點總結**：
- ✅ 部署簡單（一鍵部署）
- ✅ 成本極低（免費方案）
- ✅ 速度更快（無後端延遲）
- ✅ 更安全（無伺服器被攻擊風險）
- ✅ 易於維護（純前端專案）

有任何問題歡迎參考 [Vite 文件](https://vitejs.dev/) 或 [Vercel 文件](https://vercel.com/docs)！
