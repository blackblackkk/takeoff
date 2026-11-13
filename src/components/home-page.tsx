import { useEffect, useId, useRef, useState } from "react";
import {
  BadgePercent,
  ChevronRight,
  Globe,
  Headset,
  Menu,
  Send,
  ShieldCheck,
  X,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { links } from "@/lib/links";

const nav = [
  { href: "#top", id: "top", label: "Главная" },
  { href: "#about", id: "about", label: "О нас" },
  { href: "#advantages", id: "advantages", label: "Преимущества" },
  { href: "#contacts", id: "contacts", label: "Контакты" },
] as const;

const advantages = [
  {
    icon: Globe,
    title: "40+ направлений",
    text: "Возможности по всему миру.",
  },
  {
    icon: Headset,
    title: "Поддержка 24/7",
    text: "Наша команда всегда на связи.",
  },
  {
    icon: ShieldCheck,
    title: "Проверенные партнёры",
    text: "Сотрудничество с надёжными компаниями.",
  },
  {
    icon: BadgePercent,
    title: "Выгодные условия",
    text: "Финансовые программы и помощь в организации поездок.",
  },
] as const;

export function HomePage() {
  const [open, setOpen] = useState(false);
  const [leadState, setLeadState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [leadNote, setLeadNote] = useState("");
  const [active, setActive] = useState<string>("top");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const onScroll = () => {
      const mark = window.scrollY + 96;
      let current = "top";
      for (const item of nav) {
        const el = document.getElementById(item.id);
        if (el && el.offsetTop <= mark) current = item.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-navy/8 bg-mist text-navy">
        <div className="wrap flex h-16 items-center justify-between gap-3">
          <a href="#top" className="shrink-0" aria-label="TAKE OFF, на главную">
            <Logo />
          </a>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Разделы">
            {nav.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={
                  "text-sm font-semibold transition-opacity hover:opacity-100 " +
                  (active === item.id ? "opacity-100" : "opacity-60")
                }
                aria-current={active === item.id ? "true" : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={links.telegramSupport}
              className="hidden text-sm font-semibold text-navy/80 hover:text-navy sm:inline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Поддержка
            </a>
            <button
              type="button"
              className="grid size-11 place-items-center rounded-xl border border-navy/10 bg-paper text-navy lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((value) => !value)}
            >
              <span className="sr-only">{open ? "Закрыть меню" : "Открыть меню"}</span>
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        className={
          "fixed inset-0 z-30 bg-navy text-paper transition-opacity duration-200 lg:hidden " +
          (open ? "visible opacity-100" : "invisible pointer-events-none opacity-0")
        }
      >
        <nav className="wrap flex min-h-svh flex-col justify-center gap-6 pb-16 pt-24" aria-label="Мобильное меню">
          {nav.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="text-4xl font-extrabold tracking-tight"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a
            href={links.telegramSupport}
            className="btn mt-4 w-fit bg-navy text-paper"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
          >
            Написать в поддержку
          </a>
        </nav>
      </div>

      <main>
        <section id="top" className="relative min-h-[calc(100svh-4rem)] overflow-hidden bg-navy text-paper">
          <picture>
            <source media="(max-width: 767px)" srcSet="/media/hero-mobile.jpg" />
            <img
              src="/media/hero.jpg"
              alt="Пассажирский самолёт целиком в небе"
              width={1792}
              height={1008}
              className="hero-photo"
              fetchPriority="high"
              decoding="async"
            />
          </picture>
          <div className="hero-shade" />
          <div className="wrap relative z-10 flex min-h-[calc(100svh-4rem)] flex-col justify-end pb-10 pt-16 md:pb-16">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold tracking-[0.16em] text-brand uppercase">
                Мир открыт. Маршрут ваш.
              </p>
              <h1 className="hero-title mt-4">
                Путешествуйте
                <span className="block text-brand">выгоднее.</span>
              </h1>
              <p className="lead mt-5 max-w-xl text-paper/90">
                Открываем новые направления, создаём возможности и помогаем путешествовать с комфортом по всему миру.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:max-w-xl sm:flex-row">
                <a
                  href={links.telegramChannel}
                  className="cta bg-navy text-paper hover:bg-navy/90 sm:flex-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Telegram канал
                  <ChevronRight className="size-4" aria-hidden />
                </a>
                <a
                  href={links.telegramSupport}
                  className="cta bg-paper text-navy hover:bg-mist sm:flex-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Send className="size-4" aria-hidden />
                  Написать в поддержку
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="relative scroll-mt-20 bg-paper py-20 md:py-28">
          <div className="wrap grid items-center gap-12 md:grid-cols-2 md:gap-16">
            <div className="rise max-w-xl">
              <p className="kicker">
                <span className="kicker-mark" aria-hidden />
                О нас
              </p>
              <h2 className="section-title mt-4 uppercase">Открываем мир вместе с TAKE OFF</h2>
              <p className="lead mt-5 text-navy/75">
                TAKE OFF — международное агентство, которое помогает находить выгодные возможности для путешествий и сотрудничества.
              </p>
              <p className="lead mt-4 text-navy/75">
                Более 40 направлений, проверенные партнёры, комфортные условия и поддержка нашей команды на каждом этапе.
              </p>
            </div>

            <div className="rise grid grid-cols-5 gap-3">
              <img
                src="/media/woman.jpg"
                alt="Девушка у окна аэропорта смотрит на самолёт"
                width={1200}
                height={1600}
                loading="lazy"
                decoding="async"
                className="col-span-3 aspect-3/4 w-full rounded-card object-cover"
              />
              <img
                src="/media/friends.jpg"
                alt="Две девушки гуляют по солнечной набережной"
                width={1400}
                height={933}
                loading="lazy"
                decoding="async"
                className="col-span-2 aspect-3/4 w-full rounded-card object-cover object-center"
              />
            </div>
          </div>
        </section>

        <section id="advantages" className="scroll-mt-20 bg-mist py-20 md:py-28">
          <div className="wrap">
            <div className="rise max-w-2xl">
              <p className="kicker">
                <span className="kicker-mark" aria-hidden />
                Преимущества
              </p>
              <h2 className="section-title mt-4 uppercase">Почему TAKE OFF?</h2>
            </div>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:gap-5">
              {advantages.map((item) => (
                <li key={item.title} className="rise card p-6 md:p-7">
                  <span className="grid size-12 place-items-center rounded-2xl bg-mist text-brand">
                    <item.icon className="size-6" strokeWidth={1.75} aria-hidden />
                  </span>
                  <h3 className="mt-5 text-xl font-extrabold tracking-tight">{item.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-navy/70">{item.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="contacts" className="scroll-mt-20 bg-navy py-20 text-paper md:py-28">
          <div className="wrap">
            <div className="rise max-w-2xl">
              <p className="kicker kicker-light">
                <span className="kicker-mark" aria-hidden />
                Контакты
              </p>
              <h2 className="section-title mt-4 uppercase">Будем на связи!</h2>
              <p className="lead mt-5 text-paper/75">
                Хочешь узнать больше о TAKE OFF? Напиши в поддержку или подпишись на канал в Telegram.
              </p>
            </div>

            <form
              className="mt-8 grid max-w-xl gap-3"
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
                  setLeadState("error");
                  setLeadNote("Укажите имя и хотя бы один контакт — WhatsApp или Telegram.");
                  return;
                }
                setLeadState("sending");
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
                  setLeadState("sent");
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
                  setLeadState("error");
                  setLeadNote("Не удалось отправить уведомление. Открыли чат поддержки — нажмите «Отправить».");
                }
              }}
            >
              <input className="lead-input" name="name" autoComplete="name" placeholder="Имя" required />
              <input className="lead-input" name="whatsapp" autoComplete="tel" inputMode="tel" placeholder="WhatsApp" />
              <input className="lead-input" name="telegram" autoComplete="off" placeholder="Telegram (@username)" />
              <input className="hidden" name="company" tabIndex={-1} autoComplete="off" aria-hidden />
              <button className="cta bg-paper text-navy hover:bg-mist" type="submit" disabled={leadState === "sending"}>
                {leadState === "sending" ? "Отправляем…" : "Оставить контакт"}
              </button>
              <p className="min-h-6 text-sm text-paper/75" role="status">
                {leadNote}
              </p>
            </form>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <a className="cta bg-paper text-navy hover:bg-mist" href={links.telegramSupport} target="_blank" rel="noopener noreferrer">
                <Send className="size-4 shrink-0" aria-hidden />
                Написать в поддержку
              </a>
              <a className="cta border border-paper/25 text-paper hover:bg-paper/10" href={links.telegramChannel} target="_blank" rel="noopener noreferrer">
                Telegram канал
                <ChevronRight className="size-4 shrink-0" aria-hidden />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-paper/10 bg-navy text-paper">
        <div className="wrap flex flex-col gap-8 py-10 md:flex-row md:items-start md:justify-between">
          <div>
            <Logo tone="light" large />
            <p className="mt-3 text-sm font-medium text-gold">Выгодные путешествия</p>
          </div>
          <div className="flex flex-col gap-3 text-sm font-semibold">
            <a className="hover:text-gold" href={links.telegramSupport} target="_blank" rel="noopener noreferrer">
              Поддержка в Telegram
            </a>
            <a className="hover:text-gold" href={links.telegramChannel} target="_blank" rel="noopener noreferrer">
              Telegram-канал
            </a>
            <button
              type="button"
              className="w-fit text-left text-sm font-semibold text-paper/80 underline-offset-4 hover:text-paper hover:underline"
              onClick={() => dialogRef.current?.showModal()}
            >
              Политика конфиденциальности
            </button>
          </div>
        </div>
        <div className="wrap border-t border-paper/10 py-5 text-sm text-paper/60">© TAKE OFF</div>
      </footer>

      <dialog ref={dialogRef} className="policy" aria-labelledby={titleId}>
        <div className="rounded-card bg-paper p-6 shadow-lift md:p-8">
          <h2 id={titleId} className="text-2xl font-extrabold tracking-tight">
            Политика конфиденциальности
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-navy/80">
            <p>
              На сайте есть форма заявки. Имя и контакт отправляются сообщением в Telegram и на сайте не сохраняются.
            </p>
            <p>
              Кнопки ведут в Telegram. Если вы напишете в поддержку или подпишетесь на канал, Telegram обрабатывает данные по своим правилам.
            </p>
            <p>Технические данные браузера используются только чтобы страница корректно открылась.</p>
          </div>
          <form method="dialog" className="mt-6">
            <button type="submit" className="btn bg-navy text-paper hover:bg-brand">
              Закрыть
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
}
