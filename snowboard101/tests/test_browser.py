#!/usr/bin/env python3
"""Playwright browser interaction tests (Chromium)."""
from playwright.sync_api import sync_playwright
from pathlib import Path
root=Path(__file__).resolve().parents[1]
url='http://127.0.0.1:8765/'
def run():
 with sync_playwright() as p:
  browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
  page=browser.new_page(viewport={'width':1440,'height':900},device_scale_factor=1)
  errors=[]
  page.on('pageerror',lambda err:errors.append(str(err)))
  page.goto(url,wait_until='load')
  assert page.locator('section.slide.is-active').count()==1
  assert page.locator('#pageNum').inner_text()=='01 / 12'
  print('PASS | Desktop: 初始頁正確')
  page.locator('#nextBtn').click()
  assert page.locator('#pageNum').inner_text()=='02 / 12'
  page.keyboard.press('ArrowRight')
  assert page.locator('#pageNum').inner_text()=='03 / 12'
  print('PASS | 按鈕 / 方向鍵導覽')
  page.locator('[data-jump="3"]').click()
  assert 'Regular' in page.locator('#stanceTitle').inner_text()
  page.locator('[data-stance="goofy"]').click()
  assert 'Goofy' in page.locator('#stanceTitle').inner_text()
  assert page.locator('#leftBinding text').inner_text()=='R'
  print('PASS | 站姿切換：文字與圖示同步')
  page.locator('#sourceBtn').click()
  assert page.locator('#sourceDialog').evaluate('(d)=>d.open')
  assert page.locator('.source-item').count()>0
  page.locator('#closeSources').click()
  print('PASS | 本頁來源面板可以開啟與關閉')
  page.locator('[data-jump="11"]').click()
  page.locator('[data-question="q1"] [data-answer="a"]').click()
  page.locator('[data-question="q2"] [data-answer="b"]').click()
  page.locator('[data-question="q3"] [data-answer="c"]').click()
  assert '答對 3 / 3' in page.locator('#quizScore').inner_text()
  page.locator('#resetQuiz').click()
  assert '已回答 0 / 3' in page.locator('#quizScore').inner_text()
  print('PASS | 三題測驗計分與重新作答')
  page.screenshot(path=str(root/'workflow'/'desktop-preview.png'),full_page=True)
  assert not errors, errors
  print('PASS | Desktop 無 JavaScript 例外')
  mobile=browser.new_page(viewport={'width':390,'height':844},device_scale_factor=1)
  mobile.on('pageerror',lambda err:errors.append(str(err)))
  mobile.goto(url,wait_until='load')
  assert mobile.locator('#pageNum').inner_text()=='01 / 12'
  mobile.locator('#nextBtn').click()
  assert mobile.locator('#pageNum').inner_text()=='02 / 12'
  for i in range(12):
   mobile.evaluate('(i) => window.location.hash="#p"+String(i+1).padStart(2,"0")',i)
   mobile.reload()
   scrollw=mobile.evaluate('document.documentElement.scrollWidth')
   vieww=mobile.evaluate('window.innerWidth')
   assert scrollw<=vieww+2, f'Mobile horizontal overflow at {i+1}: {scrollw}>{vieww}'
  print('PASS | 390px 手機 12 頁無水平溢出')
  mobile.screenshot(path=str(root/'workflow'/'mobile-preview.png'),full_page=True)
  assert not errors,errors
  print('PASS | Mobile 無 JavaScript 例外')
  browser.close()
if __name__=='__main__':run()
