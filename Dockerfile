FROM node:14-alpine
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . ./
RUN npm run build
# RUN npm install --only=dev
# RUN npm install -g webpack
# RUN npm install nodemon -g

CMD ["npm","run","start"]