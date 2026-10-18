/* eslint-disable react-refresh/only-export-components -- provider module intentionally exports hooks + helpers */
import { Monitor, Moon, Sun } from "lucide-react";
import { createContext, useContext, useEffect, useId, useState, type ReactNode } from "react";

export type ThemePref = "light" | "dark" | "system";

const KEY = "mirage-theme";
const ThemeContext = createContext<{
  pref: ThemePref;
  resolved: "light" | "dark";
  setPref: (p: ThemePref) => void;
}>({ pref: "system", resolved: "dark", setPref: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

function resolve(pref: ThemePref): "light" | "dark" {
  if (pref === "light" || pref === "dark") return pref;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(pref: ThemePref) {
  const resolved = resolve(pref);
  document.documentElement.dataset.theme = resolved;
  document.documentElement.dataset.themePref = pref;
  document.documentElement.style.colorScheme = resolved;
  return resolved;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [pref, setPrefState] = useState<ThemePref>("dark");
  const [resolved, setResolved] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    const next: ThemePref =
      stored === "light" || stored === "dark" || stored === "system" ? stored : "dark";
    setPrefState(next);
    setResolved(applyTheme(next));
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if ((localStorage.getItem(KEY) || "system") === "system") setResolved(applyTheme("system"));
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const setPref = (p: ThemePref) => {
    localStorage.setItem(KEY, p);
    setPrefState(p);
    setResolved(applyTheme(p));
  };

  return <ThemeContext.Provider value={{ pref, resolved, setPref }}>{children}</ThemeContext.Provider>;
}

const OPTIONS: { id: ThemePref; label: string; icon: typeof Sun }[] = [
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
  { id: "system", label: "System", icon: Monitor },
];

export function ThemeSwitcher() {
  const { pref, setPref } = useTheme();
  const [open, setOpen] = useState(false);
  const listId = useId();
  const Active = OPTIONS.find((o) => o.id === pref)?.icon ?? Monitor;

  return (
    <div className="relative">
      <button
        type="button"
        className="flex items-center gap-1 rounded-md border border-line bg-card px-2 py-1 text-xs text-fg"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`Theme: ${pref}. Change theme`}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
      >
        <Active className="size-3.5 text-accent" aria-hidden />
        <span className="hidden sm:inline capitalize">{pref}</span>
      </button>
      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Color theme"
          className="absolute right-0 z-40 mt-1 w-36 rounded-md border border-line bg-card p-1 lift"
        >
          {OPTIONS.map((o) => {
            const Icon = o.icon;
            const selected = pref === o.id;
            return (
              <li key={o.id} role="option" aria-selected={selected}>
                <button
                  type="button"
                  className={`flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm ${selected ? "bg-elev text-accent" : "text-fg hover:bg-elev"}`}
                  onClick={() => {
                    setPref(o.id);
                    setOpen(false);
                  }}
                >
                  <Icon className="size-4" aria-hidden />
                  {o.label}
                  {selected && <span className="ml-auto text-[10px]">On</span>}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export const THEME_BOOT = `(function(){try{var p=localStorage.getItem('${KEY}')||'dark';var d=p==='dark'||(p!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);var t=d?'dark':'light';document.documentElement.dataset.theme=t;document.documentElement.dataset.themePref=p;document.documentElement.style.colorScheme=t;}catch(e){}})();`;
