FROM node:16.8.0-slim

# install generic font that is used by generating charts
RUN apt-get update && apt-get install -y fontconfig

WORKDIR /app
COPY . /app
RUN yarn install --prod

CMD yarn start
