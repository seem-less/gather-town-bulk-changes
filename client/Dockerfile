FROM node:12
WORKDIR /app/client
COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY . .
EXPOSE 3000
ENV NODE_ENV=development
CMD [ "yarn", "start" ]