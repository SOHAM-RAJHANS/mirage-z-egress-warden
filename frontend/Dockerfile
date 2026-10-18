# MIRAGE-Z SOC console (TanStack Start + Nitro node-server bundle)
FROM node:22-alpine AS build

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

ARG VITE_MIRAGE_API_URL=http://localhost:8000
ENV VITE_MIRAGE_API_URL=$VITE_MIRAGE_API_URL

RUN pnpm build

FROM node:22-alpine AS runtime

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=8081

WORKDIR /app

COPY --from=build /app/.output ./.output
COPY --from=build /app/package.json ./

RUN addgroup -S mirage && adduser -S -G mirage mirage && chown -R mirage:mirage /app

USER mirage

EXPOSE 8081

HEALTHCHECK --interval=15s --timeout=3s --start-period=10s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:8081/').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", ".output/server/index.mjs"]
