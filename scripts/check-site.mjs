import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDirectory, "..");
const pagesDirectory = join(projectRoot, "pages");
const pageFiles = readdirSync(pagesDirectory).filter((file) => file.endsWith(".html")).sort();
const htmlFiles = ["index.html", ...pageFiles.map((file) => join("pages", file))];
const errors = [];

const read = (path) => readFileSync(join(projectRoot, path), "utf8");
const fail = (file, message) => errors.push(`${file}: ${message}`);

function checkLocalReferences(file, html) {
  const pattern = /\b(?:href|src)=["']([^"']+)["']/g;
  for (const match of html.matchAll(pattern)) {
    const reference = match[1];
    if (/^(?:https?:|mailto:|tel:|data:|javascript:|#)/.test(reference)) continue;
    const [pathPart] = reference.split("#");
    if (!pathPart) continue;
    const target = normalize(resolve(projectRoot, dirname(file), pathPart));
    if (!target.startsWith(projectRoot)) fail(file, `連結超出專案：${reference}`);
    else if (!existsSync(target)) fail(file, `找不到連結目標：${reference}`);
  }
}

function checkMetadata(file, html) {
  if (!/<html\s+[^>]*lang=["']zh-Hant["']/.test(html)) fail(file, "缺少 lang=zh-Hant");
  if (!/<meta\s+charset=["']?UTF-8["']?/i.test(html)) fail(file, "缺少 UTF-8 charset");
  if (!/<title>[^<]{6,}<\/title>/.test(html)) fail(file, "title 過短或缺少");
  if (!/<meta\s+name=["']description["']\s+content=["'][^"']{30,}["']/.test(html)) fail(file, "description 過短或缺少");
  const h1Count = (html.match(/<h1\b/g) || []).length;
  if (h1Count !== 1) fail(file, `H1 數量應為 1，目前為 ${h1Count}`);
  const expectedId = file === "index.html" ? "home" : file.split(/[\\/]/).pop().replace(".html", "");
  if (!html.includes(`data-page="${expectedId}"`)) fail(file, `data-page 應為 ${expectedId}`);
}

function checkTopic(file, html) {
  if (file === "index.html") return;
  for (const id of ["situation", "checklist", "boundaries", "check"]) {
    if (!html.includes(`id="${id}"`)) fail(file, `缺少固定段落 #${id}`);
  }
  if (!/class=["'][^"']*\bscope-note\b/.test(html)) fail(file, "缺少適用範圍 .scope-note");
  if (!/class=["'][^"']*\btoc\b/.test(html)) fail(file, "缺少頁內目錄 .toc");
  if (!/class=["'][^"']*\blesson-nav\b/.test(html)) fail(file, "缺少前後頁 .lesson-nav");
  if (!html.includes("<details")) fail(file, "缺少自我檢查答案");
  if (!/class=["'][^"']*\bkey-takeaway\b/.test(html)) fail(file, "缺少重點摘要 .key-takeaway");
  if (!/class=["'][^"']*\bsafety-note\b/.test(html)) fail(file, "缺少安全／邊界提醒 .safety-note");
}

for (const file of htmlFiles) {
  const html = read(file);
  checkLocalReferences(file, html);
  checkMetadata(file, html);
  checkTopic(file, html);
}

const homepage = read("index.html");
const siteScript = read(join("assets", "js", "site.js"));
for (const file of pageFiles) {
  const slug = file.replace(".html", "");
  if (!homepage.includes(`pages/${file}`)) fail("index.html", `首頁未連到 ${file}`);
  if (!siteScript.includes(`id: "${slug}"`)) fail("assets/js/site.js", `topics 未收錄 ${slug}`);
}

const agents = read("AGENTS.md");
for (const heading of ["## 1. 專案目標", "## 3. 內容與安全邊界", "## 8. 新增頁面 SOP", "## 10. 驗收清單"]) {
  if (!agents.includes(heading)) fail("AGENTS.md", `缺少必要章節：${heading}`);
}

if (pageFiles.length < 3) fail("pages/", "內容頁少於三頁");
if (!existsSync(join(projectRoot, "templates", "topic-template.html"))) fail("templates/", "缺少內容頁範本");

console.log(`檢查 ${htmlFiles.length} 個可瀏覽頁面與 ${pageFiles.length} 個滑雪主題頁。`);
if (errors.length) {
  errors.forEach((error) => console.error(`✗ ${error}`));
  console.error(`\n驗收失敗：${errors.length} 個錯誤。`);
  process.exit(1);
}
console.log("✓ 站內連結、頁面識別、固定內容結構、安全提醒與專案規則皆通過。\n驗收完成：0 errors。");
