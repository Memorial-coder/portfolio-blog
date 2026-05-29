ARG NODE_IMAGE=docker.m.daocloud.io/library/node:24-alpine
FROM ${NODE_IMAGE} AS build

WORKDIR /app

ARG NPM_CONFIG_REGISTRY=https://registry.npmmirror.com
ENV NPM_CONFIG_REGISTRY=${NPM_CONFIG_REGISTRY}

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM ${NODE_IMAGE} AS runtime

WORKDIR /app
ARG NPM_CONFIG_REGISTRY=https://registry.npmmirror.com
ENV NODE_ENV=production
ENV PORT=8080
ENV DATA_DIR=/app/data
ENV NPM_CONFIG_REGISTRY=${NPM_CONFIG_REGISTRY}

COPY --from=build /app/build ./build
COPY --from=build /app/server ./server

RUN mkdir -p /app/data

EXPOSE 8080

CMD ["node", "server/index.js"]
