# Makefile for building se-ingest-router
BUILD_DATE ?= $(strip $(shell date -u +"%Y-%m-%dT%H:%M:%SZ"))
ENVIRONMENT ?= development
APPNAME ?= dds-covid19-reports
SHA ?= $(shell git rev-parse --short HEAD)
BRANCH ?= $(shell git rev-parse --symbolic-full-name --abbrev-ref HEAD)
DOCKER_BRANCH ?= $(subst /,-,$(BRANCH))
DOCKER_TAG=$(ENVIRONMENT)-$(DOCKER_BRANCH)-$(SHA)
VERSION ?= 7.10.7
NAMESPACE ?= default
AWS_ACCT ?= 519479409477
REGION ?= us-gov-west-1
DOCKER_REPO ?= $(AWS_ACCT).dkr.ecr.$(REGION).amazonaws.com/$(APPNAME)
DOCKER_IMG ?= $(DOCKER_REPO):$(DOCKER_TAG)

# vault secrets
NPM_TOKEN ?=


all: build push

default: build

login:
	aws ecr \
		get-login-password \
		--region $(REGION) | \
		docker login \
		--username AWS \
		--password-stdin $(AWS_ACCT).dkr.ecr.$(REGION).amazonaws.com

build:
	docker build \
		--no-cache=true \
		--force-rm \
		--network=host \
		--build-arg BUILD_DATE=$(BUILD_DATE) \
		--build-arg NPM_TOKEN=$(NPM_TOKEN) \
		-t $(DOCKER_REPO):$(APPNAME)-$(ENVIRONMENT)-latest \
		-t $(DOCKER_IMG) .

push:
	docker push $(DOCKER_IMG)
	docker push $(DOCKER_REPO):$(APPNAME)-$(ENVIRONMENT)-latest

ls list:
	@$(MAKE) -pRrq -f $(lastword $(MAKEFILE_LIST)) : 2>/dev/null | awk -v RS= -F: '/^# File/,/^# Finished Make data base/ {if ($$1 !~ "^[#.]") {print $$1}}' | sort | egrep -v -e '^[^[:alnum:]]' -e '^$@$$'

.PHONY: login build push ls list
