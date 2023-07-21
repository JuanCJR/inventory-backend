#RESCATA IMAGEN DE NODE
FROM node:16


#CREA DIRECTORIO Y/O SE POSICIONS EN EL
WORKDIR /var/app

#COPIA TODO A DIRECTORIO DE APP
COPY . /var/app

#COPIA .env A DIRECTORIO DE APP
# COPY .env /var/app/.env

#INSTALACION DE PAQUETES NODE
RUN npm install
RUN npm run build

#CAMBIA PERMISOS DE EJECUCION AL ENTRYPOINT
RUN chmod +x entrypoint.sh

#Define the network ports that this container will listen on at runtime.
EXPOSE 8081

#Configure this container for running as an executable.
ENTRYPOINT [ "/var/app/entrypoint.sh" ]