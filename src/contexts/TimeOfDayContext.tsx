import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  getContinuousPalette,
  getTimeOfDay,
  isValidSlot,
  TIME_PALETTES,
  type TimeOfDay,
  type TimePalette,
} from '@/lib/timeOfDay';

interface TimeOfDayContextValue {
  slot: TimeOfDay;
  palette: TimePalette;
  override: (slot: TimeOfDay | null) => void;
  isOverridden: boolean;
}

const TimeOfDayContext = createContext<TimeOfDayContextValue | null>(null);

function readQueryOverride(): TimeOfDay | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const tod = params.get('tod');
  return isValidSlot(tod) ? tod : null;
}

function applyCSSVars(p: TimePalette) {
  const root = document.documentElement;
  root.style.setProperty('--sky-from', p.skyFrom);
  root.style.setProperty('--sky-via', p.skyVia);
  root.style.setProperty('--sky-to', p.skyTo);
  root.style.setProperty('--text-on-bg', p.textOnBg);
  root.style.setProperty('--text-muted-on-bg', p.textMuted);
  root.style.setProperty('--cta-bg', p.ctaBg);
  root.style.setProperty('--cta-bg-hover', p.ctaBgHover);
  root.style.setProperty('--text-shadow-hero', p.textShadow);
  root.style.setProperty('--overlay-opacity', String(p.overlayOpacity));
  root.style.setProperty('--sec-text', p.secText);
  root.style.setProperty('--sec-text-60', p.secText60);
  root.style.setProperty('--sec-text-70', p.secText70);
  root.style.setProperty('--sec-text-80', p.secText80);
  root.style.setProperty('--sec-text-90', p.secText90);
  root.style.setProperty('--sec-text-55', p.secText55);
  root.style.setProperty('--sec-border', p.secBorder);
  root.style.setProperty('--sec-bg', p.secBg);
  root.style.setProperty('--card-bg', p.cardBg);
  root.dataset.tod = p.slot;
  root.dataset.mood = p.mood;
}

export function TimeOfDayProvider({ children }: { children: ReactNode }) {
  // SSR-safe: start with `day` until mount runs to read clock + query
  const [overrideSlot, setOverrideSlot] = useState<TimeOfDay | null>(null);
  const [mounted, setMounted] = useState(false);

  // Live palette — blended from exact clock time, ticks every 60 s
  const [livePalette, setLivePalette] = useState<TimePalette>(() => getContinuousPalette());

  useEffect(() => {
    const q = readQueryOverride();
    if (q) setOverrideSlot(q);
    setMounted(true);
  }, []);

  // When not overridden: set immediately on mount, then refresh every minute
  useEffect(() => {
    if (!mounted || overrideSlot) return;
    setLivePalette(getContinuousPalette());
    const id = setInterval(() => setLivePalette(getContinuousPalette()), 60_000);
    return () => clearInterval(id);
  }, [mounted, overrideSlot]);

  const slot: TimeOfDay = mounted
    ? overrideSlot ?? getTimeOfDay()
    : 'day';

  // Override uses pure keyframe palette; live mode uses interpolated blend
  const palette: TimePalette = !mounted
    ? TIME_PALETTES['day']
    : overrideSlot
    ? TIME_PALETTES[overrideSlot]
    : livePalette;

  useEffect(() => {
    applyCSSVars(palette);
  }, [palette]);

  const value = useMemo<TimeOfDayContextValue>(
    () => ({
      slot,
      palette,
      override: setOverrideSlot,
      isOverridden: overrideSlot !== null,
    }),
    [slot, palette, overrideSlot]
  );

  return (
    <TimeOfDayContext.Provider value={value}>
      {children}
    </TimeOfDayContext.Provider>
  );
}

export function useTimeOfDay(): TimeOfDayContextValue {
  const ctx = useContext(TimeOfDayContext);
  if (!ctx) {
    throw new Error('useTimeOfDay must be used within TimeOfDayProvider');
  }
  return ctx;
}
