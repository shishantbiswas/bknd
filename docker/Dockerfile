# Stage 1: Build stage
FROM node:24 as builder
WORKDIR /app

# define userbase version to be used as:
# `docker build --build-arg VERSION=<version> -t userbase .`
ARG VERSION=0.18.0

# Install & copy required cli
RUN npm install --omit=dev userbase@${VERSION}

# Stage 2: Final minimal image
FROM node:24-alpine

WORKDIR /app

# Install required dependencies
RUN npm install -g pm2
RUN echo '{"type":"module"}' > package.json

# Copy dist and node_modules from builder
COPY --from=builder /app/node_modules/userbase/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Create volume and init args
VOLUME /data
ENV DEFAULT_ARGS="--db-url file:/data/data.db"

EXPOSE 1337
CMD ["pm2-runtime", "dist/cli/index.js run ${ARGS:-${DEFAULT_ARGS}} --no-open"]
