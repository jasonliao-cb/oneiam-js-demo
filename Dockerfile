FROM node:12.16.1-stretch

RUN apt-get update && apt-get install -y libnss3

WORKDIR /oneiam-js

COPY package*.json ./
RUN npm ci

COPY src ./src
COPY tsconfig.json webpack.config.js README.md ./
RUN npm run build

COPY . .

ENTRYPOINT []
CMD ["/bin/bash"]
