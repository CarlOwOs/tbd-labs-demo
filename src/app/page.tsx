'use client';

import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";

const PROMPT = "Find the password in the provided context.";

const PASSWORD = "0xYCombinatorW26";
const PASSWORD_TEXT = `Password: ${PASSWORD}`;

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
        name: "Ours",
        toneClass: styles.resultSuccess,
        body:
          `I found the password, it's ${PASSWORD}.`,
        speed: 32,
      },
      {
        name: "Llama 1B",
        toneClass: styles.resultSuccess,
        body:
          `I found the password, it's ${PASSWORD}.`,
        speed: 96,
      },
      {
        name: "Mamba3 1.5B",
        toneClass: styles.resultDanger,
        body:
          "I found the password, it's 0000beefdead.",
        speed: 32,
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
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
