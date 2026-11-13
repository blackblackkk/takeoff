import { useEffect, useId, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { LogoBadge, PLANE_UP, PlaneIcon } from "@/components/logo";
import { links } from "@/lib/links";

const destinations = [
  { name: "Дубай", img: "/media/dubai.webp" },
  { name: "Мальдивы", img: "/media/maldives.webp" },
  { name: "Греция", img: "/media/greece.webp" },
  { name: "Таиланд", img: "/media/thailand.webp" },
  { name: "Италия", img: "/media/italy.webp" },
] as const;

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

const supportWithText = (text: string) =>
  `${links.telegramSupport}?text=${encodeURIComponent(text)}`;

/** Gentle fade-up for blocks below the fold. Content stays visible without JS. */
function useReveal() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) return;

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
    for (const item of document.querySelectorAll<HTMLElement>("[data-reveal]")) {
      if (item.getBoundingClientRect().top < window.innerHeight) item.classList.add("is-in");
      else observer.observe(item);
    }
    document.documentElement.classList.add("reveal-on");
    return () => observer.disconnect();
  }, []);
}

/* Line icons, 24×24, drawn with currentColor */

const icons = {
  arrow: <path d="M4 12h15M13 6l6 6-6 6" />,
  telegram: (
    <path d="M21.5 4.5 2.8 11.7c-.9.4-.9 1.2 0 1.5l4.6 1.4 1.8 5.4c.2.6.9.8 1.4.4l2.6-2.2 4.8 3.5c.6.4 1.4.1 1.6-.6L22.6 5.6c.2-.8-.5-1.4-1.1-1.1ZM7.4 14.6l10-6.3-7.6 7.3-.3 3.4" />
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20.5c1.4-3.6 4.4-5.5 8-5.5s6.6 1.9 8 5.5" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M4 20l1.2-4.1A8.5 8.5 0 1 1 8.4 19L4 20Z" />
      <path d="M9.2 8.6c.2-.5.6-.5.9-.5.3 0 .5.2.6.5l.6 1.4c.1.3 0 .6-.2.8l-.5.6c.6 1.2 1.6 2.2 2.8 2.8l.6-.5c.2-.2.5-.3.8-.2l1.4.6c.3.1.5.4.5.7 0 .8-.6 1.6-1.6 1.6-3 0-6.5-3.4-6.5-6.4 0-.6.2-1.1.6-1.4Z" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="10" rx="2.5" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    </>
  ),
  plane: <path d={PLANE_UP} transform="rotate(45 12 12) translate(0.5 0.5) scale(0.96)" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 4.5 6v5.5c0 4.6 3.1 8 7.5 9.5 4.4-1.5 7.5-4.9 7.5-9.5V6L12 3Z" />
      <path d="m8.8 12.2 2.3 2.3 4.3-4.6" />
    </>
  ),
  headset: (
    <>
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      <rect x="3" y="13" width="4" height="6" rx="1.5" />
      <rect x="17" y="13" width="4" height="6" rx="1.5" />
      <path d="M19 19c0 1.4-1.6 2.2-4 2.2h-2" />
    </>
  ),
} as const;

type IconName = keyof typeof icons;

function Icon({ name, className = "icon" }: { name: IconName; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  );
}

const features: readonly { icon: IconName; title: string; text: string }[] = [
  {
    icon: "plane",
    title: "Проверенные партнёры",
    text: "Работаем только с надёжными туроператорами и отелями",
  },
  {
    icon: "globe",
    title: "Гибкий подбор маршрутов",
    text: "Под твой бюджет, даты и настроение",
  },
  {
    icon: "shield",
    title: "Безопасные путешествия",
    text: "На связи 24/7 — до, во время и после поездки",
  },
];

/** Dashed flight path with a small plane at the end. */
function FlightPath({ className, d }: { className: string; d: string }) {
  return (
    <span className={className} aria-hidden="true">
      <svg className="flight-route" viewBox="0 0 200 80" preserveAspectRatio="none">
        <path d={d} />
      </svg>
      <PlaneIcon className="flight-plane" />
    </span>
  );
}

function RequestForm() {
  const nameId = useId();
  const waId = useId();
  const tgId = useId();
  const [state, setState] = useState<"idle" | "error" | "sent">("idle");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const whatsapp = String(data.get("whatsapp") ?? "").trim();
    const telegram = String(data.get("telegram") ?? "").trim();
    if (!name || (!whatsapp && !telegram)) {
      setState("error");
      return;
    }

    const text = [
      "Здравствуйте! Хочу подобрать путешествие.",
      `Имя: ${name}`,
      whatsapp && `WhatsApp: ${whatsapp}`,
      telegram && `Telegram: ${telegram}`,
    ]
      .filter(Boolean)
      .join("\n");

    void navigator.clipboard?.writeText(text).catch(() => undefined);
    window.open(supportWithText(text), "_blank", "noopener,noreferrer");
    setState("sent");
  };

  return (
    <form className="request-form" onSubmit={onSubmit} noValidate>
      <label className="input" htmlFor={nameId}>
        <Icon name="user" />
        <span className="sr-only">Имя</span>
        <input id={nameId} name="name" type="text" autoComplete="given-name" placeholder="Имя" />
      </label>
      <label className="input" htmlFor={waId}>
        <Icon name="whatsapp" />
        <span className="sr-only">WhatsApp</span>
        <input
          id={waId}
          name="whatsapp"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder="WhatsApp (номер)"
        />
      </label>
      <label className="input" htmlFor={tgId}>
        <Icon name="telegram" />
        <span className="sr-only">Telegram</span>
        <input id={tgId} name="telegram" type="text" placeholder="Telegram (@username)" />
      </label>

      <button type="submit" className="btn btn-block">
        Отправить заявку
        <Icon name="arrow" className="btn-arrow" />
      </button>

      <p className={state === "error" ? "form-note is-error" : "form-note"} role="status">
        {state === "error" ? (
          "Укажи имя и хотя бы один контакт — WhatsApp или Telegram."
        ) : state === "sent" ? (
          "Открыли чат поддержки в Telegram — заявка уже в поле ввода, осталось нажать «Отправить»."
        ) : (
          <>
            <Icon name="lock" className="note-icon" />
            Заявка уходит напрямую в наш Telegram, на сайте данные не хранятся
          </>
        )}
      </p>
    </form>
  );
}

export function HomePage() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const policyTitleId = useId();
  useReveal();

  return (
    <>
      <header className="wrap site-header">
        <a href="#top" className="logo-link" aria-label="take off — на главную">
          <LogoBadge className="logo-badge" />
        </a>
        <nav className="site-nav" aria-label="Разделы">
          <a href="#about">О нас</a>
          <a href="#destinations">Направления</a>
          <a className="btn btn-small" href="#contacts">
            <Icon name="telegram" className="btn-icon" />
            Контакты
          </a>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <img
            className="hero-photo"
            src="/media/hero.webp"
            alt="Девушка в соломенной шляпе на песчаном пляже смотрит на море"
            width={2048}
            height={900}
            fetchPriority="high"
            decoding="async"
          />
          <div className="wrap hero-copy">
            <FlightPath className="flight flight-hero intro" d="M2 78C60 74 130 56 196 6" />
            <h1 className="hero-mark intro" style={delay(80)}>
              take off
            </h1>
            <p className="hero-sub intro" style={delay(180)}>
              Путешествия, которые открывают больше возможностей
            </p>
            <a className="btn btn-large intro" style={delay(280)} href="#request">
              Подобрать путешествие
              <Icon name="arrow" className="btn-arrow" />
            </a>
          </div>
          <svg
            className="hero-wave"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M0 64C220 18 470 6 760 40s520 70 680 10v70H0Z" />
          </svg>
        </section>

        <section id="about" className="wrap about">
          <img
            className="about-photo"
            src="/media/resort.webp"
            alt="Бунгало над бирюзовой лагуной и бассейн среди пальм"
            width={1760}
            height={848}
            loading="lazy"
            decoding="async"
            data-reveal
          />
          <div className="about-copy" data-reveal style={delay(100)}>
            <h2 className="title">
              Более <span className="accent">20</span> направлений для твоего идеального отдыха
            </h2>
            <p className="text">От популярных курортов до экзотических островов.</p>
            <p className="text text-small">
              take off — сервис путешествий для девушек: подбираем поездку под твой бюджет и
              даты, помогаем с организацией и остаёмся на связи на каждом этапе.
            </p>
          </div>
        </section>

        <section id="destinations" className="wrap destinations">
          <h2 className="section-title" data-reveal>
            <span>Популярные направления</span>
          </h2>
          <ul className="cards">
            {destinations.map((d, i) => (
              <li key={d.name} data-reveal style={delay(70 * i)}>
                <a
                  className="card"
                  href={supportWithText(`Здравствуйте! Интересует поездка: ${d.name}.`)}
                  {...external}
                  aria-label={`${d.name} — узнать о поездке в Telegram`}
                >
                  <img
                    src={d.img}
                    alt=""
                    width={656}
                    height={624}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="card-name">{d.name}</span>
                </a>
              </li>
            ))}
          </ul>

          <ul className="features">
            {features.map((f, i) => (
              <li key={f.title} data-reveal style={delay(90 * i)}>
                <span className="feature-icon">
                  <Icon name={f.icon} />
                </span>
                <span>
                  <strong>{f.title}</strong>
                  <span className="feature-text">{f.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section id="request" className="wrap">
          <div className="request" data-reveal>
            <img
              className="request-photo"
              src="/media/beach.webp"
              alt=""
              width={1860}
              height={508}
              loading="lazy"
              decoding="async"
            />
            <div className="request-copy">
              <h2 className="title">Готова открыть новые горизонты?</h2>
              <p className="text">Оставь контакты, и мы подберём лучшее путешествие для тебя</p>
            </div>
            <RequestForm />
          </div>
        </section>
      </main>

      <footer id="contacts" className="wrap site-footer">
        <div className="footer-row">
          <div className="footer-brand">
            <LogoBadge className="logo-badge" />
            <p>Путешествия, которые открывают больше возможностей</p>
          </div>
          <a className="footer-link" href={links.telegramSupport} {...external}>
            <Icon name="headset" />
            <span>
              Поддержка
              <small>@TAKEOFF_SUP · 24/7</small>
            </span>
          </a>
          <a className="footer-link" href={links.telegramChannel} {...external}>
            <Icon name="telegram" />
            <span>
              Telegram-канал
              <small>@takeoff_service</small>
            </span>
          </a>
          <FlightPath
            className="flight flight-footer"
            d="M4 76c30-10 40-40 70-36s30 30 60 18 40-40 62-52"
          />
        </div>
        <div className="footer-bottom">
          <span>© take off</span>
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
          Сайт take off — информационная визитка без регистрации и личного кабинета. Мы не
          собираем и не храним персональные данные посетителей на сайте.
        </p>
        <p>
          Форма заявки ничего не отправляет на наш сервер: она лишь готовит текст и открывает
          чат поддержки в Telegram. Заявка уходит, только когда вы сами нажмёте «Отправить» в
          Telegram, и дальше Telegram обрабатывает данные по своим правилам.
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
