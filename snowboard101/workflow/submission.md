# 單板滑雪入門教學｜繳交內容

> **繳交標題：** `【學校簡稱】 【學號】 【系級簡稱】 【姓名】 Snowboard 101：從零開始學單板滑雪`  
> 上列括號欄位需自行填入，避免提交個人資料錯誤。

## 1. LLM Wiki 主題與介紹

我選擇「Snowboard 101：從零開始學單板滑雪」，目的是讓完全沒有滑雪經驗的人透過簡單的文字和原創示意圖，依序了解裝備、Regular／Goofy 站姿、Binding 設定、基礎滑行、前後刃控速、落葉飄、單次轉彎、連續 S Turn，以及雪場安全。

## 2. LLM Wiki 連結或成果

Wiki 資料夾：`wiki/`；索引：`wiki/index.md`；Schema：`AGENTS.md`；原始來源閱讀筆記：`raw/S01.md` 至 `raw/S06.md`。  
共 ingest 六篇外部來源：Burton 3 篇、REI 2 篇、NSAA 1 篇，每篇含原始網址與改寫重點。概念頁面互相連結，並可反查來源。原始閱讀筆記是自製摘要，不是未授權原文複製。

GitHub 專案連結：**【部署後填入 repository 公開網址】**

## 3. 教學 HTML 簡報連結

簡報檔案：`index.html`（12 頁，無需外部套件，含原創 SVG 圖、來源索引與互動測驗）。

GitHub Pages 網址：**【部署後填入 https://帳號.github.io/repo/】**

## 4. Loop / Graph 流程說明

`資料蒐集 → Ingest 六篇來源 → Wiki 概念整理 → Lint → Query Wiki → 大綱／來源清單檢查 → 生成 HTML → 靜態測試 → 修正 → 部署`。

反覆執行兩種 loop：
- Wiki 的來源 ID、概念或連結不一致時，返回知識整理節點修正並重新 lint。
- 大綱或 HTML 的引用有錯時，退回來源清單或簡報生成節點修改，再執行檢查。

流程圖：`workflow/graph.svg`；原始 Mermaid：`workflow/graph.mmd`。

## 5. 實際執行結果或檢查紀錄

首次執行自製 `tests/audit.py`，在第 9 頁的 `data-source-ids` 發現不存在的 `S07`（實際只有 S01～S06）。修正為 `S01,S04` 後，來源檢查通過。新增 `slide-manifest.csv` 前置來源檢查，第三次完整稽核共 17 項 PASS，沒有發現靜態錯誤。詳見 `workflow/checks.md` 與 `workflow/test-results.txt`。

**尚待實測**：本次自動化瀏覽器受環境政策限制，尚未能驗證手機排版、互動點擊及 GitHub Pages 網站是否正常；部署後將補做確認。不能將這些步驟寫成已完成。

## 6. 反思：哪個節點最容易出錯？如何調整？

本次實際發現的問題在「HTML 頁面產生後的來源標記」：LLM 寫成了不存在的 S07。若只看畫面，很容易忽略這個問題。修改前的流程是 HTML 完成後才檢查；修改後增加「大綱來源清單（slide-manifest.csv）」作為 HTML 生成之前的檢查點，並在生成後再逐頁核對。

我學到的不是每次出錯都重新生成整份簡報，而是先找出錯誤出現在哪個節點：來源錯就回去修來源表，內容概念錯就回去修 Wiki，版面或操作錯才回到 HTML 程式。這樣每個 loop 都有明確目的。
