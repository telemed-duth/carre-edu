FROM node:4.4.7-slim

MAINTAINER Nick Portokallidis <portokallidis@gmail.com>

WORKDIR /src
COPY . ./

ENV PORT 80
ENV NODE_ENV production

EXPOSE 80