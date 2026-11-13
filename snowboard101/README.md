# Snowboard 101 — LLM Wiki × 教學 HTML 簡報

**狀態**：已建立 6 份 ingest 閱讀筆記、7 篇互相連結的 wiki 頁面、HTML 簡報與品質檢查規則。GitHub Repository：`https://github.com/junyao-li/snowmate-notebook/tree/main/snowboard101`。公開的 GitHub Pages 網址在啟用與驗證後補上。

## 先討論，後生成
與使用者在本次對話先選擇自由主題「單板滑雪入門教學」，討論教學讀者、知識範圍與 Wiki → HTML → 檢查的路徑後才製作。不是事後捏造的討論。

## 來源資料 ingest
- `raw/S01.md`～`raw/S06.md`：六篇公開來源的中文改寫閱讀筆記，每份保留機構、原始 URL、查閱日期、重點與限制。
- **版權說明**：不大量複製第三方原文與插圖。此處 ingest 的持久化物件是來源閱讀筆記及 URL，不是網站文章的完整鏡像。若老師要求必須保留完整來源，需確認授權後另外匯入。
- `wiki/`：概念知識頁、雙向鏈結、總索引與來源對照。
- `AGENTS.md`：schema 與流程限制。
- `log.md`：實際操作與檢查紀錄。

## 教學 HTML
- `index.html`：單檔離線 HTML 教學簡報，含全部 CSS/JS，直接雙擊即可瀏覽。
- 支援上一頁／下一頁、方向鍵、Home／End、頁碼、課程目錄、參考來源面板、站姿切換與 3 題互動測驗；使用 SVG 圖示，不用外部圖庫。
- 本內容是概念型輔助教材，不能取代雪場正式指導或現場安全規範。

## 檢查與圖表
- `workflow/graph.mmd`：Mermaid Loop / Graph。
- `workflow/graph.svg`：可直接開啟的流程圖，如需 PNG 圖片，完整作業 ZIP 亦有提供。
- `workflow/checks.md`：測試紀錄與反思。
- `tests/audit.py`：來源追溯、連結與頁面架構的可重複檢查。
- `workflow/submission.md`：繳交文字草稿（有必填占位，不編造網站 URL）。

## GitHub Pages 上傳
1. 使用目前已建立的 public repository：`junyao-li/snowmate-notebook`。
2. 把本資料夾**內的內容**上傳至 `snowboard101/` 子資料夾，確保 `index.html` 直接位於 `snowboard101/` 資料夾。
3. 開啟 `Settings → Pages → Build and deployment → Deploy from a branch → main / (root)`。
4. 部署後用無痕視窗／手機開啟公開網址，實際測試上一頁、下一頁、來源與測驗。
5. 將公開網址填入 `workflow/submission.md`，再繳交。

請注意 GitHub 的 repo 設為 public 時，raw/、wiki/、log.md 等也會公開；本專案不包含個人資訊與 API key。

## 本機測試指令（選用）

在專案資料夾內執行 `python tests/audit.py` 做來源、連結、HTML/JS 靜態檢查。
若電腦已安裝 Playwright 與 Chromium，先執行 `python -m http.server 8765`，
另開一個終端執行 `python tests/test_browser.py`（程式預設測試 http://127.0.0.1:8765/）。
本次執行環境的瀏覽器政策禁止本機網址，因此**尚未完成**實際瀏覽器測試。
