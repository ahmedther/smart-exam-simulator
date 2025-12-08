FROM nginx:mainline-alpine-slim

LABEL maintainer='ahmed'

COPY ./default.conf.tpl /etc/nginx/templates/default.conf.template

RUN rm -f /etc/nginx/conf.d/default.conf && \
    mkdir -p /var/log/nginx