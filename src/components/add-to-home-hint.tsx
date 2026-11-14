import { useEffect, useState } from "react";

const STORAGE_KEY = "takeoff-add-to-home-dismissed";

export function AddToHomeHint() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) !== "1") {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="add-to-home" role="status">
      <div className="add-to-home-text">
        <strong>Не потеряйте сайт</strong>
        <span>
          Добавьте TAKE OFF на главный экран: нажмите «Поделиться» → «На экран «Домой»»
        </span>
      </div>
      <button type="button" className="add-to-home-close" onClick={dismiss} aria-label="Скрыть подсказку">
        ×
      </button>
    </div>
  );
}
