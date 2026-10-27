// Mostra o endereço. Não tem "use client", mas como é usado dentro
// de um Client Component (CepSearch), acaba rodando no navegador também.
import { maskCep } from "@/lib/cep/cep-utils";
import styles from "./cep-result.module.scss";

export function CepResult({ address }) {
  const fields = [
    { label: "CEP", value: maskCep(address.cep) },
    { label: "Logradouro", value: address.logradouro },
    { label: "Bairro", value: address.bairro },
    { label: "Cidade", value: address.cidade },
    { label: "UF", value: address.uf },
    { label: "Código IBGE", value: address.ibge },
    { label: "Hehe", value: address.hehe },
  ];

  return (
    <dl className={styles.result}>
      {fields.map((field) => (
        <div key={field.label} className={styles.field}>
          <dt>{field.label}</dt>
          <dd>{field.value || "—"}</dd>
        </div>
      ))}
    </dl>
  );
}
