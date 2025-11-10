import styles from "./page.module.css";

const PROMPT = "Find the password in the provided context.";

const PASSWORD_HEX = "Password: 9f3ad6c2b781";

const CONTEXT_PARAGRAPHS = [
  "There's one kind of opinion I'd be very afraid to express publicly. If someone I knew to be both a domain expert and a reasonable person proposed an idea that sounded preposterous, I'd be very reluctant to say \"That will never work.\"",
  <>
    Anyone who has studied the history of ideas, and especially the history of
    science, knows that's how big things start. {" "}
    <span className={styles.passwordHighlight}>{PASSWORD_HEX}</span>. Someone
    proposes an idea that sounds crazy, most people dismiss it, then it
    gradually takes over the world.
  </>,
  "Most implausible-sounding ideas are in fact bad and could be safely dismissed. But not when they're proposed by reasonable domain experts. If the person proposing the idea is reasonable, then they know how implausible it sounds. And yet they're proposing it anyway. That suggests they know something you don't. And if they have deep domain expertise, that's probably the source of it.",
];

// const HIGHLIGHTS = [
//   //"Try for free ↓",
// ];

export default function Home() {
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
          <div className={styles.promptGroup}>
            <div className={styles.promptPanel}>
              <p className={styles.promptCopy}>{PROMPT}</p>
              <span className={styles.promptHint}>Click →</span>
              <button
                type="button"
                className={styles.sendButton}
                aria-label="Send prompt"
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
        </section>
      </main>
    </div>
  );
}
