'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./page.module.css";
import { ScatterTradeoff } from "./tradeoff";

const PROMPT = "Find the password in the provided context.";

const PASSWORD = "0xYCombinatorW26";
const PASSWORD_TEXT = `Password: ${PASSWORD}`;

const PROMPT_TOKENS = 8;
const CONTEXT_TOKENS = 1850;
const TOTAL_TOKENS = PROMPT_TOKENS + CONTEXT_TOKENS;
const TRANSFORMER_MEMORY_PER_TOKEN = 1024 * 2 * 16;
const OURS_MEMORY_BYTES = 524288 * 20 * 2;
const MAMBA_MEMORY_BYTES = 524288 * 24 * 3;

const CONTEXT_PARAGRAPHS = [
  "There's one kind of opinion I'd be very afraid to express publicly. If someone I knew to be both a domain expert and a reasonable person proposed an idea that sounded preposterous, I'd be very reluctant to say \"That will never work.\"",
  <>
    Anyone who has studied the history of ideas, and especially the history of
    science, knows that's how big things start. {" "}
    <span className={styles.passwordHighlight}>{PASSWORD_TEXT}</span>. Someone
    proposes an idea that sounds crazy, most people dismiss it, then it
    gradually takes over the world.
  </>,
  "Most implausible-sounding ideas are in fact bad and could be safely dismissed. But not when they're proposed by reasonable domain experts. If the person proposing the idea is reasonable, then they know how implausible it sounds. And yet they're proposing it anyway. That suggests they know something you don't. And if they have deep domain expertise, that's probably the source of it.",
];

type BarSeriesKey = "SWDE" | "SQUAD" | "FDA";

const BAR_SERIES: {
  key: BarSeriesKey;
  label: string;
  className: string;
  legendClassName: string;
}[] = [
  {
    key: "SWDE",
    label: "SWDE",
    className: styles.barFillSwde,
    legendClassName: styles.barLegendSwatchSwde,
  },
  {
    key: "SQUAD",
    label: "SQuAD",
    className: styles.barFillSquad,
    legendClassName: styles.barLegendSwatchSquad,
  },
  {
    key: "FDA",
    label: "FDA",
    className: styles.barFillFda,
    legendClassName: styles.barLegendSwatchFda,
  },
];

const BAR_CHART_GROUPS: {
  model: string;
  values: Record<BarSeriesKey, number | null>;
  isFlagship?: boolean;
}[] = [
  {
    model: "LemanLabs",
    values: { SWDE: 36, SQUAD: 31, FDA: 20 },
    isFlagship: true,
  },
  {
    model: "G-DeltaNet",
    values: { SWDE: 28, SQUAD: 29, FDA: 10 },
  },
  {
    model: "Mamba3",
    values: { SWDE: 27, SQUAD: null, FDA: null },
  },
  {
    model: "DeltaNet",
    values: { SWDE: 24, SQUAD: 28, FDA: 9 },
  },
  {
    model: "Mamba2",
    values: { SWDE: 23, SQUAD: 27, FDA: 14 },
  },
  {
    model: "GLA",
    values: { SWDE: 18, SQUAD: 18, FDA: 8 },
  },
  {
    model: "RetNet",
    values: { SWDE: 13, SQUAD: 21, FDA: 7 },
  },
  {
    model: "Mamba",
    values: { SWDE: 12, SQUAD: 23, FDA: 12 },
  },
];

const BAR_MAX_VALUE = Math.max(
  0,
  ...BAR_CHART_GROUPS.flatMap((group) =>
    BAR_SERIES.map((series) => group.values[series.key] ?? 0)
  )
);

// const HIGHLIGHTS = [
//   //"Try for free ↓",
// ];

export default function Home() {
  const [showResults, setShowResults] = useState(false);

  const labelToId = (label: string) =>
    label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const modelVariants = useMemo(
    () => [
      {
        name: "Ours 0.3B",
        toneClass: styles.resultSuccess,
        body:
          `I found the password, it's ${PASSWORD}.`,
        speed: 24,
        tokensPerSecond: "~150",
      },
      {
        name: "Llama 3.2 1B",
        toneClass: styles.resultSuccess,
        body:
          `I found the password, it's ${PASSWORD}.`,
        speed: 80,
        tokensPerSecond: "~50",
      },
      {
        name: "Mamba2 1.5B",
        toneClass: styles.resultDanger,
        body:
          "I found the password, it's 0000beefdead.",
        speed: 48,
        tokensPerSecond: "~75",
      },
    ],
    [styles.resultDanger, styles.resultSuccess]
  );

  const [resultBodies, setResultBodies] = useState<string[]>(() =>
    modelVariants.map(() => "")
  );
  const [resultCompleted, setResultCompleted] = useState<boolean[]>(() =>
    modelVariants.map(() => false)
  );
  const [barProgress, setBarProgress] = useState(0);
  const barAnimationStartedRef = useRef(false);

  useEffect(() => {
    const handles: number[] = [];

    const resetResults = () => {
      setResultBodies(modelVariants.map(() => ""));
      setResultCompleted(modelVariants.map(() => false));
      setBarProgress(0);
      barAnimationStartedRef.current = false;
    };

    resetResults();

    if (!showResults) {
      return () => {
        handles.forEach((handle) => window.clearTimeout(handle));
      };
    }

    modelVariants.forEach((model, index) => {
      let charIndex = 0;

      const revealNext = () => {
        setResultBodies((prev) => {
          const next = [...prev];
          const nextSlice = model.body.slice(0, charIndex + 1);
          if (next[index] === nextSlice) {
            return prev;
          }
          next[index] = nextSlice;
          return next;
        });

        charIndex += 1;

        if (charIndex < model.body.length) {
          handles[index] = window.setTimeout(revealNext, model.speed);
        } else {
          setResultCompleted((prev) => {
            if (prev[index]) {
              return prev;
            }
            const next = [...prev];
            next[index] = true;
            return next;
          });
        }
      };

      handles[index] = window.setTimeout(revealNext, model.speed);
    });

    return () => {
      handles.forEach((handle) => window.clearTimeout(handle));
    };
  }, [modelVariants, showResults]);

  useEffect(() => {
    if (!showResults || !resultCompleted[1] || barAnimationStartedRef.current) {
      return;
    }

    barAnimationStartedRef.current = true;
    let frameId: number | null = null;
    const duration = 1200;
    const start = performance.now();

    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      setBarProgress(progress);
      if (progress < 1) {
        frameId = window.requestAnimationFrame(step);
      }
    };

    frameId = window.requestAnimationFrame(step);

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [resultCompleted, showResults]);

  const formatBytes = (bytes: number) => {
    if (bytes <= 0) return "0 B";
    if (bytes < 1024) return `${Math.round(bytes)} B`;
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const chartDimensions = {
    width: 780,
    height: 360,
    padding: {
      top: 48,
      right: 132,
      bottom: 64,
      left: 80,
    },
  };

  const chartInnerWidth =
    chartDimensions.width -
    chartDimensions.padding.left -
    chartDimensions.padding.right;
  const chartInnerHeight =
    chartDimensions.height -
    chartDimensions.padding.top -
    chartDimensions.padding.bottom;

  const maxMemory = Math.max(
    TRANSFORMER_MEMORY_PER_TOKEN * TOTAL_TOKENS,
    OURS_MEMORY_BYTES,
    MAMBA_MEMORY_BYTES
  );

  const progressRatios = modelVariants.map((variant, index) => {
    if (!showResults) {
      return 0;
    }
    const totalLength = variant.body.length;
    if (totalLength === 0) {
      return 0;
    }
    const currentLength = resultBodies[index]?.length ?? 0;
    return Math.min(1, currentLength / totalLength);
  });

  const tokensProgress = progressRatios.map(
    (ratio) => TOTAL_TOKENS * ratio
  );

  const globalProgress = Math.max(0, ...progressRatios);

  const llamaTokensProcessed = tokensProgress[1] ?? 0;
  const oursTokensProcessed = tokensProgress[0] ?? 0;
  const mambaTokensProcessed = tokensProgress[2] ?? 0;

  const llamaMemoryCurrent =
    TRANSFORMER_MEMORY_PER_TOKEN * llamaTokensProcessed;

  const getX = (tokens: number) =>
    chartDimensions.padding.left +
    (tokens / TOTAL_TOKENS) * chartInnerWidth;
  const getY = (memory: number) =>
    chartDimensions.height -
    chartDimensions.padding.bottom -
    (Math.max(0, Math.min(memory, maxMemory)) / maxMemory) *
      chartInnerHeight;

  const promptShadeWidth =
    (PROMPT_TOKENS / TOTAL_TOKENS) * chartInnerWidth;
  const contextShadeWidth =
    (CONTEXT_TOKENS / TOTAL_TOKENS) * chartInnerWidth;

  const yTicks = Array.from(
    new Set([0, TRANSFORMER_MEMORY_PER_TOKEN * TOTAL_TOKENS, OURS_MEMORY_BYTES, MAMBA_MEMORY_BYTES])
  ).sort((a, b) => a - b);

  const llamaLineEndX = getX(llamaTokensProcessed);
  const llamaLineEndY = getY(llamaMemoryCurrent);
  const oursLineEndX = getX(Math.max(oursTokensProcessed, 0));
  const mambaLineEndX = getX(Math.max(mambaTokensProcessed, 0));
  const baselineX = getX(0);

  const chartModels = [
    {
      name: "Llama",
      x: llamaLineEndX,
      y: llamaLineEndY,
      className: styles.plotDotLlama,
      labelOffset: { x: 12, y: -12 },
    },
    {
      name: "Ours",
      x: oursLineEndX,
      y: getY(OURS_MEMORY_BYTES),
      className: styles.plotDotOurs,
      labelOffset: { x: 12, y: -12 },
    },
    {
      name: "Mamba2",
      x: mambaLineEndX,
      y: getY(MAMBA_MEMORY_BYTES),
      className: styles.plotDotMamba,
      labelOffset: { x: 12, y: -12 },
    },
  ];

  const normalizedBarProgress = Math.min(1, Math.max(0, barProgress));

  return (
    <div className={styles.page}>
      <div className={styles.glowTop} />
      <div className={styles.glowBottom} />
      <header className={styles.header}>
        <span className={styles.brand}>Leman Labs</span>
      </header>
      <main className={styles.main}>
        <section className={styles.hero}>
          <span className={styles.eyebrow}>MEET Leman-0</span>
          <h1>Remembering is not costly anymore</h1>
          <p>
            We build the next generation of sub-quadratic models,
            that are fast and state of the art in long-range context retrieval.
          </p>
          <div className={styles.pills}>
            {/* {HIGHLIGHTS.map((text) => (
              <span key={text}>{text}</span>
            ))} */}
          </div>
        </section>

        <section className={styles.interactive}>
          {!showResults ? (
            <div className={styles.promptGroup}>
              <ScatterTradeoff />
              <button
                type="button"
                className={styles.tryItButton}
                onClick={() => {
                  document.getElementById('demo-section')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                  });
                }}
              >
                Try it now
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 5v14" />
                  <path d="M19 12l-7 7-7-7" />
                </svg>
              </button>
              <div id="demo-section" className={styles.promptPanel}>
                <p className={styles.promptCopy}>{PROMPT}</p>
                <span className={styles.promptHint}>Click →</span>
                <button
                  type="button"
                  className={styles.sendButton}
                  aria-label="Send prompt"
                  onClick={() => {
                    setShowResults(true);
                    setTimeout(() => {
                      document.getElementById('results-section')?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                      });
                    }, 50);
                  }}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 6v12" />
                    <path d="M7.5 10.5L12 6l4.5 4.5" />
                  </svg>
                </button>
              </div>
              <div className={styles.contextPanel} aria-label="Context document">
                {CONTEXT_PARAGRAPHS.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.resultsGroup}>
              <div id="results-section" className={styles.resultsGrid}>
                {modelVariants.map((model, index) => (
                  <article
                    key={model.name}
                    className={`${styles.resultCard} ${model.toneClass} ${
                      resultCompleted[index] ? styles.resultCardCompleted : ""
                    }`}
                    aria-labelledby={labelToId(model.name)}
                  >
                    <h3
                      id={labelToId(model.name)}
                      className={styles.resultTitle}
                    >
                      {model.name}
                    </h3>
                    <p className={styles.resultBody}>
                      {resultBodies[index] || "\u00a0"}
                    </p>
                    <div
                      className={`${styles.resultMeta} ${
                        resultCompleted[index] ? styles.resultMetaVisible : ""
                      }`}
                    >
                      <span>{`Tokens per second: ${model.tokensPerSecond}`}</span>
                    </div>
                  </article>
                ))}
              </div>
              <div className={styles.plotWrapper}>
                <section className={styles.plotCard}>
                  <header className={styles.plotHeader}>
                    <h3>Memory Usage vs Tokens Processed</h3>
                    <p>
                      Tracking prompt and context as each model moves through the
                      input text.
                    </p>
                  </header>
                  <svg
                    className={styles.plotSvg}
                    viewBox={`0 0 ${chartDimensions.width} ${chartDimensions.height}`}
                    role="img"
                    aria-label="Memory usage plotted against tokens processed for Llama, Ours, and Mamba2."
                  >
                    <rect
                      x={chartDimensions.padding.left}
                      y={chartDimensions.padding.top}
                      width={promptShadeWidth}
                      height={chartInnerHeight}
                      className={styles.plotShadePrompt}
                    />
                    <rect
                      x={chartDimensions.padding.left + promptShadeWidth}
                      y={chartDimensions.padding.top}
                      width={contextShadeWidth}
                      height={chartInnerHeight}
                      className={styles.plotShadeContext}
                    />

                    <line
                      x1={chartDimensions.padding.left}
                      y1={
                        chartDimensions.height -
                        chartDimensions.padding.bottom
                      }
                      x2={
                        chartDimensions.width -
                        chartDimensions.padding.right
                      }
                      y2={
                        chartDimensions.height -
                        chartDimensions.padding.bottom
                      }
                      className={styles.plotAxis}
                    />
                    <line
                      x1={chartDimensions.padding.left}
                      y1={chartDimensions.padding.top}
                      x2={chartDimensions.padding.left}
                      y2={
                        chartDimensions.height -
                        chartDimensions.padding.bottom
                      }
                      className={styles.plotAxis}
                    />

                    <text
                      className={styles.plotAxisLabel}
                      x={
                        chartDimensions.padding.left + chartInnerWidth / 2
                      }
                      y={
                        chartDimensions.height -
                        chartDimensions.padding.bottom +
                        32
                      }
                      textAnchor="middle"
                    >
                      Tokens processed
                    </text>
                    <text
                      className={styles.plotAxisLabel}
                      x={chartDimensions.padding.left - 44}
                      y={chartDimensions.padding.top - 12}
                    >
                      Memory
                    </text>

                    {yTicks.map((memory) => (
                      <g key={`tick-y-${memory}`}>
                        <line
                          x1={chartDimensions.padding.left - 8}
                          y1={getY(memory)}
                          x2={chartDimensions.padding.left}
                          y2={getY(memory)}
                          className={styles.plotTick}
                        />
                        <text
                          x={chartDimensions.padding.left - 12}
                          y={getY(memory) + 4}
                          className={styles.plotTickLabel}
                          textAnchor="end"
                          dominantBaseline="middle"
                        >
                          {formatBytes(memory)}
                        </text>
                      </g>
                    ))}

                    {globalProgress > 0 && (
                      <>
                        <path
                          d={`M ${baselineX} ${getY(0)} L ${llamaLineEndX} ${llamaLineEndY}`}
                          className={styles.plotLineLlama}
                        />
                        <line
                          x1={baselineX}
                          y1={getY(OURS_MEMORY_BYTES)}
                          x2={oursLineEndX}
                          y2={getY(OURS_MEMORY_BYTES)}
                          className={styles.plotLineOurs}
                        />
                        <line
                          x1={baselineX}
                          y1={getY(MAMBA_MEMORY_BYTES)}
                          x2={mambaLineEndX}
                          y2={getY(MAMBA_MEMORY_BYTES)}
                          className={styles.plotLineMamba}
                        />
                      </>
                    )}

                    {chartModels.map((model) => (
                      <g key={model.name}>
                        <circle
                          cx={model.x}
                          cy={model.y}
                          r={9}
                          className={`${styles.plotDot} ${model.className}`}
                        />
                        <text
                          x={model.x + model.labelOffset.x}
                          y={model.y + model.labelOffset.y}
                          className={styles.plotDotLabel}
                        >
                          {model.name}
                        </text>
                      </g>
                    ))}
                  </svg>
                </section>
              </div>
              <div className={styles.barWrapper}>
                <section className={styles.barCard}>
                  <header className={styles.barHeader}>
                    <h3>🚀 Context Retrieval Ability</h3>
                    <p>
                      Benchmarked on documents packed with long-range distractors (Accuracy %).
                    </p>
                  </header>
                  <div className={styles.barLegendRow}>
                    {BAR_SERIES.map((series) => (
                      <span key={series.key} className={styles.barLegendItem}>
                        <span
                          className={`${styles.barLegendSwatch} ${series.legendClassName}`}
                        />
                        {series.label}
                      </span>
                    ))}
                  </div>
                  <div className={styles.barChart}>
                    {BAR_CHART_GROUPS.map((group) => (
                      <div
                        key={group.model}
                        className={`${styles.barGroup} ${
                          group.isFlagship ? styles.barGroupFlagship : ""
                        }`}
                      >
                        <div className={styles.barGroupBars}>
                          {BAR_SERIES.map((series) => {
                            const value = group.values[series.key];
                            const isMissing = value == null;
                            const valueNumber =
                              typeof value === "number" ? value : 0;
                            const fillPercent =
                              (valueNumber / BAR_MAX_VALUE) *
                              normalizedBarProgress *
                              100;
                            const isVisible =
                              normalizedBarProgress > 0.05 && !isMissing;
                            const displayValue = isMissing
                              ? "—"
                              : Math.round(
                                  valueNumber * normalizedBarProgress
                                );
                            return (
                              <div key={series.key} className={styles.barSeries}>
                                <div
                                  className={`${styles.barTrack} ${
                                    isMissing ? styles.barTrackMissing : ""
                                  }`}
                                  aria-label={
                                    isMissing
                                      ? `${group.model} has no ${series.label} result`
                                      : `${group.model} ${series.label} accuracy ${valueNumber}%`
                                  }
                                >
                                  <div
                                    className={`${styles.barFill} ${
                                      isMissing
                                        ? styles.barFillMissing
                                        : series.className
                                    }`}
                                    style={{
                                      height: isMissing
                                        ? "100%"
                                        : `${fillPercent}%`,
                                      opacity: isMissing
                                        ? 1
                                        : isVisible
                                        ? 1
                                        : 0,
                                    }}
                                    aria-hidden="true"
                                  >
                                    <span
                                      className={
                                        isMissing
                                          ? styles.barValueMuted
                                          : styles.barValue
                                      }
                                    >
                                      {displayValue}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <span className={styles.barGroupLabel}>
                          {group.model}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
