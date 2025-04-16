# 1. Build React frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install
COPY frontend .
RUN npm run build

# 2. Prepare backend and serve frontend static files
FROM node:20-alpine AS backend
WORKDIR /app
# Copy backend files
COPY package.json package-lock.json ./
COPY index.js .
COPY .env .
RUN npm install --production
# Copy built frontend
COPY --from=frontend-build /app/frontend/build ./public

# 3. Serve frontend as static with Express
# (Assume index.js serves static files from ./public)
EXPOSE 3001
CMD ["node", "index.js"]
