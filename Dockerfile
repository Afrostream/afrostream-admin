FROM node:6.11
MAINTAINER Marc Dassonneville <marcdassonneville@afrostream.tv>

# creating our directory
RUN mkdir -p /opt/admin
WORKDIR /opt/admin

# installing dependencies
COPY package.json /opt/admin/package.json
COPY yarn.lock /opt/admin/yarn.lock
COPY bower.json /opt/admin/bower.json
RUN yarn

# we add our code
COPY . .

EXPOSE 5704

# best practice: call node directly.
CMD ["node", "server/server.js"]
