import { useEffect, useId, useRef, type CSSProperties } from "react";
import { Logo, PLANE_PATH } from "@/components/logo";
import { links } from "@/lib/links";

const steps = [
  {
    title: "Напиши нам",
    text: "Расскажи, куда мечтаешь поехать и в каком формате: одна, с подругой или компанией.",
  },
  {
    title: "Подберём варианты",
    text: "Предложим направления и выгодные условия от проверенных партнёров.",
  },
  {
    title: "Будем рядом",
    text: "Поможем с организацией и останемся на связи 24/7 — до, во время и после поездки.",
  },
] as const;

const reasons = [
  { title: "40+ направлений", text: "Море, горы, города — выбирай настроение." },
  { title: "Поддержка 24/7", text: "Наша команда на связи в любой точке мира." },
  { title: "Проверенные партнёры", text: "Работаем только с надёжными компаниями." },
  { title: "Выгодные условия", text: "Финансовые программы и помощь в организации поездок." },
] as const;

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

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

function FlightPath() {
  const route = "M10 330C120 330 170 210 290 190S470 150 560 30";
  return (
    <svg className="flight" viewBox="0 0 600 360" aria-hidden="true">
      <defs>
        <mask id="flight-mask" maskUnits="userSpaceOnUse">
          <path className="flight-draw" d={route} pathLength={1} />
        </mask>
      </defs>
      <path id="flight-route" className="flight-line" d={route} mask="url(#flight-mask)" />
      <g className="flight-plane" opacity="0">
        <path d={PLANE_PATH} fill="currentColor" transform="scale(1.3)" />
        <animate attributeName="opacity" from="0" to="1" begin="0.9s" dur="0.3s" fill="freeze" />
        <animateMotion
          begin="0.9s"
          dur="3.2s"
          fill="freeze"
          rotate="auto"
          calcMode="spline"
          keyPoints="0;1"
          keyTimes="0;1"
          keySplines="0.45 0 0.25 1"
        >
          <mpath href="#flight-route" />
        </animateMotion>
      </g>
    </svg>
  );
}

function Arrow() {
  return (
    <svg className="btn-arrow" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function HomePage() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const policyTitleId = useId();
  useReveal();

  return (
    <>
      <header className="wrap site-header">
        <a href="#top" className="logo-link" aria-label="TAKE OFF, на главную">
          <Logo />
        </a>
        <nav className="site-nav" aria-label="Разделы">
          <a className="nav-page" href="#about">
            О нас
          </a>
          <a className="nav-page" href="#how">
            Как это работает
          </a>
          <a className="btn btn-quiet btn-small" href={links.telegramSupport} {...external}>
            Написать нам
          </a>
        </nav>
      </header>

      <main id="top">
        <section className="wrap hero">
          <div className="hero-copy">
            <p className="eyebrow intro" style={delay(100)}>
              Сервис путешествий для девушек
            </p>
            <h1 className="title-xl intro" style={delay(220)}>
              Путешествуй <br />
              <em>легко</em>, мы&nbsp;рядом
            </h1>
            <p className="lead intro" style={delay(380)}>
              TAKE OFF помогает девушкам путешествовать выгодно, спокойно и с удовольствием:
              подбираем направления, помогаем с организацией и остаёмся на связи на каждом этапе.
            </p>
            <div className="actions intro" style={delay(520)}>
              <a className="btn" href={links.telegramSupport} {...external}>
                Подобрать поездку
                <Arrow />
              </a>
              <a className="btn btn-quiet" href={links.telegramChannel} {...external}>
                Telegram-канал
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <FlightPath />
            <div className="arch">
              <img
                src="/media/friends.jpg"
                alt="Две подруги гуляют по солнечной набережной у моря"
                width={1400}
                height={933}
                fetchPriority="high"
                decoding="async"
              />
            </div>
            <p className="badge">
              <span className="pulse" aria-hidden="true" />
              На связи 24/7
            </p>
          </div>
        </section>

        <section id="about" className="wrap section about">
          <div className="about-photo" data-reveal>
            <img
              className="photo"
              src="/media/woman.jpg"
              alt="Девушка с чемоданом у окна аэропорта смотрит на самолёт"
              width={1200}
              height={1600}
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="about-copy">
            <p className="eyebrow" data-reveal>
              О нас
            </p>
            <h2 className="title-lg" data-reveal style={delay(80)}>
              Открываем мир <em>вместе</em>
            </h2>
            <p className="text" data-reveal style={delay(160)}>
              Мы знаем, как важно чувствовать себя уверенно в новой стране. Поэтому берём на себя
              поиск выгодных вариантов и организацию, а тебе остаётся главное — впечатления.
            </p>
            <dl className="stats" data-reveal style={delay(240)}>
              <div>
                <dt>40+</dt>
                <dd>направлений</dd>
              </div>
              <div>
                <dt>24/7</dt>
                <dd>поддержка</dd>
              </div>
            </dl>
          </div>
        </section>

        <section id="how" className="section how">
          <div className="wrap">
            <p className="eyebrow" data-reveal>
              Как это работает
            </p>
            <h2 className="title-lg" data-reveal style={delay(80)}>
              Три шага до <em>взлёта</em>
            </h2>
            <ol className="steps">
              {steps.map((step, i) => (
                <li key={step.title} data-reveal style={delay(120 * i)}>
                  <span className="step-num">0{i + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="why" className="wrap section">
          <p className="eyebrow" data-reveal>
            Почему мы
          </p>
          <h2 className="title-lg" data-reveal style={delay(80)}>
            Почему выбирают <em>TAKE OFF</em>
          </h2>
          <dl className="why-list">
            {reasons.map((item, i) => (
              <div key={item.title} data-reveal style={delay(90 * i)}>
                <dt>{item.title}</dt>
                <dd>{item.text}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="wrap band" data-reveal>
          <img
            src="/media/coast.jpg"
            alt="Бирюзовое море и белый город на скалах"
            width={1600}
            height={1067}
            loading="lazy"
            decoding="async"
          />
          <p className="band-quote">
            Мы рядом, чтобы ты думала <em>только о море</em>
          </p>
        </section>

        <section id="contacts" className="wrap section contact">
          <p className="eyebrow" data-reveal>
            Контакты
          </p>
          <h2 className="title-lg" data-reveal style={delay(80)}>
            Куда полетим <em>в этот раз?</em>
          </h2>
          <p className="text" data-reveal style={delay(160)}>
            Напиши в поддержку — ответим и поможем выбрать. А в канале делимся идеями для поездок и
            выгодными предложениями.
          </p>
          <div className="actions" data-reveal style={delay(240)}>
            <a className="btn" href={links.telegramSupport} {...external}>
              Написать в поддержку
              <Arrow />
            </a>
            <a className="btn btn-quiet" href={links.telegramChannel} {...external}>
              Telegram-канал
            </a>
          </div>
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
          Сайт TAKE OFF — информационная визитка. На нём нет форм, регистрации и личного кабинета.
          Мы не собираем и не храним персональные данные посетителей.
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
    </>
  );
}
