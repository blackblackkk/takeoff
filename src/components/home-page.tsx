import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type RefObject,
} from "react";
import { Logo } from "@/components/logo";
import { links } from "@/lib/links";

const sections = [
  { id: "top", label: "Главная" },
  { id: "about", label: "О нас" },
  { id: "contacts", label: "Контакты" },
  { id: "feedback", label: "Обратная связь" },
] as const;

const services = [
  {
    title: "Подбираем направление",
    text: "Учитываем бюджет, даты и настроение — море, горы или города.",
  },
  {
    title: "Помогаем с организацией",
    text: "Выгодные условия от проверенных партнёров и финансовые программы.",
  },
  {
    title: "Остаёмся на связи",
    text: "Поддержка 24/7 — до поездки, во время неё и после возвращения.",
  },
] as const;

const facts = [
  { value: "40+", label: "направлений по миру" },
  { value: "24/7", label: "поддержка в Telegram" },
  { value: "100%", label: "проверенные партнёры" },
] as const;

const topics = [
  { label: "Подобрать поездку", intro: "Хочу подобрать поездку." },
  { label: "Задать вопрос", intro: "У меня вопрос." },
  { label: "Оставить отзыв", intro: "Хочу оставить отзыв." },
] as const;

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Fade-up for blocks below the fold. Content stays visible without JS. */
function useReveal() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) return;

    const items = document.querySelectorAll<HTMLElement>("[data-reveal]");
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

    for (const item of items) {
      if (item.getBoundingClientRect().top < window.innerHeight) item.classList.add("is-in");
      else observer.observe(item);
    }
    document.documentElement.classList.add("reveal-on");

    return () => observer.disconnect();
  }, []);
}

/** Which section is on screen, for the header highlight. */
function useActiveSection() {
  const [active, setActive] = useState<string>("top");

  useEffect(() => {
    const update = () => {
      const line = window.innerHeight * 0.35;
      let current: string = sections[0].id;
      for (const { id } of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      setActive(atBottom ? sections[sections.length - 1].id : current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return active;
}

/** Scroll progress through the take-off scene, written to CSS variables. */
function useTakeoff(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-static");
      return;
    }

    let frame = 0;
    const render = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const distance = rect.height - window.innerHeight;
      const p = distance > 0 ? clamp01(-rect.top / distance) : 0;
      // Slow start, then accelerate — like a real take-off run.
      const e = p * p * (1.6 - 0.6 * p);
      el.style.setProperty("--p", p.toFixed(4));
      el.style.setProperty("--e", e.toFixed(4));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    render();
    el.classList.add("is-live");
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref]);
}

function Arrow() {
  return (
    <svg className="btn-arrow" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg className="contact-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M21.4 4.2 2.9 11.3c-1.3.5-1.2 1.2-.2 1.5l4.7 1.5 1.8 5.6c.2.6.4.8.9.8.4 0 .6-.2.9-.5l2.3-2.2 4.8 3.5c.9.5 1.5.2 1.7-.8l3.1-14.7c.3-1.3-.5-1.9-1.5-1.8ZM9 14l9.3-5.9c.4-.3.8-.1.5.2l-7.7 7-.3 3.2L9 14Z"
      />
    </svg>
  );
}

function TakeoffHero() {
  const ref = useRef<HTMLElement>(null);
  useTakeoff(ref);

  return (
    <section id="top" ref={ref} className="takeoff" aria-label="Главная">
      <div className="takeoff-stage">
        <div className="sky" aria-hidden="true" />

        <div className="wrap takeoff-copy">
          <p className="eyebrow intro" style={delay(100)}>
            Сервис путешествий для девушек
          </p>
          <h1 className="title-xl intro" style={delay(220)}>
            Путешествуй <em>легко</em>&nbsp;— мы&nbsp;рядом
          </h1>
          <p className="lead intro" style={delay(380)}>
            TAKE OFF подбирает направления, помогает с организацией поездки и остаётся на связи 24/7,
            чтобы ты путешествовала выгодно и спокойно.
          </p>
          <div className="actions intro" style={delay(520)}>
            <a className="btn" href={links.telegramSupport} {...external}>
              Подобрать поездку
              <Arrow />
            </a>
            <a className="btn btn-glass" href="#about">
              Узнать больше
            </a>
          </div>
        </div>

        <div className="plane-track" aria-hidden="true">
          <img
            className="plane"
            src="/media/plane.webp"
            alt=""
            width={844}
            height={199}
            fetchPriority="high"
            decoding="async"
          />
        </div>

        <div className="clouds" aria-hidden="true" />

        <p className="scroll-hint" aria-hidden="true">
          Листай вниз — взлетаем
          <span />
        </p>
      </div>
    </section>
  );
}

function FeedbackForm() {
  const nameId = useId();
  const messageId = useId();
  const [topic, setTopic] = useState<(typeof topics)[number]>(topics[0]);
  const [sent, setSent] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    if (!message) return;

    const text = [
      `Здравствуйте! ${topic.intro}`,
      name ? `Меня зовут ${name}.` : "",
      "",
      message,
    ]
      .filter((line, i) => line || i === 2)
      .join("\n");

    void navigator.clipboard?.writeText(text).catch(() => undefined);
    window.open(
      `${links.telegramSupport}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
    setSent(true);
  };

  return (
    <form className="feedback-form" onSubmit={onSubmit} data-reveal style={delay(160)}>
      <fieldset className="topics">
        <legend>Тема</legend>
        {topics.map((t) => (
          <label key={t.label} className="chip">
            <input
              type="radio"
              name="topic"
              value={t.label}
              checked={topic === t}
              onChange={() => setTopic(t)}
            />
            <span>{t.label}</span>
          </label>
        ))}
      </fieldset>

      <div className="field">
        <label htmlFor={nameId}>Как тебя зовут</label>
        <input id={nameId} name="name" type="text" autoComplete="given-name" placeholder="Имя" />
      </div>

      <div className="field">
        <label htmlFor={messageId}>Сообщение</label>
        <textarea
          id={messageId}
          name="message"
          rows={4}
          required
          placeholder="Например: хочу на море в мае, бюджет до 100 000 ₽"
        />
      </div>

      <button type="submit" className="btn">
        Отправить в Telegram
        <Arrow />
      </button>

      <p className="form-note" role="status">
        {sent
          ? "Открыли чат поддержки — сообщение уже в поле ввода, осталось нажать «Отправить». Если текст не появился, он скопирован: просто вставь его."
          : "Сообщение откроется в чате нашей поддержки в Telegram — ответим как можно скорее."}
      </p>
    </form>
  );
}

export function HomePage() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const policyTitleId = useId();
  const active = useActiveSection();
  useReveal();

  return (
    <>
      <header className={active === "top" ? "site-header" : "site-header is-solid"}>
        <div className="wrap header-inner">
          <a href="#top" className="logo-link" aria-label="TAKE OFF, на главную">
            <Logo />
          </a>
          <nav className="site-nav" aria-label="Разделы">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                aria-current={active === s.id ? "true" : undefined}
              >
                {s.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main>
        <TakeoffHero />

        <section id="about" className="wrap section about">
          <div className="about-head">
            <div>
              <p className="eyebrow" data-reveal>
                О нас
              </p>
              <h2 className="title-lg" data-reveal style={delay(80)}>
                Открываем мир <em>вместе</em>
              </h2>
              <p className="text" data-reveal style={delay(160)}>
                TAKE OFF — сервис путешествий для девушек. Мы знаем, как важно чувствовать себя
                уверенно в новой стране, поэтому берём на себя поиск выгодных вариантов и
                организацию, а тебе остаётся главное — впечатления.
              </p>
            </div>
            <img
              className="photo about-photo"
              src="/media/coast.jpg"
              alt="Бирюзовое море и белый город на скалах"
              width={1600}
              height={1067}
              loading="lazy"
              decoding="async"
              data-reveal
              style={delay(120)}
            />
          </div>

          <h3 className="subhead" data-reveal>
            Чем мы помогаем
          </h3>
          <ol className="services">
            {services.map((s, i) => (
              <li key={s.title} data-reveal style={delay(110 * i)}>
                <span className="num">0{i + 1}</span>
                <h4>{s.title}</h4>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>

          <dl className="facts">
            {facts.map((f, i) => (
              <div key={f.label} data-reveal style={delay(110 * i)}>
                <dt>{f.value}</dt>
                <dd>{f.label}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="contacts" className="section contacts">
          <div className="wrap">
            <p className="eyebrow" data-reveal>
              Контакты
            </p>
            <h2 className="title-lg" data-reveal style={delay(80)}>
              Мы всегда <em>на связи</em>
            </h2>
            <div className="contact-cards">
              <a
                className="contact-card"
                href={links.telegramSupport}
                {...external}
                data-reveal
                style={delay(120)}
              >
                <TelegramIcon />
                <span className="contact-kind">Поддержка · 24/7</span>
                <span className="contact-handle">@TAKEOFF_SUP</span>
                <span className="contact-text">
                  Ответим на вопросы и поможем подобрать поездку.
                </span>
                <span className="contact-go">
                  Написать <Arrow />
                </span>
              </a>
              <a
                className="contact-card"
                href={links.telegramChannel}
                {...external}
                data-reveal
                style={delay(220)}
              >
                <TelegramIcon />
                <span className="contact-kind">Telegram-канал</span>
                <span className="contact-handle">@takeoff_service</span>
                <span className="contact-text">Идеи для путешествий и выгодные предложения.</span>
                <span className="contact-go">
                  Подписаться <Arrow />
                </span>
              </a>
            </div>
          </div>
        </section>

        <section id="feedback" className="wrap section feedback">
          <div>
            <p className="eyebrow" data-reveal>
              Обратная связь
            </p>
            <h2 className="title-lg" data-reveal style={delay(80)}>
              Куда полетим <em>в этот раз?</em>
            </h2>
            <p className="text" data-reveal style={delay(160)}>
              Расскажи, куда мечтаешь поехать, задай вопрос или поделись впечатлениями о поездке.
              Мы читаем каждое сообщение.
            </p>
          </div>
          <FeedbackForm />
        </section>
      </main>

      <footer className="wrap site-footer">
        <Logo />
        <div className="footer-links">
          <span>© TAKE OFF</span>
          <button
            type="button"
            className="link-button"
            onClick={() => dialogRef.current?.showModal()}
          >
            Политика конфиденциальности
          </button>
        </div>
      </footer>

      <dialog ref={dialogRef} className="policy" aria-labelledby={policyTitleId}>
        <h2 id={policyTitleId}>Политика конфиденциальности</h2>
        <p>
          Сайт TAKE OFF — информационная визитка без регистрации и личного кабинета. Мы не собираем
          и не храним персональные данные посетителей на сайте.
        </p>
        <p>
          Форма обратной связи ничего не отправляет на наш сервер: она лишь готовит текст и
          открывает чат поддержки в Telegram. Сообщение уходит, только когда вы сами нажмёте
          «Отправить» в Telegram, и дальше Telegram обрабатывает данные по своим правилам.
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
    </>
  );
}
