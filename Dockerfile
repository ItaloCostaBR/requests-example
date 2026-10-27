# =============================================================
# Dockerfile = a "receita" para montar a imagem do projeto.
# Cada linha é um passo. O Docker executa de cima para baixo.
# =============================================================

# 1. Partimos de uma imagem que já tem o Node.js 24 instalado
FROM node:24-alpine

# 2. Pasta de trabalho DENTRO do container (tipo um "cd /app")
WORKDIR /app

# 3. Copiamos primeiro SÓ a lista de dependências...
COPY package.json package-lock.json ./

# 4. ...e instalamos. Como o passo 3 vem antes do código, o Docker
#    guarda esse resultado em cache: se você só mudar o código,
#    ele NÃO reinstala tudo de novo (o build fica rápido).
RUN npm ci

# 5. Agora copiamos o resto do projeto
COPY . .

# 6. Avisamos que o app usa a porta 3000
EXPOSE 3000

# 7. Comando que roda quando o container sobe
CMD ["npm", "run", "dev"]
