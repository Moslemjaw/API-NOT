"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ITEMS, LABEL, TOTAL, points, verdict, type Answer } from "@/lib/items";
import { AnswerIcon, DeviceIcon, ServerIcon, VerdictIcon } from "./Icons";

type LogEntry = { en: string; a: Answer };
type State = { i: number; follow: boolean; score: number; picked: Answer | null; log: LogEntry[] };

const START: State = { i: 0, follow: false, score: 0, picked: null, log: [] };
const KEYS: Answer[] = ["api", "no", "dep"];
const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));

export default function Game() {
  const [s, setS] = useState<State>(START);
  const nextRef = useRef<HTMLButtonElement>(null);

  const done = s.i >= ITEMS.length;
  const base = ITEMS[Math.min(s.i, ITEMS.length - 1)];
  const q = s.follow && base.follow ? base.follow : base;

  const pick = useCallback((k: Answer) => {
    setS((p) => {
      if (p.picked || p.i >= ITEMS.length) return p;
      const b = ITEMS[p.i];
      const cur = p.follow && b.follow ? b.follow : b;
      return { ...p, picked: k, score: p.score + points(cur, k), log: [...p.log, { en: cur.en, a: cur.a }] };
    });
  }, []);

  const next = useCallback(() => {
    setS((p) => {
      if (!p.picked) return p;
      const b = ITEMS[p.i];
      if (!p.follow && b.follow) return { ...p, follow: true, picked: null };
      return { ...p, follow: false, i: p.i + 1, picked: null };
    });
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Answer> = { "1": "api", "2": "no", "3": "dep", "١": "api", "٢": "no", "٣": "dep" };
      const m = map[e.key];
      if (m && !s.picked) pick(m);
      else if ((e.key === "Enter" || e.key === " " || e.key === "ArrowLeft") && s.picked && document.activeElement !== nextRef.current) {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [s.picked, pick, next]);

  useEffect(() => {
    if (s.picked) nextRef.current?.focus({ preventScroll: true });
  }, [s.picked]);

  const isLast = s.i === ITEMS.length - 1 && (s.follow || !base.follow);
  const nextLabel = isLast ? "النتيجة" : !s.follow && base.follow ? "سؤال المتابعة" : "التالي";

  return (
    <div className="wrap" dir="rtl">
      <header>
        <div className="brand">
          <div className="logo">API</div>
          <div>
            <h1>API <em>or</em> Not API?</h1>
            <p className="sub">هل يحتاج الموقع إلى API؟</p>
          </div>
        </div>
        <div className="scorebox">
          <b>{fmt(s.score)}</b>
          <span>/ {TOTAL}</span>
        </div>
      </header>

      <div className="steps" style={{ gridTemplateColumns: `repeat(${ITEMS.length}, 1fr)` }} aria-hidden="true">
        {ITEMS.map((_, k) => (
          <i key={k} className={k < s.i || done ? "done" : k === s.i ? "now" : ""} />
        ))}
      </div>

      {done ? (
        <EndCard state={s} onReplay={() => setS(START)} />
      ) : (
        <main className="card" aria-live="polite">
          <div className="top">
            <span className={`chip ${s.follow ? "follow" : ""}`}>{s.follow ? "سؤال متابعة" : base.app}</span>
            <span className="qnum">{s.i + 1} / {ITEMS.length}</span>
          </div>

          <div className="q">
            <p className="en">{q.en}</p>
            <p className="ar">{q.ar}</p>
          </div>

          <div className={`route ${s.picked ? "r-" + q.a : ""}`} aria-hidden="true">
            <div className="node dev"><DeviceIcon /><small>جهازك</small></div>
            <div className="wire"><div className="fill" /><div className="q-bubble">?</div></div>
            <div className="node srv"><ServerIcon /><small>سيرفر / خدمة</small></div>
          </div>

          <div className="opts">
            {KEYS.map((k, n) => {
              const isPick = s.picked === k;
              const isRight = !!s.picked && !isPick && q.a === k;
              return (
                <button
                  key={k}
                  className={`opt ${isPick ? "pick" : ""} ${isRight ? "right" : ""}`}
                  data-k={k}
                  disabled={!!s.picked}
                  onClick={() => pick(k)}
                >
                  <AnswerIcon k={k} />
                  <b>{LABEL[k]}</b>
                  <kbd>{n + 1}</kbd>
                  {isPick && <span className="mark">اختياركم</span>}
                  {isRight && <span className="mark">الجواب</span>}
                </button>
              );
            })}
          </div>

          {s.picked && (() => {
            const [cls, txt] = verdict(q, s.picked);
            return (
              <div className="reveal">
                <div className={`verdict ${cls}`}>
                  <VerdictIcon k={cls} />
                  <span>{txt}</span>
                  {q.why && <span className="vwhy">{q.why}</span>}
                </div>
                {q.sides && (
                  <div className="sides">
                    <div className="side api"><h3>يحتاج API لو…</h3><p>{q.sides.api}</p></div>
                    <div className="side no"><h3>ما يحتاج لو…</h3><p>{q.sides.no}</p></div>
                  </div>
                )}
                <div className="row">
                  <button ref={nextRef} className="btn" onClick={next}>
                    {nextLabel} <span aria-hidden="true">←</span>
                  </button>
                </div>
              </div>
            );
          })()}
        </main>
      )}

      <p className="hint">
        للمعلّم: <code>1</code> يحتاج · <code>2</code> ما يحتاج · <code>3</code> يعتمد · <code>Enter</code> التالي
      </p>
    </div>
  );
}

function EndCard({ state, onReplay }: { state: State; onReplay: () => void }) {
  const pct = state.score / TOTAL;
  const note =
    pct >= 0.8
      ? "ممتاز! وإذا اختلفتوا في بعض البنود، هذا بالضبط المطلوب."
      : pct >= 0.5
      ? 'زين، والبنود اللي "تعتمد" هي أحلى نقاش.'
      : "ولا يهمكم، العبوها مرة ثانية بعد النقاش.";
  return (
    <main className="card end" aria-live="polite">
      <div className="ring" style={{ ["--p" as string]: Math.round(pct * 100) }}>
        <div><span>{fmt(state.score)}<small>من {TOTAL}</small></span></div>
      </div>
      <p className="endmsg">صرتوا تفرّقون بين اللي يحتاج API واللي ما يحتاج!</p>
      <p className="sub" style={{ margin: 0 }}>{note}</p>
      <ul className="recap">
        {state.log.map((l, k) => (
          <li key={k}><span>{l.en}</span><span className={`tag ${l.a}`}>{LABEL[l.a]}</span></li>
        ))}
      </ul>
      <button className="btn" onClick={onReplay}>العبوا مرة ثانية</button>
    </main>
  );
}
