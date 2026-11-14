import { useId, useRef, useState } from "react";
import { Logo } from "@/components/logo";
import { AddToHomeHint } from "@/components/add-to-home-hint";
import { links } from "@/lib/links";

const reasons = [
  { title: "Поддержка 24/7", text: "Наша команда всегда на связи." },
  { title: "Проверенные партнёры", text: "Сотрудничаем с надёжными компаниями." },
  { title: "Выгодные условия", text: "Финансовые программы и помощь в организации поездок." },
] as const;

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

export function HomePage() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const policyTitleId = useId();
  const [leadNote, setLeadNote] = useState("");
  const [sending, setSending] = useState(false);

  return (
    <>
      <header className="wrap site-header">
        <a href="#top" aria-label="TAKE OFF, на главную">
          <Logo />
        </a>
        <nav className="site-nav" aria-label="Разделы">
          <a className="nav-page" href="#why">
            Почему мы
          </a>
          <a className="btn btn-quiet btn-small" href={links.telegramSupport} {...external}>
            Написать нам
          </a>
        </nav>
      </header>

      <main id="top">
        <section className="wrap hero">
          <div>
            <h1 className="title-xl">Путешествуй выгоднее</h1>
            <p className="text">
              TAKE OFF — сервис путешествий для девушек. Подбираем поездку, помогаем с организацией
              и остаёмся на связи на каждом этапе.
            </p>
            <div className="actions">
              <a className="btn" href={links.telegramSupport} {...external}>
                Написать в поддержку
              </a>
              <a className="btn btn-quiet" href={links.telegramChannel} {...external}>
                Telegram-канал
              </a>
            </div>
          </div>
        </section>

        <section id="why" className="wrap section">
          <h2 className="title-lg">Почему TAKE OFF</h2>
          <dl className="why-list">
            {reasons.map((item) => (
              <div key={item.title}>
                <dt>{item.title}</dt>
                <dd>{item.text}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="contacts" className="wrap section">
          <div className="contact">
            <h2 className="title-lg">Будем на связи</h2>
            <p className="text">
              Оставьте контакт — заявка придёт уведомлением в Telegram. Или напишите в поддержку сами.
            </p>
            <form
              className="lead-form"
              onSubmit={async (event) => {
                event.preventDefault();
                const form = event.currentTarget;
                const data = new FormData(form);
                const payload = {
                  name: String(data.get("name") || ""),
                  whatsapp: String(data.get("whatsapp") || ""),
                  telegram: String(data.get("telegram") || ""),
                  company: String(data.get("company") || ""),
                };
                if (payload.name.trim().length < 2 || (!payload.whatsapp.trim() && !payload.telegram.trim())) {
                  setLeadNote("Укажите имя и хотя бы один контакт — WhatsApp или Telegram.");
                  return;
                }
                setSending(true);
                setLeadNote("");
                try {
                  const response = await fetch("/api/lead", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify(payload),
                  });
                  const result = (await response.json()) as { ok?: boolean };
                  if (!response.ok || !result.ok) throw new Error("lead");
                  form.reset();
                  setLeadNote("Заявка отправлена. Мы увидим её в Telegram.");
                } catch {
                  const lines = ["Здравствуйте! Хочу подобрать путешествие.", `Имя: ${payload.name.trim()}`];
                  if (payload.whatsapp.trim()) lines.push(`WhatsApp: ${payload.whatsapp.trim()}`);
                  if (payload.telegram.trim()) lines.push(`Telegram: ${payload.telegram.trim()}`);
                  window.open(
                    `https://t.me/TAKEOFF_SUP?text=${encodeURIComponent(lines.join("\n"))}`,
                    "_blank",
                    "noopener,noreferrer",
                  );
                  setLeadNote("Не удалось отправить уведомление. Открыли чат поддержки — нажмите «Отправить».");
                } finally {
                  setSending(false);
                }
              }}
            >
              <input className="field" name="name" autoComplete="name" placeholder="Имя" required />
              <input className="field" name="whatsapp" autoComplete="tel" inputMode="tel" placeholder="WhatsApp" />
              <input className="field" name="telegram" autoComplete="off" placeholder="Telegram (@username)" />
              <input className="hp" name="company" tabIndex={-1} autoComplete="off" aria-hidden />
              <button className="btn" type="submit" disabled={sending}>
                {sending ? "Отправляем…" : "Оставить контакт"}
              </button>
              <p className="form-note" role="status">
                {leadNote}
              </p>
            </form>
            <div className="actions">
              <a className="btn btn-quiet" href={links.telegramSupport} {...external}>
                Написать в поддержку
              </a>
              <a className="btn btn-quiet" href={links.telegramChannel} {...external}>
                Telegram-канал
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="wrap site-footer">
        <span>© TAKE OFF</span>
        <button
          type="button"
          className="link-button"
          onClick={() => dialogRef.current?.showModal()}
        >
          Политика конфиденциальности
        </button>
      </footer>

      <dialog ref={dialogRef} className="policy" aria-labelledby={policyTitleId}>
        <h2 id={policyTitleId}>Политика конфиденциальности</h2>
        <p>
          На сайте есть форма заявки. Имя и контакт отправляются сообщением в Telegram и на сайте не
          сохраняются.
        </p>
        <p>
          Кнопки ведут в Telegram. Если вы напишете в поддержку или подпишетесь на канал, Telegram
          обрабатывает данные по своим правилам.
        </p>
        <p>
          Технические данные браузера используются только чтобы страница корректно открылась.
        </p>
        <form method="dialog">
          <button type="submit" className="btn">
            Закрыть
          </button>
        </form>
      </dialog>
      <AddToHomeHint />
    </>
  );
}
