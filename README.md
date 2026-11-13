# SnowMate 滑雪新手筆記

SnowMate 是一個可持續擴充的繁體中文滑雪知識網站，延續先前 Japan Snow Guide、SnowMate 滑雪安全知識庫與 SnowTrip 工具 Agent 的主題。網站把第一次日本滑雪常見問題整理成安全、裝備、雪場選擇與行程規劃四條學習路線。

本作業的重點不只是一個完成的網站，而是用 `AGENTS.md` 規定新的 AI 之後如何查來源、區分通用與特定雪場規則、建立新頁、更新導覽並完成驗收。

## 目前內容

1. **雪道安全與禮儀**：以 FIS 行為準則建立同場滑行的基本判斷。
2. **裝備與行前準備**：用分層穿著、租借確認與出發檢查降低遺漏。
3. **日本雪場選擇**：依地區、程度、滑行偏好與旅程條件建立候選清單。
4. **滑雪行程規劃**：依規則新增的示例頁，包含預算小工具與官方確認清單。

## 為什麼可以持續擴充？

- `templates/topic-template.html` 提供一致內容骨架。
- `assets/css/styles.css` 統一雪山旅行手冊風格與響應式版面。
- `assets/js/site.js` 統一導覽、頁尾與互動。
- `AGENTS.md` 規定內容邊界、來源層級、命名、新增頁面 SOP 與驗收條件。
- `scripts/check-site.mjs` 自動檢查連結、頁面識別與固定段落。
- `EXTENSION_EXAMPLE.md` 記錄「滑雪行程規劃」如何依規則加入。

## 本機預覽

可直接開啟 `index.html`，或在本資料夾執行：

```bash
python -m http.server 8000
```

再前往 `http://localhost:8000/`。

## 執行驗收

已安裝 Node.js 時，不需要安裝套件：

```bash
node scripts/check-site.mjs
```

也可執行 `npm run check`。

## 上傳 GitHub（網頁介面）

1. 登入 [GitHub](https://github.com/)，按右上角 `+` → `New repository`。
2. Repository name 建議使用 `snowmate-notebook`，可見度選 `Public`。
3. 不勾選自動建立 README，按 `Create repository`。
4. 在空白 Repository 選 `uploading an existing file`。
5. 將本資料夾內所有檔案與資料夾拖入；Repository 根目錄要直接看到 `index.html`、`AGENTS.md` 與 `README.md`。
6. Commit message 填 `Create SnowMate notebook`，按 `Commit changes`。

請建立新的 Repository，不要覆蓋既有的 `japan-snow-guide`，因為兩者是不同作業。

## 啟用 GitHub Pages

1. 進入新 Repository 的 `Settings` → `Pages`。
2. Source 選 `Deploy from a branch`。
3. Branch 選 `main`，資料夾選 `/(root)`，按 `Save`。
4. 等待部署完成，回到 Pages 頁面複製 GitHub 顯示的正式網址。
5. 測試首頁與四個內容頁，再把實際網址填進 `SUBMISSION_DRAFT.md`。

網址通常類似 `https://你的帳號.github.io/snowmate-notebook/`，但必須以 GitHub 實際顯示為準。

## 使用 Git 指令（選用）

```bash
git init -b main
git add .
git commit -m "Create SnowMate notebook"
git remote add origin https://github.com/YOUR-ACCOUNT/snowmate-notebook.git
git push -u origin main
```

## 與先前作業的關係

- Japan Snow Guide：負責探索、收藏與比較日本雪場。
- SnowMate RAG：以有來源文件回答滑雪安全與雪場規則。
- SnowTrip Agent：處理預算、溫度換算與裝備清單工具。
- 本專案：把共同主題整理成可讓 AI 持續新增內容的靜態知識網站。

既有 Japan Snow Guide：<https://junyao-li.github.io/japan-snow-guide/>

## 部署狀態

- GitHub Repository：尚未建立，部署後填入。
- GitHub Pages：尚未啟用，部署後填入。

本文件不會聲稱尚未完成的部署。
