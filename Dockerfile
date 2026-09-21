# ---------- Etapa 1: build de Angular ----------
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration production

# El builder "application" de Angular saca el output a dist/<nombre>/browser
# (ver angular.json → outputPath: "dist/ecommerce"). Lo copiamos así en la
# siguiente etapa para no tener que hardcodear el nombre dos veces.

# ---------- Etapa 2: servir con nginx ----------
FROM nginx:alpine

COPY --from=build /app/dist/ecommerce/browser /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Render asigna el puerto vía la variable de entorno PORT (no siempre 80),
# así que el conf se genera al arrancar el contenedor con ese valor real.
ENV PORT=8080
EXPOSE 8080

CMD ["/bin/sh", "-c", "envsubst '$PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
