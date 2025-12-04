FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install || npm install --legacy-peer-deps

COPY tsconfig.json ./tsconfig.json
COPY src ./src

RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --only=production || npm install --only=production --legacy-peer-deps

COPY --from=build /app/dist ./dist

EXPOSE 4000

CMD ["node", "dist/index.js"]
