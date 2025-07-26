FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

# build کامل با tsc و vite
RUN npm run build

RUN npm install -g serve

EXPOSE 7000

CMD ["serve", "-s", "dist", "-l", "7000"]
