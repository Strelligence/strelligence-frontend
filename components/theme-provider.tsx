"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function resolveTheme(theme: Theme): "light" | "dark" {
  return theme === "system" ? getSystemTheme() : theme;
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "system";
  return (localStorage.getItem("strelligence-theme") as Theme) ?? "system";
}

function applyThemeClass(resolved: "light" | "dark") {
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(resolved);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{
    theme: Theme;
    resolved: "light" | "dark";
  }>(() => {
    const theme = getInitialTheme();
    return { theme, resolved: resolveTheme(theme) };
  });

  useEffect(() => {
    applyThemeClass(state.resolved);
  }, [state.resolved]);

  useEffect(() => {
    if (state.theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const r = mq.matches ? "dark" : "light";
      applyThemeClass(r);
      setState((prev) => ({ ...prev, resolved: r }));
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [state.theme]);

  const setTheme = useCallback((theme: Theme) => {
    localStorage.setItem("strelligence-theme", theme);
    const resolved = resolveTheme(theme);
    applyThemeClass(resolved);
    setState({ theme, resolved });
  }, []);

  const value = useMemo(
    () => ({ theme: state.theme, setTheme, resolvedTheme: state.resolved }),
    [state.theme, state.resolved, setTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
