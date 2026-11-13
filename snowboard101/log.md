# LLM Wiki 操作日誌（append-only）

## [2026-11-13] discuss | 先討論後生成
- 使用者從作業規格確認主題可自由選擇，決定「單板滑雪入門教學」並要求開始製作。
- 決定教學對象完全新手，範圍從裝備到連續 S Turn 與安全；刻滑只提示不深入。

## [2026-11-13] ingest | S01: Learn to Snowboard: Quick and Easy Tips for Beginners
- 查閱公開資料：https://www.burton.com/en-us/blogs/the-burton-blog/learn-to-snowboard
- 建立 `raw/S01.md` 固定閱讀筆記，抽取 4 項改寫重點。

## [2026-11-13] ingest | S02: Goofy vs. Regular: The Official Guide to Snowboard Stances
- 查閱公開資料：https://www.burton.com/en-us/blogs/the-burton-blog/goofy-vs-regular
- 建立 `raw/S02.md` 固定閱讀筆記，抽取 5 項改寫重點。

## [2026-11-13] ingest | S03: How to Put on Your Snowboard Boots and Bindings
- 查閱公開資料：https://www.rei.com/learn/expert-advice/how-to-put-on-your-snowboard-boots-and-bindings.html
- 建立 `raw/S03.md` 固定閱讀筆記，抽取 5 項改寫重點。

## [2026-11-13] ingest | S04: How to Snowboard
- 查閱公開資料：https://www.rei.com/learn/expert-advice/how-to-snowboard.html
- 建立 `raw/S04.md` 固定閱讀筆記，抽取 5 項改寫重點。

## [2026-11-13] ingest | S05: Your Responsibility Code (2022)
- 查閱公開資料：https://www.nsaa.org/nsaa/safety/
- 建立 `raw/S05.md` 固定閱讀筆記，抽取 6 項改寫重點。

## [2026-11-13] ingest | S06: A Beginner’s Guide on How to Set up a Snowboard
- 查閱公開資料：https://www.burton.com/en-us/blogs/the-burton-blog/how-to-set-up-a-snowboard
- 建立 `raw/S06.md` 固定閱讀筆記，抽取 5 項改寫重點。

## [2026-11-13] synthesis | wiki 知識層
- 以六篇 raw 閱讀筆記建立 7 篇概念頁，更新 wiki/index.md，加入相互連結和來源 ID。
- 將「前腳 vs 前刃」「單次轉彎名稱差異」「初學者 Binding 沒有唯一角度」設為優先檢查點。

## [2026-11-13] query | 用 Wiki 產生課程大綱
- 查詢問題：「如何教一位完全不熟悉單板滑雪的人了解裝備、站姿、控刃與連續轉彎，並理解雪場安全？」
- 讀取 wiki/index.md → 裝備／站姿／滑行／控刃／轉彎／安全／學習地圖。
- 決定將簡報分成導讀、裝備、站姿、裝備設定、基礎滑行、控刃、落葉飄、單次轉彎、S Turn、安全、測驗、總結，共 12 頁。

## [2026-11-13] lint | 第一次來源追溯稽核，失敗
- `tests/audit.py` 偵測到 HTML 第 9 頁來源 `S07` 不存在。結果：`RESULT: 1 failures`。
- 這是實際檢查發現的可追溯性錯誤，不代表原始滑雪教學知識本身錯誤。

## [2026-11-13] repair | 修正第 9 頁來源 ID
- 將 `S01,S07` 改成 `S01,S04`，兩篇確實對應單次轉彎與 J/C Turn 的教學。
- 第二次檢查：`RESULT: 0 failures`。

## [2026-11-13] workflow | 將來源檢查前移
- 新增 `workflow/slide-manifest.csv`，規定「先有大綱＋來源對照，後有 HTML」。
- 擴充稽核程式逐頁比對來源、Wiki、標題與測驗，並檢查 JS 語法。
- 第三次靜態檢查 17 項通過，`RESULT: 0 failures`。

## [2026-11-13] browser-check | 受測試環境限制，未完成
- Playwright 打開 `file://` 與 `http://127.0.0.1` 時，Chromium 回報 `ERR_BLOCKED_BY_ADMINISTRATOR`。
- 沒有捏造為通過；後續需使用者在可正常連網的電腦及 GitHub Pages 公開網址進行人工點擊測試。
