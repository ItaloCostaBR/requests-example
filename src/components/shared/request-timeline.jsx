// =============================================================
// Linha do tempo: lista os passos do apiFetch na tela.
// Passos com "401" ganham uma bolinha vermelha.
// =============================================================
import styles from "./request-timeline.module.scss";

export function RequestTimeline({ steps }) {
  // Nenhum passo ainda? Não mostra nada.
  if (steps.length === 0) {
    return null;
  }

  return (
    <ol className={styles.timeline}>
      {steps.map((step, index) => {
        const isError = step.includes("401");

        return (
          <li key={index} className={isError ? `${styles.step} ${styles.warning}` : styles.step}>
            {step}
          </li>
        );
      })}
    </ol>
  );
}
