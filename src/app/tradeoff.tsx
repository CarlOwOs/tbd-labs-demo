// Scatter Trade-off Visualization Component
import styles from "./page.module.css";

export const ScatterTradeoff = () => {
  const width = 420;
  const height = 340;
  const padding = { top: 60, right: 40, bottom: 50, left: 60 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  // Adjusted costs: Transformers biggest, SSMs medium, Ours smallest
  const models = [
    { name: "SSMs", speed: 90, accuracy: 35, cost: 28, className: styles.scatterBubbleSSM, labelClass: styles.scatterLabelOther },
    { name: "Transformers", speed: 25, accuracy: 92, cost: 100, className: styles.scatterBubbleTransformer, labelClass: styles.scatterLabelOther },
    { name: "Ours", speed: 88, accuracy: 90, cost: 12, className: `${styles.scatterBubbleOurs} ${styles.scatterBubbleOursAnimated}`, labelClass: styles.scatterLabelOurs },
  ];

  const getX = (speed: number) => padding.left + (speed / 100) * innerWidth;
  const getY = (accuracy: number) => padding.top + innerHeight - (accuracy / 100) * innerHeight;
  const getRadius = (cost: number) => 14 + (cost / 100) * 32;

  // Get "Ours" position for the glow box
  const oursModel = models.find(m => m.name === "Ours")!;
  const oursX = getX(oursModel.speed);
  const oursY = getY(oursModel.accuracy);
  const oursRadius = getRadius(oursModel.cost);
  const glowPadding = 22;

  return (
    <div className={styles.scatterWrapper}>
      <section className={styles.scatterCard}>
        <header className={styles.scatterHeader}>
          <h3>The Impossible Sweet Spot</h3>
          <p>Bubble size = cost (smaller is cheaper)</p>
        </header>
        <svg
          className={styles.scatterSvg}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label="Scatter plot showing speed vs accuracy with cost as bubble size"
        >
          {[25, 50, 75].map((v) => (
            <g key={`grid-${v}`}>
              <line x1={padding.left} y1={getY(v)} x2={width - padding.right} y2={getY(v)} className={styles.scatterGridLine} />
              <line x1={getX(v)} y1={padding.top} x2={getX(v)} y2={height - padding.bottom} className={styles.scatterGridLine} />
            </g>
          ))}
          <line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} className={styles.scatterAxisLine} />
          <line x1={padding.left} y1={padding.top} x2={padding.left} y2={height - padding.bottom} className={styles.scatterAxisLine} />
          <text className={styles.scatterAxisLabel} x={padding.left + innerWidth / 2} y={height - 10} textAnchor="middle">Speed →</text>
          <text className={styles.scatterAxisLabel} x={padding.left - 10} y={padding.top + innerHeight / 2} textAnchor="middle" transform={`rotate(-90, ${padding.left - 10}, ${padding.top + innerHeight / 2})`}>Accuracy →</text>
          
          {/* Glow box centered on "Ours" bubble */}
          <rect 
            x={oursX - oursRadius - glowPadding} 
            y={oursY - oursRadius - glowPadding - 18} 
            width={(oursRadius + glowPadding) * 2} 
            height={(oursRadius + glowPadding) * 2 + 18} 
            fill="rgba(145, 242, 191, 0.08)" 
            rx={14} 
          />
          
          {models.map((model) => (
            <g key={model.name} className={styles.scatterBubble}>
              <circle cx={getX(model.speed)} cy={getY(model.accuracy)} r={getRadius(model.cost)} className={model.className} />
              <text x={getX(model.speed)} y={getY(model.accuracy) - getRadius(model.cost) - 10} className={`${styles.scatterLabel} ${model.labelClass}`}>{model.name}</text>
            </g>
          ))}
        </svg>
        <div className={styles.scatterLegend}>
          <span className={styles.scatterLegendItem}><span className={styles.scatterLegendCircleSmall} />Low cost</span>
          <span className={styles.scatterLegendItem}><span className={styles.scatterLegendCircleLarge} />High cost</span>
        </div>
      </section>
    </div>
  );
};
