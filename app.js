(() => {
  const dock = document.querySelector(".home-dock");
  if (dock) {
    const captions = {
      ios: [
        "Нажмите квадрат со стрелкой вверх — он в центре нижней панели Safari.",
        "В меню выберите «На экран „Домой“», затем «Добавить» справа сверху.",
      ],
      android: [
        "Нажмите три точки в правом верхнем углу Chrome.",
        "Выберите «Добавить на главный экран» или «Установить приложение».",
      ],
    };
    const text = dock.querySelector(".caption-text");
    const arrow = dock.querySelector(".point-down");
    let platform = "ios";
    let step = 0;
    let timer = 0;

    const paint = () => {
      dock.querySelectorAll(".home-dock-switch button").forEach((button) => {
        const on = button.getAttribute("data-platform") === platform;
        button.classList.toggle("is-on", on);
        button.setAttribute("aria-selected", on ? "true" : "false");
      });
      dock.querySelectorAll(".dock-steps").forEach((list) => {
        const on = list.getAttribute("data-steps") === platform;
        list.classList.toggle("is-active", on);
        if (!on) return;
        list.querySelectorAll(".step-card").forEach((card) => {
          card.classList.toggle("is-hot", Number(card.getAttribute("data-step")) === step);
        });
      });
      text.textContent = captions[platform][step];
      arrow.classList.toggle("is-hidden", !(platform === "ios" && step === 0));
    };

    const play = () => {
      window.clearInterval(timer);
      timer = window.setInterval(() => {
        step = step === 0 ? 1 : 0;
        paint();
      }, 2800);
    };

    const ios =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    platform = /Android/i.test(navigator.userAgent) && !ios ? "android" : "ios";
    paint();
    play();

    dock.querySelectorAll(".home-dock-switch button").forEach((button) => {
      button.addEventListener("click", () => {
        platform = button.getAttribute("data-platform");
        step = 0;
        paint();
        play();
      });
    });
    dock.querySelectorAll(".step-card").forEach((card) => {
      card.addEventListener("click", () => {
        step = Number(card.getAttribute("data-step"));
        paint();
        play();
      });
    });
    dock.querySelector(".home-dock-close").addEventListener("click", () => {
      window.clearInterval(timer);
      dock.remove();
      document.documentElement.classList.add("dock-off");
      try {
        localStorage.setItem("takeoff-home-dock-dismissed", "1");
      } catch (e) {}
    });
  }

  const form = document.querySelector(".lead-form");
  if (form) {
    const note = form.querySelector(".form-note");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = new FormData(form);
      if (String(data.get("company") || "").trim()) return;
      const name = String(data.get("name") || "").trim();
      const whatsapp = String(data.get("whatsapp") || "").trim();
      const telegram = String(data.get("telegram") || "").trim();
      if (name.length < 2 || (!whatsapp && !telegram)) {
        note.classList.add("is-error");
        note.textContent = "Укажите имя и хотя бы один контакт — WhatsApp или Telegram.";
        return;
      }
      const lines = ["Новая заявка TAKE OFF", "Имя: " + name];
      if (whatsapp) lines.push("WhatsApp: " + whatsapp);
      if (telegram) lines.push("Telegram: " + telegram);
      note.classList.remove("is-error");
      note.textContent = "Отправляем заявку…";
      const button = form.querySelector("button");
      if (button) button.disabled = true;
      try {
        const body = new URLSearchParams({
          chat_id: "-1003925062267",
          text: lines.join("\n"),
        });
        await fetch("https://api.telegram.org/bot8375908356:AAFuUJ4zQJVUnb7gYCmieBkIfBdrJXG_5Sk/sendMessage", {
          method: "POST",
          mode: "no-cors",
          body,
        });
        form.reset();
        note.textContent = "Заявка отправлена. Мы увидим её в Telegram.";
      } catch {
        const fallback = ["Здравствуйте! Хочу подобрать путешествие.", "Имя: " + name];
        if (whatsapp) fallback.push("WhatsApp: " + whatsapp);
        if (telegram) fallback.push("Telegram: " + telegram);
        window.open("https://t.me/TAKEOFF_SUP?text=" + encodeURIComponent(fallback.join("\n")), "_blank", "noopener,noreferrer");
        note.classList.add("is-error");
        note.textContent = "Не удалось отправить уведомление. Открыли чат поддержки — нажмите «Отправить».";
      } finally {
        if (button) button.disabled = false;
      }
    });
  }

  const dialog = document.querySelector("dialog.policy");
  const policyButton = document.querySelector(".link-button");
  if (dialog && policyButton) policyButton.addEventListener("click", () => dialog.showModal());
})();
