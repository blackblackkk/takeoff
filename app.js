(() => {
  const hint = document.querySelector(".add-to-home");
  const close = document.querySelector(".add-to-home-close");
  if (hint && close) {
    close.addEventListener("click", () => {
      hint.remove();
      try { localStorage.setItem("takeoff-add-to-home-dismissed", "1"); } catch (e) {}
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
