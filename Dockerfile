# Etapa 1: Build do Angular
FROM node:18-alpine AS angular

WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala exatamente as versões do package-lock.json
RUN npm ci --force

# Copia o restante do projeto
COPY . .

# Gera o build de produção
RUN npm run build -- --configuration production


# Etapa 2: Servir o Angular com Nginx
FROM nginx:alpine

# Remove a configuração padrão
RUN rm -f /etc/nginx/conf.d/default.conf

# Copia o build do Angular
COPY --from=angular /app/dist/rcc-evento-app2 /usr/share/nginx/html

# Copia configuração customizada
COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]