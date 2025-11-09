import styles from "./page.module.css";

const PROMPT = `Guide the viewer through our voice-enabled workflow builder. Highlight how they can upload a sales playbook and instantly spin up a working prototype. Close by inviting them to press Send to feel the demo.`;

const CONTEXT = `## Product Snapshot
- Company: Redline Labs (YC)
- Mission: Launch immersive voice-first demos on top of any internal docs.
- Current Focus: Investor experience that runs on a CRM playbook we provide by default.
- Demo Flow:
  1. Greet the viewer confidently.
  2. Summarize what the uploaded playbook contains.
  3. Explain how their own deck or doc can power the same experience.
  4. Prompt them to press Send to trigger the scripted walkthrough.`;

const HIGHLIGHTS = [
  "Build with natural language",
  "Connect your data",
  "Deploy investor demos",
];

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.glowTop} />
      <div className={styles.glowBottom} />
      <header className={styles.header}>
        <span className={styles.brand}>Redline Labs</span>
      </header>
      <main className={styles.main}>
        <section className={styles.hero}>
          <span className={styles.eyebrow}>YC-backed • Demo ready</span>
          <h1>The best way to launch your agent demo</h1>
          <p>
            Build a voice-forward assistant in minutes. Drop in your context,
            press send, and let teams experience the future product while you
            keep shipping.
          </p>
          <div className={styles.pills}>
            {HIGHLIGHTS.map((text) => (
              <span key={text}>{text}</span>
            ))}
          </div>
        </section>

        <section className={styles.interactive}>
          <div className={styles.promptPanel}>
            <header className={styles.promptHeader}>
              <span>Demo console</span>
              <span className={styles.statusBadge}>ready</span>
            </header>
            <div className={styles.promptInputs}>
              <div className={styles.promptBlock}>
                <h3>Prompt</h3>
                <textarea value={PROMPT} readOnly aria-label="Demo prompt" />
              </div>
              <div className={styles.promptBlock}>
                <h3>Context</h3>
                <textarea value={CONTEXT} readOnly aria-label="Context document" />
              </div>
            </div>
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
