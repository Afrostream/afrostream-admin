FROM node:4.5

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY entrypoint.sh /

CMD [ "/entrypoint.sh" ]
EXPOSE 5603
