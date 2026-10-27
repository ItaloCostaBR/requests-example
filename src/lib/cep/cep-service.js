// =============================================================
// Serviço de CEP (roda SÓ no servidor).
//
// API usada: BrasilAPI
//   https://brasilapi.com.br/api/cep/v1/*cep_a_consultar*
//   Documentação: https://brasilapi.com.br/docs#tag/CEP
//
// Responsabilidades:
//  1. Chamar a BrasilAPI usando a URL do .env (CEP_API_URL)
//  2. Tratar os erros (CEP não existe, demora, API fora do ar)
//  3. "Traduzir" a resposta da BrasilAPI para o formato do NOSSO app
//
// Vantagem: se um dia trocarmos a BrasilAPI por outra API, só este
// arquivo muda. O front continua recebendo o mesmo formato.
// (Foi exatamente o que aconteceu: antes usávamos o Postmon!)
//
// A função findCep SEMPRE devolve um objeto assim:
//   { status: 200, body: { ...endereço } }        -> deu certo
//   { status: 404, body: { message: "..." } }     -> deu errado
// =============================================================
import "server-only";

// Variáveis do .env (todas chegam como TEXTO)
const CEP_API_URL = process.env.CEP_API_URL;
const CEP_API_TIMEOUT_MS = Number(process.env.CEP_API_TIMEOUT_MS) || 5000; // "5000" -> 5000 (padrão: 5000)

// Converte a resposta da BrasilAPI para o formato do nosso app.
//
// A BrasilAPI responde em inglês:
//   { cep, state, city, neighborhood, street, ibge: { city, state } }
// Nosso app usa nomes em português:
//   { cep, logradouro, bairro, cidade, uf, ibge }
//
// Se algum campo não vier, usamos "" (texto vazio).
function toAddress(brasilApiData) {
  return {
    cep: brasilApiData.cep,
    logradouro: brasilApiData.street || "",
    bairro: brasilApiData.neighborhood || "",
    cidade: brasilApiData.city || "",
    uf: brasilApiData.state || "",
    // O código IBGE da cidade vem dentro de outro objeto: ibge.city
    ibge: brasilApiData.ibge ? brasilApiData.ibge.city : "",
    hehe: "😎", // só pra mostrar que podemos adicionar campos extras
  };
}

// Recebe um CEP já validado (8 números). Ex: "01001000"
export async function findCep(cep) {
  // Ex: https://brasilapi.com.br/api/cep/v1/01001000
  const url = `${CEP_API_URL}/${cep}`;
  let response;

  try {
    response = await fetch(url, {
      // Se a API demorar mais que o limite, desiste
      signal: AbortSignal.timeout(CEP_API_TIMEOUT_MS),
      cache: "no-store",
    });
  } catch (error) {
    // Caiu aqui = nem conseguiu falar com a API
    if (error.name === "TimeoutError") {
      return {
        status: 504,
        body: { message: "O serviço de CEP demorou demais para responder." },
      };
    }

    // error.cause mostra o motivo real (ex: ENOTFOUND = endereço não existe)
    console.error(
      `[cep-service] Não foi possível acessar ${url}:`,
      error.cause || error.message,
    );
    return {
      status: 502,
      body: { message: "Serviço de CEP indisponível no momento." },
    };
  }

  // A BrasilAPI responde 404 quando o CEP não existe
  if (response.status === 404) {
    return { status: 404, body: { message: "CEP não encontrado." } };
  }

  // Qualquer outro erro da API
  if (!response.ok) {
    console.error(`[cep-service] ${url} respondeu ${response.status}`);
    return {
      status: 502,
      body: { message: "Erro ao consultar o serviço de CEP." },
    };
  }

  const data = await response.json();
  return { status: 200, body: toAddress(data) };
}
