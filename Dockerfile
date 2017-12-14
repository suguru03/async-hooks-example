FROM mhart/alpine-node:9.3.0

RUN apk --update add --virtual .build-dependencies --no-cache \
		python \
		make \
		g++ \
		curl \
		libc6-compat

COPY ./ /opt/app/
WORKDIR /opt/app/
CMD node http.js
