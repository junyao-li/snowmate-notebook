const topics = [
  { id: "snow-safety", href: "pages/snow-safety.html", label: "雪道安全與禮儀", shortLabel: "安全" },
  { id: "gear-preparation", href: "pages/gear-preparation.html", label: "裝備與行前準備", shortLabel: "裝備" },
  { id: "japan-resort-planning", href: "pages/japan-resort-planning.html", label: "日本雪場選擇", shortLabel: "選雪場" },
  { id: "trip-planning", href: "pages/trip-planning.html", label: "滑雪行程規劃", shortLabel: "行程" }
];

function fromRoot(path) {
  const root = document.body.dataset.root || ".";
  return `${root}/${path}`;
}

function renderHeader() {
  const mount = document.querySelector("[data-site-header]");
  if (!mount) return;
  const currentPage = document.body.dataset.page;
  const links = topics.map((topic) => {
    const current = currentPage === topic.id ? ' aria-current="page"' : "";
    return `<a href="${fromRoot(topic.href)}"${current}>${topic.shortLabel}</a>`;
  }).join("");

  mount.innerHTML = `
    <a class="skip-link" href="#main-content">跳到主要內容</a>
    <header class="site-header">
      <div class="header-inner">
        <a class="brand" href="${fromRoot("index.html")}" ${currentPage === "home" ? 'aria-current="page"' : ""}>
          <span class="brand-mark" aria-hidden="true">S</span>
          <span class="brand-copy">SnowMate 滑雪筆記<small>Ski Starter Notebook</small></span>
        </a>
        <button class="menu-toggle" type="button" aria-label="開啟導覽選單" aria-expanded="false" aria-controls="site-navigation"><span aria-hidden="true"></span></button>
        <nav class="site-nav" id="site-navigation" aria-label="主要導覽" data-open="false">
          ${links}
          <a class="rules-link" href="${fromRoot("AGENTS.md")}">專案規則</a>
        </nav>
      </div>
    </header>`;

  const button = mount.querySelector(".menu-toggle");
  const navigation = mount.querySelector(".site-nav");
  button.addEventListener("click", () => {
    const isOpen = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isOpen));
    button.setAttribute("aria-label", isOpen ? "開啟導覽選單" : "關閉導覽選單");
    navigation.dataset.open = String(!isOpen);
  });
  navigation.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-label", "開啟導覽選單");
      navigation.dataset.open = "false";
    }
  });
}

function renderFooter() {
  const mount = document.querySelector("[data-site-footer]");
  if (!mount) return;
  mount.innerHTML = `
    <footer class="site-footer">
      <div class="footer-inner">
        <div>
          <p class="footer-title">SnowMate 滑雪新手筆記</p>
          <p class="footer-copy">提供學習與行前準備方向，不顯示即時雪況、票價或營運狀態。出發前請查看雪場官方公告、現場標誌與工作人員指示。</p>
        </div>
        <nav class="footer-links" aria-label="頁尾導覽">
          <a href="${fromRoot("index.html")}">首頁</a>
          <a href="${fromRoot("AGENTS.md")}">AGENTS.md</a>
          <a href="${fromRoot("README.md")}">README</a>
        </nav>
        <div class="footer-meta">SnowMate 系列 · 全新表述 · <span data-year></span></div>
      </div>
    </footer>`;
  mount.querySelector("[data-year]").textContent = new Date().getFullYear();
}

function setupGearChecklist() {
  const widget = document.querySelector("[data-gear-checklist]");
  if (!widget) return;
  const boxes = [...widget.querySelectorAll('input[type="checkbox"]')];
  const fill = widget.querySelector(".progress-fill");
  const output = widget.querySelector("[data-gear-count]");

  function update() {
    const checked = boxes.filter((box) => box.checked).length;
    const percent = boxes.length ? Math.round((checked / boxes.length) * 100) : 0;
    fill.style.setProperty("--progress", `${percent}%`);
    output.textContent = `${checked} / ${boxes.length}`;
  }
  boxes.forEach((box) => box.addEventListener("change", update));
  update();
}

function setupBudgetLab() {
  const lab = document.querySelector("[data-budget-lab]");
  if (!lab) return;
  const inputs = [...lab.querySelectorAll("input")];
  const totalOutput = lab.querySelector("[data-total]");
  const personOutput = lab.querySelector("[data-per-person]");
  const format = new Intl.NumberFormat("zh-TW", { style: "currency", currency: "TWD", maximumFractionDigits: 0 });

  function amount(name) {
    return Math.max(0, Number(lab.querySelector(`[name="${name}"]`).value) || 0);
  }

  function update() {
    const people = Math.max(1, Math.round(amount("people")));
    const days = Math.max(1, Math.round(amount("days")));
    const dailyPerPerson = amount("lift") + amount("rental") + amount("food");
    const total = people * days * dailyPerPerson + amount("lodging") + amount("transport");
    totalOutput.textContent = format.format(total);
    personOutput.textContent = format.format(total / people);
  }
  inputs.forEach((input) => input.addEventListener("input", update));
  update();
}

renderHeader();
renderFooter();
setupGearChecklist();
setupBudgetLab();
