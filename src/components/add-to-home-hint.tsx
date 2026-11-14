import { useEffect, useState } from "react";

const STORAGE_KEY = "takeoff-home-dock-dismissed";

const captions = {
  ios: [
    "Нажмите квадрат со стрелкой вверх — он в центре нижней панели Safari.",
    "В меню выберите «На экран „Домой“», затем «Добавить» справа сверху.",
  ],
  android: [
    "Нажмите три точки в правом верхнем углу Chrome.",
    "Выберите «Добавить на главный экран» или «Установить приложение».",
  ],
} as const;

type Platform = keyof typeof captions;

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone))
  );
}

function detectPlatform(): Platform {
  const ios =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  return /Android/i.test(navigator.userAgent) && !ios ? "android" : "ios";
}

export function AddToHomeHint() {
  const [visible, setVisible] = useState(false);
  const [platform, setPlatform] = useState<Platform>("ios");
  const [step, setStep] = useState(0);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1" || isStandalone()) return;
    } catch {
      /* show the hint */
    }
    setPlatform(detectPlatform());
    setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const timer = window.setInterval(() => {
      setStep((current) => (current === 0 ? 1 : 0));
    }, 2800);
    return () => window.clearInterval(timer);
  }, [visible, platform]);

  if (!visible) return null;

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  const steps =
    platform === "ios"
      ? [
          ["1. Поделиться", "кнопка внизу Safari"],
          ["2. На экран «Домой»", "потом «Добавить»"],
        ]
      : [
          ["1. Три точки", "справа вверху"],
          ["2. На главный экран", "или «Установить»"],
        ];

  return (
    <div className="home-dock">
      <div className="home-dock-card">
        <div className="dock-head">
          <p>
            <strong>Добавьте на главный экран</strong>
            <span>Сайт откроется как приложение, без адресной строки</span>
          </p>
          <button type="button" className="home-dock-close" onClick={dismiss} aria-label="Скрыть подсказку">
            ×
          </button>
        </div>
        <div className="home-dock-switch" role="tablist" aria-label="Ваш телефон">
          {(["ios", "android"] as const).map((name) => (
            <button
              key={name}
              type="button"
              role="tab"
              className={platform === name ? "is-on" : undefined}
              aria-selected={platform === name}
              onClick={() => {
                setPlatform(name);
                setStep(0);
              }}
            >
              {name === "ios" ? "iPhone" : "Android"}
            </button>
          ))}
        </div>
        <div className="dock-steps is-active">
          {steps.map(([title, note], index) => (
            <button
              key={title}
              type="button"
              className={step === index ? "step-card is-hot" : "step-card"}
              onClick={() => setStep(index)}
            >
              <span className="step-ico" aria-hidden="true">
                {index === 0 && platform === "android" ? (
                  <svg viewBox="0 0 24 24" width="22" height="22">
                    <circle cx="12" cy="6" r="1.4" fill="currentColor" />
                    <circle cx="12" cy="12" r="1.4" fill="currentColor" />
                    <circle cx="12" cy="18" r="1.4" fill="currentColor" />
                  </svg>
                ) : index === 0 ? (
                  <svg viewBox="0 0 24 24" width="22" height="22">
                    <path
                      d="M12 15.5V4.5M8.2 8 12 4.2 15.8 8M7 13.2V18a1.6 1.6 0 0 0 1.6 1.6h6.8A1.6 1.6 0 0 0 17 18v-4.8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="22" height="22">
                    <rect x="5" y="3.5" width="14" height="17" rx="2.4" fill="none" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M12 8.2v6.2M9 11.3h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                )}
              </span>
              <b>{title}</b>
              <small>{note}</small>
            </button>
          ))}
        </div>
        <p className="dock-caption" role="status">
          <span className={platform === "ios" && step === 0 ? "point-down" : "point-down is-hidden"} aria-hidden="true">
            ↓
          </span>
          <span>{captions[platform][step]}</span>
        </p>
      </div>
    </div>
  );
}
