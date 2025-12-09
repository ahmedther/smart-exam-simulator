FROM node:alpine AS builder

LABEL maintainer='ahmed'

WORKDIR /frontend

COPY ./ ./

RUN npm install && \
    npm run build

FROM nginx:mainline-alpine-slim

LABEL maintainer='ahmed'

COPY --from=builder /frontend/dist /usr/share/nginx/html

COPY ./nginx/default.conf.tpl /etc/nginx/templates/default.conf.template

RUN rm -f /etc/nginx/conf.d/default.conf && \
    mkdir -p /var/log/nginx