import styles from "./page.module.css";

const PROMPT = "Find the password in the provided context.";

const CONTEXT_PARAGRAPHS = [
  "When you're starting out, the work is rarely glamorous. You spend your days in the weeds, interviewing users, debugging small-but-critical issues, and trying to keep your momentum from fading. The founders who win are the ones who keep learning faster than the problems pile up.",
  "The most important insight is that the best startups grow out of a real need felt by their creators. They are either solving their own problem or one they have seen up close, in painful detail. That direct connection keeps them honest about what actually matters.",
  "If you listen closely to your users, they'll tell you where the product should go next. They'll also tell you what they value so much that they'd be disappointed to lose it. Relentlessly tuning yourself to that signal is how a meandering project becomes a company.",
];

const PASSWORD_HEX = "9f3ad6c2b781";

const HIGHLIGHTS = [
  "Try for free ↓",
];

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.glowTop} />
      <div className={styles.glowBottom} />
      <header className={styles.header}>
        <span className={styles.brand}>Route46</span>
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
            {HIGHLIGHTS.map((text) => (
              <span key={text}>{text}</span>
            ))}
          </div>
        </section>

        <section className={styles.interactive}>
          <div className={styles.promptGroup}>
            <div className={styles.promptPanel}>
              <p className={styles.promptCopy}>{PROMPT}</p>
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
              <p className={styles.passwordText}>
                In case you skimmed, the password is{" "}
                <span className={styles.passwordHighlight}>{PASSWORD_HEX}</span>
                {" "}
                quietly embedded in the notes.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.preview}>
          <div className={styles.dashboard}>
            <div className={styles.dashboardHeader}>
              <div className={styles.tabActive}>Demo: CRM Pro</div>
              <div className={styles.statusSignal}>
                <span className={styles.dot} />
                live
              </div>
            </div>
            <div className={styles.dashboardBody}>
              <div className={styles.metricGrid}>
                <div>
                  <span className={styles.metricLabel}>Total Leads</span>
                  <span className={styles.metricValue}>128</span>
                  <span className={styles.metricDelta}>+18%</span>
                </div>
                <div>
                  <span className={styles.metricLabel}>Pipeline Value</span>
                  <span className={styles.metricValue}>$420k</span>
                  <span className={styles.metricDelta}>+12%</span>
                </div>
                <div>
                  <span className={styles.metricLabel}>Response Time</span>
                  <span className={styles.metricValue}>2m 14s</span>
                  <span className={styles.metricDelta}>-32%</span>
                </div>
              </div>
              <div className={styles.transcript}>
                <h4>Recent activity</h4>
                <p>
                  The agent briefed Jamie on the YC investor follow-up sequence,
                  aligned with the uploaded CRM playbook, and queued a personalized
                  follow-up email.
                </p>
                <p>
                  <strong>Next:</strong> Invite the viewer to upload their own deck
                  to simulate a live workflow.
                </p>
              </div>
            </div>
          </div>
          <aside className={styles.updates}>
            <h4>Why it resonates</h4>
            <ul>
              <li>Proves the narrative with a tactile, guided walkthrough.</li>
              <li>Uses the viewer&apos;s documents to tailor every response.</li>
              <li>Keeps the interface focused, confident, and investor ready.</li>
            </ul>
          </aside>
        </section>
      </main>
    </div>
  );
}
