FROM mariadb:latest

COPY init.sql /docker-entrypoint-initdb.d/

ENV MYSQL_DATABASE=sistema_de_votacao_api

EXPOSE 3306
