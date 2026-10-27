// =============================================================
// Tempo de vida dos tokens (em segundos), lidos do .env.
// Usado só pela API mock (quem cria os tokens).
//
// Number("60") -> 60. Se a variável não existir, usamos o padrão.
// =============================================================
export const ACCESS_TOKEN_TTL = Number(process.env.ACCESS_TOKEN_TTL_SECONDS) || 60;
export const REFRESH_TOKEN_TTL = Number(process.env.REFRESH_TOKEN_TTL_SECONDS) || 3600;
