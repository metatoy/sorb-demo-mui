# syntax=docker/dockerfile:1
# Stage 1 — build the Vite static site (standalone: @sorb/* from npm, kit from the pinned GitHub ref)
FROM node:20-alpine AS build
RUN apk add --no-cache git       # npm needs git for the github: kit dependency
WORKDIR /app
COPY . .
ARG VITE_SORB_ORIGIN
ARG VITE_SORB_KEY
ARG VITE_SORB_PREVIEW
ENV VITE_SORB_ORIGIN=$VITE_SORB_ORIGIN \
    VITE_SORB_KEY=$VITE_SORB_KEY \
    VITE_SORB_PREVIEW=$VITE_SORB_PREVIEW
# Drop any local lockfile so @sorb/* resolve pinned from the registry
RUN rm -f pnpm-lock.yaml package-lock.json && npm install --no-audit --no-fund && npm run build

# Stage 2 — serve /dist via nginx (SPA fallback)
FROM nginx:alpine
RUN apk add --no-cache curl      # Coolify healthcheck execs curl in-container
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
