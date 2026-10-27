"use client";
// =============================================================
// Contador do access token (só para a aula!).
// Mostra quantos segundos faltam para o token expirar.
//
// Props (vêm do servidor):
//   expiresAt       -> quando o token expira (em milissegundos)
//   durationSeconds -> quanto tempo o token dura no total (ex: 60)
// =============================================================
import { useEffect, useState } from "react";
import styles from "./token-countdown.module.scss";

export function TokenCountdown({ expiresAt, durationSeconds }) {
  // null = ainda não calculamos (o componente acabou de aparecer)
  const [secondsLeft, setSecondsLeft] = useState(null);

  useEffect(() => {
    // A cada 1 segundo, recalcula quanto tempo falta
    const timer = setInterval(() => {
      const millisecondsLeft = expiresAt - Date.now();
      const seconds = Math.ceil(millisecondsLeft / 1000);
      setSecondsLeft(seconds > 0 ? seconds : 0);
    }, 1000);

    // Quando o componente sair da tela, para o timer
    return () => clearInterval(timer);
  }, [expiresAt]); // se o token mudar (refresh), recomeça a contagem

  // Sem token, não mostra nada
  if (!expiresAt) {
    return null;
  }

  const isExpired = secondsLeft === 0;

  // Texto do status
  let status = "calculando...";
  if (isExpired) {
    status = "EXPIRADO ⏰";
  } else if (secondsLeft !== null) {
    status = ` expira em ${secondsLeft}s`;
  }

  // Largura da barra, em % (100% = token novinho, 0% = expirado)
  let barWidth = 100;
  if (secondsLeft !== null) {
    barWidth = (secondsLeft / durationSeconds) * 100;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <strong>Access token</strong>
        <span>{status}</span>
      </div>

      <div className={styles.track}>
        <div
          className={isExpired ? `${styles.bar} ${styles.expired}` : styles.bar}
          style={{ width: `${barWidth}%` }}
        />
      </div>

      <p className={styles.hint}>
        {isExpired
          ? "Expirou! Faça uma requisição (botão ou busca) ou navegue pelo menu para ver o refresh."
          : "Espere zerar para ver o refresh token em ação."}
      </p>
    </div>
  );
}
