ARG image_version=python:3.10.9
ARG node_image=node:18.17.1

#
#
# Base stage
FROM ${image_version}-alpine3.17 as base

ENV PATH=/app/.venv/bin:$PATH
ENV LANG=C.UTF-8
ENV PYTHONUNBUFFERED=1

# Fix for psycopg2 ssl loading error
# https://stackoverflow.com/questions/60588431/psycopg2-import-error-ssl-check-private-key-symbol-not-found
ENV LD_PRELOAD=/lib/libssl.so.1.1

RUN apk add --no-cache \
    libpq \
    libjpeg \
    libcurl \
    bash \
    libxml2-dev \
    libxslt-dev \
    curl-dev \
    build-base

# GeoDjango dependencies - commented out to keep the image lightweight, but easy to add
# from: https://stackoverflow.com/questions/58403178/geodjango-cant-find-gdal-on-docker-python-alpine-based-image

# RUN apk add --no-cache --upgrade postgresql-client libpq \
#      && apk add --no-cache --upgrade --virtual .build-deps postgresql-dev zlib-dev jpeg-dev alpine-sdk \
#      && apk add --no-cache --upgrade geos proj gdal binutils

# RUN ln -s /usr/lib/libproj.so.25 /usr/lib/libproj.so \
#    && ln -s /usr/lib/libgdal.so.31 /usr/lib/libgdal.so \
#    && ln -s /usr/lib/libgeos_c.so.1 /usr/lib/libgeos_c.so

#ENV GDAL_LIBRARY_PATH='/usr/lib/libgdal.so'

#
#
# Builder stage
FROM base as builder

RUN apk add --no-cache \
    zlib-dev \
    jpeg-dev \
    gcc \
    python3-dev \
    musl-dev \
    postgresql-dev \
    linux-headers \
    build-base \
    libcurl \
    curl-dev \
    libxml2-dev \
    libxslt-dev \
    libffi-dev \
    openssl \
    freetype-dev

RUN pip install --no-cache-dir --upgrade pipenv pip
COPY Pipfile Pipfile.lock requirements.freeze.txt /app/

WORKDIR /app
# In production, virtualenv is created in /app/.venv so it can be copied
# to the final image
RUN PIPENV_VENV_IN_PROJECT=true pipenv run pip3 install -r requirements.freeze.txt

COPY regenfrogs/ /app/regenfrogs
COPY fixtures/ /app/fixtures
COPY manage.py wsgi.py /app/

COPY ./compose/django/*.sh /
RUN chmod +x /*.sh

#
#
# Release-backend
FROM base as release-backend

COPY --from=builder /app /app
COPY --from=builder /*.sh /

RUN apk add --no-cache freetype-dev

RUN mkdir -p /app/frontend

WORKDIR /app
RUN mkdir -p /app/static/uploads && chmod 777 /app/static/uploads
RUN python manage.py collectstatic --noinput
ENV PYTHONSTARTUP=/.pythonrc

ENTRYPOINT ["/entrypoint.sh"]

#
#
# frontend stages

FROM ${node_image} as frontend-base
#  Base nodejs image

FROM frontend-base as frontend-builder
# builder has node_modules

COPY frontend/package.json /app/frontend/package.json
WORKDIR /app/frontend
RUN yarn install


FROM frontend-builder as frontend
# frontend container has the fully built frontend app, this stage is too fat to deploy quickly!
COPY frontend/ /app/frontend/
RUN yarn && yarn build



#
#
# Release-frontend
FROM frontend-base as release-frontend
# Slimmed down with just the standalone

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=frontend --chown=nextjs:nodejs /app/frontend/ /frontend
WORKDIR /frontend

USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["yarn", "start"]

#
#
# Developer image stage - ubuntu based instead of alpine
FROM ${image_version} as dev

ENV LANG C.UTF-8
ENV PYTHONUNBUFFERED 1
ENV PYTHONSTARTUP=/.pythonrc

RUN apt update -yq && apt install -yq \
    netcat gcc python3-dev libpq-dev libxml2-dev libxslt-dev \
    libcurl4-openssl-dev libssl-dev libffi-dev curl \
    build-essential libagg-dev libpotrace-dev pkg-config

RUN pip install --no-cache-dir --upgrade pipenv pip \
    && mkdir /app

# postgis dependencies - uncomment for postgis in development
# RUN apt install -yq libgdal-dev libproj-dev

WORKDIR /app
ENV NODE_VERSION=v18.17.1
RUN apt install -y curl
ENV NVM_DIR=/nvm
RUN mkdir -p $NVM_DIR
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default ${NODE_VERSION}
ENV PATH="${NVM_DIR}/versions/node/${NODE_VERSION}/bin/:${PATH}"
RUN node --version
RUN npm --version



# In dev, pipfile is installed with --system, so it persists even if we mount /app from outside
ADD Pipfile Pipfile.lock /app/
RUN pipenv install --dev --system
RUN npm install --global yarn

# symlink yarn because it won't be on the path when we change UID/GID!
RUN ln -sf /root/.nvm/versions/node/v16.13.0/bin /usr/yarn

COPY compose/django/*.sh /
RUN chmod +x /*.sh

ENTRYPOINT ["/entrypoint.sh"]


#
#
# CI Deployment Container with Helm and Kubectl
FROM kiwigrid/gcloud-kubectl-helm AS deploy
USER root
RUN apk add --no-cache git-crypt

#
#
# This make release-backend the default stage
FROM release-backend
