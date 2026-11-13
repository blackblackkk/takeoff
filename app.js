(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Gentle fade-up for blocks below the fold */
  if (!reduce && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.1 },
    );
    for (const item of document.querySelectorAll("[data-reveal]")) {
      if (item.getBoundingClientRect().top < window.innerHeight) item.classList.add("is-in");
      else observer.observe(item);
    }
    document.documentElement.classList.add("reveal-on");
  }

  /* Request form → prefilled message in the support chat */
  const form = document.querySelector(".request-form");
  if (form) {
    const note = form.querySelector(".form-note");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const whatsapp = String(data.get("whatsapp") || "").trim();
      const telegram = String(data.get("telegram") || "").trim();
      if (!name || (!whatsapp && !telegram)) {
        note.classList.add("is-error");
        note.textContent = "Укажи имя и хотя бы один контакт — WhatsApp или Telegram.";
        return;
      }
      const lines = ["Здравствуйте! Хочу подобрать путешествие.", "Имя: " + name];
      if (whatsapp) lines.push("WhatsApp: " + whatsapp);
      if (telegram) lines.push("Telegram: " + telegram);
      const text = lines.join("\n");

      if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
      window.open(
        "https://t.me/TAKEOFF_SUP?text=" + encodeURIComponent(text),
        "_blank",
        "noopener,noreferrer",
      );
      note.classList.remove("is-error");
      note.textContent =
        "Открыли чат поддержки в Telegram — заявка уже в поле ввода, осталось нажать «Отправить».";
    });
  }

  /* Privacy policy dialog */
  const dialog = document.querySelector("dialog.policy");
  const policyButton = document.querySelector(".link-button");
  if (dialog && policyButton) policyButton.addEventListener("click", () => dialog.showModal());
})();
