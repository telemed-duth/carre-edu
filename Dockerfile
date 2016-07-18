FROM mhart/alpine-node:4

MAINTAINER Nick Portokallidis <portokallidis@gmail.com>

WORKDIR /src
COPY . ./

ENV PORT 80
ENV NODE_ENV production

EXPOSE 80