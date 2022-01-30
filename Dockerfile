#
# Licensed to the Apache Software Foundation (ASF) under one or more
# contributor license agreements.  See the NOTICE file distributed with
# this work for additional information regarding copyright ownership.
# The ASF licenses this file to You under the Apache License, Version 2.0
# (the "License"); you may not use this file except in compliance with
# the License.  You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
# ========================================================================
# Commercial licenses
# ========================================================================
# Copyright (c) 2022 Shanghai YOUPU Technology Co., Ltd. all rights reserved
# ========================================================================
FROM alpine:latest as pre-build

ARG GATEMAN_VERSION=master

COPY . /usr/local/gateman
RUN rm -f .git .github .vscode

FROM golang:1.14 as api-builder

ARG ENABLE_PROXY=false

WORKDIR /usr/local/gateman

COPY --from=pre-build /usr/local/gateman .

RUN if [ "$ENABLE_PROXY" = "true" ] ; then go env -w GOPROXY=https://goproxy.io,direct ; fi \
    && go env -w GO111MODULE=on \
    && CGO_ENABLED=0 ./api/build.sh

FROM node:14-alpine as fe-builder

ARG ENABLE_PROXY=false

WORKDIR /usr/local/gateman

COPY --from=pre-build /usr/local/gateman .

WORKDIR /usr/local/gateman/web

RUN if [ "$ENABLE_PROXY" = "true" ] ; then yarn config set registry https://registry.npm.taobao.org/ ; fi \
    && yarn install \
    && yarn build

FROM alpine:latest as prod

ARG ENABLE_PROXY=false

RUN if [ "$ENABLE_PROXY" = "true" ] ; then sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories ; fi

WORKDIR /usr/local/gateman

COPY --from=api-builder /usr/local/gateman/output/ ./

COPY --from=fe-builder /usr/local/gateman/output/ ./

RUN mkdir logs

EXPOSE 9000

CMD [ "/usr/local/gateman/manager-api" ]
