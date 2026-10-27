// =============================================================
// "Banco de dados" falso de usuários (usado só pela API mock).
// NUNCA guarde senha em texto puro num projeto real!
// =============================================================

export const users = [
  {
    id: "1",
    name: "Ana Admin",
    email: "admin@bootcamp.com",
    password: "123456",
    role: "admin",
  },
  {
    id: "2",
    name: "Edu Estagiário",
    email: "estagiario@bootcamp.com",
    password: "123456",
    role: "estagiario",
  },
];

// Devolve o usuário SEM a senha (nunca mande senha para o front!)
export function toPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}
