# Usar a imagem base do Node.js 20.10.0
FROM node:20.10.0

# Definir o diretório de trabalho como /app
WORKDIR /

# Copiar apenas o package.json e package-lock.json (se existir) para aproveitar o cache do Docker
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o resto da aplicação
COPY . .

# Buildar a aplicação
RUN npm run build

# Expor a porta necessária pela aplicação
EXPOSE 80

# Definir o comando para iniciar a aplicação
CMD ["npm", "run", "dev"]
