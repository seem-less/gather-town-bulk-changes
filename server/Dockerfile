FROM node:12
WORKDIR /app/server
COPY . .
RUN yarn install
EXPOSE 5000
ENV NODE_ENV=development
CMD [ "yarn", "dev" ]