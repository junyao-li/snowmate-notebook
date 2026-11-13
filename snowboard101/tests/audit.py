#!/usr/bin/env python3
"""Static reproducible audit; run from any directory."""
from pathlib import Path
import re,sys,csv,subprocess,tempfile
from bs4 import BeautifulSoup
root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text(encoding='utf8')
soup=BeautifulSoup(html,'html.parser')
problems=[]
def check(cond,msg):
 print(('PASS' if cond else 'FAIL')+' | '+msg)
 if not cond:problems.append(msg)
raw={p.stem for p in (root/'raw').glob('S*.md')}
slides=soup.select('section.slide')
wiki_pages=list((root/'wiki').glob('*.md'))
check(len(raw)>=5, f'原始來源筆記至少 5 份（實際 {len(raw)}）')
check(len(slides)==12, f'HTML 12 頁（實際 {len(slides)}）')
check(len(wiki_pages)>=7,f'知識頁與索引存在（實際 {len(wiki_pages)}）')
check(all(slide.get('data-wiki') for slide in slides),'所有投影片都標記 Wiki 頁面')
check(all((root/'wiki'/slide.get('data-wiki')).exists() for slide in slides),'投影片對應 Wiki 檔案均存在')
refs=set()
for s in slides:
 refs.update((s.get('data-source-ids') or '').split(','))
refs={x.strip() for x in refs if x.strip()}
check(not (refs-raw),'所有 HTML 來源代碼有效（未知：'+','.join(sorted(refs-raw))+'）')
check(raw<=refs,'每份 ingest 至少被一頁簡報使用（未使用：'+','.join(sorted(raw-refs))+'）')
check('function move(' in html and 'data-answer' in html and 'sourceDialog' in html,'簡報具備導覽、測驗及來源視窗程式')
for file in wiki_pages:
 text=file.read_text(encoding='utf8')
 for target in re.findall(r'\]\(([^)]+)\)',text):
  if '://' in target or target.startswith('#'):continue
  if not (file.parent/target).exists():problems.append(f'{file.name} 指向不存在檔案 {target}')
check(not any('指向不存在檔案' in x for x in problems),'Wiki 站內 Markdown 連結均有效')
check((root/'AGENTS.md').exists() and (root/'log.md').exists(),'Schema 與操作日誌存在')
check(not re.search(r'https://(?:your|你的帳號)\.github\.io',html),'HTML 沒有捏造公開網址')
manifest=list(csv.DictReader((root/'workflow/slide-manifest.csv').open(encoding='utf8')))
check(len(manifest)==len(slides),'教學大綱頁數與 HTML 對應')
check(all(s.get('data-wiki')==manifest[i]['wiki_page'] and
          set(s.get('data-source-ids','').split(','))==set(manifest[i]['source_ids'].split(';'))
          for i,s in enumerate(slides)),'每一頁 HTML 與預先整理的 Wiki/來源大綱一致')
check(all(len(s.select('h1,h2'))>0 for s in slides),'每頁都有教學標題')
check(len(soup.select('.question'))==3 and all(len(q.select('[data-answer]'))==3 for q in soup.select('.question')),'三題互動測驗、各有三個選項')
check(all(s.get('aria-label') for s in soup.select('svg[role="img"]')),'教學 SVG 圖具有無障礙文字')
js=soup.find_all('script')[-1].get_text()
with tempfile.NamedTemporaryFile('w',suffix='.js',encoding='utf8') as t:
 t.write(js);t.flush()
 result=subprocess.run(['node','--check',t.name],capture_output=True,text=True)
check(result.returncode==0,'Node.js JavaScript 語法檢查通過')
print(f'\nRESULT: {len(problems)} failures')
sys.exit(1 if problems else 0)
