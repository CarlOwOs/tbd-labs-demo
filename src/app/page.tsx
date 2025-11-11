'use client';

import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";

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
        name: "Mamba3 1.5B",
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
  const [plotProgress, setPlotProgress] = useState(0);

  useEffect(() => {
    const handles: number[] = [];

    const resetResults = () => {
      setResultBodies(modelVariants.map(() => ""));
      setResultCompleted(modelVariants.map(() => false));
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
    let frameId: number | null = null;
    let startTime: number | null = null;

    if (!showResults) {
      setPlotProgress(0);
      return () => {
        if (frameId !== null) {
          window.cancelAnimationFrame(frameId);
        }
      };
    }

    const duration = 1800;

    const step = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp;
      }
      const elapsed = timestamp - startTime;
      const nextProgress = Math.min(1, elapsed / duration);
      setPlotProgress(nextProgress);
      if (nextProgress < 1) {
        frameId = window.requestAnimationFrame(step);
      }
    };

    frameId = window.requestAnimationFrame(step);

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [showResults]);

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
    padding: 56,
  };
  const chartInnerWidth =
    chartDimensions.width - chartDimensions.padding * 2;
  const chartInnerHeight =
    chartDimensions.height - chartDimensions.padding * 2;

  const maxMemory = Math.max(
    TRANSFORMER_MEMORY_PER_TOKEN * TOTAL_TOKENS,
    OURS_MEMORY_BYTES,
    MAMBA_MEMORY_BYTES
  );

  const currentTokens = TOTAL_TOKENS * plotProgress;
  const llamaMemoryCurrent =
    TRANSFORMER_MEMORY_PER_TOKEN * currentTokens;

  const getX = (tokens: number) =>
    chartDimensions.padding +
    (tokens / TOTAL_TOKENS) * chartInnerWidth;
  const getY = (memory: number) =>
    chartDimensions.height -
    chartDimensions.padding -
    (Math.max(0, Math.min(memory, maxMemory)) / maxMemory) *
      chartInnerHeight;

  const promptShadeWidth =
    (PROMPT_TOKENS / TOTAL_TOKENS) * chartInnerWidth;
  const contextShadeWidth =
    (CONTEXT_TOKENS / TOTAL_TOKENS) * chartInnerWidth;

  const xTicks = [0, PROMPT_TOKENS, TOTAL_TOKENS];
  const yTicks = Array.from(
    new Set([0, TRANSFORMER_MEMORY_PER_TOKEN * TOTAL_TOKENS, OURS_MEMORY_BYTES, MAMBA_MEMORY_BYTES])
  ).sort((a, b) => a - b);

  const llamaLineEndX = getX(currentTokens);
  const llamaLineEndY = getY(llamaMemoryCurrent);
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
      x: getX(currentTokens),
      y: getY(OURS_MEMORY_BYTES),
      className: styles.plotDotOurs,
      labelOffset: { x: 12, y: -12 },
    },
    {
      name: "Mamba3",
      x: getX(currentTokens),
      y: getY(MAMBA_MEMORY_BYTES),
      className: styles.plotDotMamba,
      labelOffset: { x: 12, y: -12 },
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.glowTop} />
      <div className={styles.glowBottom} />
      <header className={styles.header}>
        <span className={styles.brand}>Leman Labs</span>
      </header>
      <main className={styles.main}>
        <section className={styles.hero}>
          <span className={styles.eyebrow}>MEET TURBO-0</span>
          <h1>The best placeholder text generator</h1>
          <p>
            More placeholder text for you. Drop in your context,
            press send, and let teams experience the place being held while you
            keep shipping.
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
              <div className={styles.promptPanel}>
                <p className={styles.promptCopy}>{PROMPT}</p>
                <span className={styles.promptHint}>Click →</span>
                <button
                  type="button"
                  className={styles.sendButton}
                  aria-label="Send prompt"
                  onClick={() => setShowResults(true)}
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
              <div className={styles.resultsGrid}>
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
                      <span>Peak memory: XX (i still need to define it)</span>
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
                    aria-label="Memory usage plotted against tokens processed for Llama, Ours, and Mamba3."
                  >
                    <rect
                      x={chartDimensions.padding}
                      y={chartDimensions.padding}
                      width={promptShadeWidth}
                      height={chartInnerHeight}
                      className={styles.plotShadePrompt}
                    />
                    <rect
                      x={chartDimensions.padding + promptShadeWidth}
                      y={chartDimensions.padding}
                      width={contextShadeWidth}
                      height={chartInnerHeight}
                      className={styles.plotShadeContext}
                    />

                    <line
                      x1={chartDimensions.padding}
                      y1={chartDimensions.height - chartDimensions.padding}
                      x2={chartDimensions.width - chartDimensions.padding}
                      y2={chartDimensions.height - chartDimensions.padding}
                      className={styles.plotAxis}
                    />
                    <line
                      x1={chartDimensions.padding}
                      y1={chartDimensions.padding}
                      x2={chartDimensions.padding}
                      y2={chartDimensions.height - chartDimensions.padding}
                      className={styles.plotAxis}
                    />

                    <text
                      className={styles.plotAxisLabel}
                      x={chartDimensions.width - chartDimensions.padding}
                      y={chartDimensions.height - chartDimensions.padding + 32}
                    >
                      Tokens processed
                    </text>
                    <text
                      className={styles.plotAxisLabel}
                      x={chartDimensions.padding - 36}
                      y={chartDimensions.padding - 12}
                    >
                      Memory
                    </text>

                    {xTicks.map((tick) => (
                      <g key={`tick-x-${tick}`}>
                        <line
                          x1={getX(tick)}
                          y1={chartDimensions.height - chartDimensions.padding}
                          x2={getX(tick)}
                          y2={chartDimensions.height - chartDimensions.padding + 8}
                          className={styles.plotTick}
                        />
                        <text
                          x={getX(tick)}
                          y={chartDimensions.height - chartDimensions.padding + 24}
                          className={styles.plotTickLabel}
                          textAnchor="middle"
                        >
                          {tick}
                        </text>
                      </g>
                    ))}

                    {yTicks.map((memory) => (
                      <g key={`tick-y-${memory}`}>
                        <line
                          x1={chartDimensions.padding - 8}
                          y1={getY(memory)}
                          x2={chartDimensions.padding}
                          y2={getY(memory)}
                          className={styles.plotTick}
                        />
                        <text
                          x={chartDimensions.padding - 12}
                          y={getY(memory) + 4}
                          className={styles.plotTickLabel}
                          textAnchor="end"
                          dominantBaseline="middle"
                        >
                          {formatBytes(memory)}
                        </text>
                      </g>
                    ))}

                    {plotProgress > 0 && (
                      <>
                        <path
                          d={`M ${baselineX} ${getY(0)} L ${llamaLineEndX} ${llamaLineEndY}`}
                          className={styles.plotLineLlama}
                        />
                        <line
                          x1={baselineX}
                          y1={getY(OURS_MEMORY_BYTES)}
                          x2={getX(currentTokens)}
                          y2={getY(OURS_MEMORY_BYTES)}
                          className={styles.plotLineOurs}
                        />
                        <line
                          x1={baselineX}
                          y1={getY(MAMBA_MEMORY_BYTES)}
                          x2={getX(currentTokens)}
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
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
