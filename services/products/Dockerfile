FROM node:22.17.1-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM deps AS test
COPY . .
RUN npm run test

FROM deps AS builder
COPY . .
RUN npm run build

FROM node:22.17.1-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

CMD ["node","dist/main.js"]
