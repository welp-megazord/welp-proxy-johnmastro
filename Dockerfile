FROM node:10-alpine
WORKDIR /app
ADD . /app
RUN npm install
EXPOSE 2000
ENV PORT 2000
CMD ["node", "server.js"]
