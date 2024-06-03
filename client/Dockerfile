# Use uma imagem base do Node.js para construir o aplicativo React
FROM node:14 as build

# Diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copiar o arquivo de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o código da aplicação
COPY . .

# Construir a aplicação React
RUN npm run build

# Use uma imagem leve do servidor web para servir o aplicativo React construído
FROM nginx:alpine

# Copiar o aplicativo React construído para o diretório de publicação do servidor web
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Copiar o arquivo de configuração Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor a porta do servidor web
EXPOSE 80

# Nginx é iniciado automaticamente pelo contêiner de base