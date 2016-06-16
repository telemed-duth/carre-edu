FROM mhart/alpine-node:4

WORKDIR /src
COPY . ./

ENV PORT 80
ENV NODE_ENV production

EXPOSE 80
CMD ["npm", "start"]