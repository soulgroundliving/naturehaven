import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
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
  root.dataset.tod = p.slot;
  root.dataset.mood = p.mood;
}

export function TimeOfDayProvider({ children }: { children: ReactNode }) {
  // SSR-safe: start with `day` until mount runs to read clock + query
  const [overrideSlot, setOverrideSlot] = useState<TimeOfDay | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const q = readQueryOverride();
    if (q) setOverrideSlot(q);
    setMounted(true);
  }, []);

  const slot: TimeOfDay = mounted
    ? overrideSlot ?? getTimeOfDay()
    : 'day';
  const palette = TIME_PALETTES[slot];

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
