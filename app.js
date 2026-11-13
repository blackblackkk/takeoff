(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Take-off scene: scroll progress → CSS variables */
  const hero = document.querySelector(".takeoff");
  if (hero) {
    if (reduce) {
      hero.classList.add("is-static");
    } else {
      let frame = 0;
      const render = () => {
        frame = 0;
        const rect = hero.getBoundingClientRect();
        const distance = rect.height - window.innerHeight;
        const p = distance > 0 ? Math.min(1, Math.max(0, -rect.top / distance)) : 0;
        const e = p * p * (1.6 - 0.6 * p);
        hero.style.setProperty("--p", p.toFixed(4));
        hero.style.setProperty("--e", e.toFixed(4));
      };
      const onScroll = () => {
        if (!frame) frame = requestAnimationFrame(render);
      };
      hero.classList.add("is-live");
      render();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
    }
  }

  /* Fade-up for blocks below the fold */
  if (!reduce && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    for (const item of document.querySelectorAll("[data-reveal]")) {
      if (item.getBoundingClientRect().top < window.innerHeight) item.classList.add("is-in");
      else observer.observe(item);
    }
    document.documentElement.classList.add("reveal-on");
  }

  /* Header: highlight the current section */
  const header = document.querySelector(".site-header");
  const navLinks = [...document.querySelectorAll(".site-nav a")];
  const ids = navLinks.map((a) => a.getAttribute("href").slice(1));
  const updateNav = () => {
    const line = window.innerHeight * 0.35;
    let current = ids[0];
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= line) current = id;
    }
    const atBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    if (atBottom) current = ids[ids.length - 1];
    for (const a of navLinks) {
      if (a.getAttribute("href") === "#" + current) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    }
    header.classList.toggle("is-solid", current !== ids[0]);
  };
  updateNav();
  window.addEventListener("scroll", updateNav, { passive: true });
  window.addEventListener("resize", updateNav);

  /* Feedback form → prefilled message in the support chat */
  const intros = {
    "Подобрать поездку": "Хочу подобрать поездку.",
    "Задать вопрос": "У меня вопрос.",
    "Оставить отзыв": "Хочу оставить отзыв.",
  };
  const form = document.querySelector(".feedback-form");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const topic = String(data.get("topic") || "Подобрать поездку");
      const name = String(data.get("name") || "").trim();
      const message = String(data.get("message") || "").trim();
      if (!message) return;

      const lines = ["Здравствуйте! " + (intros[topic] || topic)];
      if (name) lines.push("Меня зовут " + name + ".");
      lines.push("", message);
      const text = lines.join("\n");

      if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
      window.open(
        "https://t.me/TAKEOFF_SUP?text=" + encodeURIComponent(text),
        "_blank",
        "noopener,noreferrer",
      );
      form.querySelector(".form-note").textContent =
        "Открыли чат поддержки — сообщение уже в поле ввода, осталось нажать «Отправить». Если текст не появился, он скопирован: просто вставь его.";
    });
  }

  /* Privacy policy dialog */
  const dialog = document.querySelector("dialog.policy");
  const policyButton = document.querySelector(".link-button");
  if (dialog && policyButton) policyButton.addEventListener("click", () => dialog.showModal());
})();
