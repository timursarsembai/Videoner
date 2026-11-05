"use client";

import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { ResponsiveContainer } from "recharts";
import { UnauthorizedError, analyticsQuery, type AnalyticsParams } from "@/lib/analytics-api";
import {
  DEFAULT_PERIOD,
  periodLabel,
  periodOptions,
  periodRange,
  type DayRange,
  type PeriodId,
} from "@/lib/dashboard/periods";

// Общее для всех графиков дашборда: с какого дня есть данные (для «всего
// времени» и списков периодов), счётчик «Обновить» и что делать, если сессия
// истекла.
export interface DashboardContextValue {
  since: string;
  refreshKey: number;
  onUnauthorized: () => void;
}

export const DashboardContext = createContext<DashboardContextValue>({
  since: new Date().toISOString().slice(0, 10),
  refreshKey: 0,
  onUnauthorized: () => {},
});

export const useDashboard = () => useContext(DashboardContext);

export interface QueryState<T> {
  data: T | undefined;
  loading: boolean;
  error: string | undefined;
}

// Данные одного графика. Запросы всех графиков, отрисованных за один проход,
// сами собираются в один пакет (analyticsQuery).
export function useAnalytics<T>(name: string, params: AnalyticsParams = {}): QueryState<T> {
  const { refreshKey, onUnauthorized } = useDashboard();
  const [state, setState] = useState<QueryState<T>>({ data: undefined, loading: true, error: undefined });
  const key = JSON.stringify(params);

  useEffect(() => {
    let alive = true;
    setState((s) => ({ ...s, loading: true, error: undefined }));
    analyticsQuery<T>(name, JSON.parse(key))
      .then((data) => alive && setState({ data, loading: false, error: undefined }))
      .catch((e) => {
        if (!alive) return;
        if (e instanceof UnauthorizedError) onUnauthorized();
        setState((s) => ({ ...s, loading: false, error: e instanceof Error ? e.message : "Ошибка" }));
      });
    return () => {
      alive = false;
    };
  }, [name, key, refreshKey, onUnauthorized]);

  return state;
}

// Период графика и его данные: по умолчанию последние 30 дней.
export function usePeriodQuery<T>(name: string, extra: AnalyticsParams = {}) {
  const { since } = useDashboard();
  const [period, setPeriod] = useState<PeriodId>(DEFAULT_PERIOD);
  const range = periodRange(period, since);
  const query = useAnalytics<T>(name, { ...range, ...extra });
  return { period, setPeriod, range, label: periodLabel(period, since), ...query };
}

export function PeriodSelect({ value, onChange }: { value: PeriodId; onChange: (value: PeriodId) => void }) {
  const { since } = useDashboard();
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Период"
      className="h-8 max-w-[13rem] rounded-md border border-input bg-transparent px-2 text-xs outline-none focus-visible:ring-1 focus-visible:ring-ring"
    >
      {periodOptions(since).map((group) => (
        <optgroup key={group.label} label={group.label}>
          {group.options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}

// Рамка графика: заголовок, пояснение, выбор периода и прочие элементы
// управления справа, состояние загрузки.
export function ChartCard({
  title,
  hint,
  period,
  onPeriod,
  controls,
  wide = false,
  loading = false,
  error,
  children,
}: {
  title: ReactNode;
  hint?: ReactNode;
  period?: PeriodId;
  onPeriod?: (value: PeriodId) => void;
  controls?: ReactNode;
  // На всю ширину сетки: по дням точек много, в половине им тесно.
  wide?: boolean;
  loading?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className={`min-w-0 rounded-lg border border-border/60 bg-background/60 p-4 ${wide ? "lg:col-span-2" : ""}`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="text-sm font-medium text-foreground/70">{title}</h2>
          {hint && <p className="mt-1 text-xs text-foreground/50">{hint}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {controls}
          {period !== undefined && onPeriod && <PeriodSelect value={period} onChange={onPeriod} />}
        </div>
      </div>
      <div className={`relative transition-opacity ${loading ? "opacity-50" : ""}`}>
        {error ? <p className="py-24 text-center text-sm text-destructive">{error}</p> : children}
      </div>
    </div>
  );
}

// Сообщение вместо графика, когда показывать нечего.
export function EmptyChart({ children, height = 280 }: { children: ReactNode; height?: number }) {
  return (
    <div className="flex items-center justify-center text-center text-sm text-foreground/40" style={{ height }}>
      {children}
    </div>
  );
}

// График, который шире своей рамки, когда точек много: его листают вправо и
// влево — пальцем на телефоне, колесом с Shift или перетаскиванием мышью на
// компьютере. При первой отрисовке и смене данных показываем правый край —
// самые свежие дни.
//
// Ось Y при этом стоит на месте: поверх левого края лежит закреплённая
// (sticky) полоска с копией того же графика во всю его ширину, обрезанной до
// оси. Копия рисует ту же шкалу, что и сам график, — отдельно считать её
// пределы не нужно. Подписи оси X и легенду в копии прячем: они двигаются
// вместе с графиком.
export function ScrollableChart({
  points,
  pointWidth = 24,
  height = 280,
  yAxisWidth = 65,
  legend,
  children,
}: {
  points: number;
  // Сколько пикселей нужно одной точке, чтобы подписи не слипались.
  pointWidth?: number;
  height?: number;
  // Ширина оси Y вместе с отступом слева (у YAxis по умолчанию 60 + 5).
  yAxisWidth?: number;
  // Легенда — под графиком, вне прокрутки: внутри она уезжала бы вместе с
  // данными.
  legend?: LegendItem[];
  children: ReactNode;
}) {
  const box = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [scrollable, setScrollable] = useState(false);
  const [fullWidth, setFullWidth] = useState(0);
  const minWidth = points * pointWidth;

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    el.scrollLeft = el.scrollWidth;
    const measure = () => {
      setScrollable(el.scrollWidth > el.clientWidth + 1);
      setFullWidth(el.scrollWidth);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [points, minWidth]);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const el = box.current;
    if (e.pointerType !== "mouse" || !el || !scrollable) return;
    drag.current = { x: e.clientX, left: el.scrollLeft };
    setDragging(true);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = box.current;
    if (!drag.current || !el) return;
    el.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
  };
  const stop = () => {
    drag.current = null;
    setDragging(false);
  };

  return (
    <>
      <div
        ref={box}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={stop}
        onPointerLeave={stop}
        className={`scrollbar-thin overflow-x-auto overscroll-x-contain ${
          scrollable ? (dragging ? "cursor-grabbing select-none" : "cursor-grab") : ""
        }`}
      >
        <div style={{ minWidth, height }}>
          {scrollable && fullWidth > 0 && (
            <div
              aria-hidden
              className="pointer-events-none sticky left-0 z-10 overflow-hidden bg-background [&_.recharts-legend-wrapper]:invisible [&_.recharts-xAxis]:invisible"
              style={{ width: yAxisWidth, height, marginBottom: -height }}
            >
              <div style={{ width: fullWidth, height }}>
                <ResponsiveContainer width="100%" height={height}>
                  {children as ReactElement}
                </ResponsiveContainer>
              </div>
            </div>
          )}
          <ResponsiveContainer width="100%" height={height}>
            {children as ReactElement}
          </ResponsiveContainer>
        </div>
      </div>
      {legend && legend.length > 0 && <ChartLegend items={legend} />}
    </>
  );
}

export interface LegendItem {
  label: string;
  color: string;
}

export function ChartLegend({ items }: { items: LegendItem[] }) {
  return (
    <ul className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-foreground/70">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: item.color }} />
          {item.label}
        </li>
      ))}
    </ul>
  );
}

export type { DayRange };
