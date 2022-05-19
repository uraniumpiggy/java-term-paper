FROM node:13.12.0-alpine
COPY /build /build
RUN npm install -g serve
CMD ["serve", "-s", "build"]