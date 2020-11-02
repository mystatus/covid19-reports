# Makefile for building se-ingest-router

ORG ?= 508654928277.dkr.ecr.us-east-1.amazonaws.com
REPO ?= dds-covid19-reports
ENVIRONMENT ?= development

SHA=$(shell git rev-parse --short HEAD)
BRANCH=$(shell git rev-parse --symbolic-full-name --abbrev-ref HEAD)

TAG=${BRANCH}-${SHA}-${ENVIRONMENT}

login:  
	$$(aws ecr get-login --no-include-email)

build:
	docker build \
	-t $(ORG)/$(REPO):${TAG} \
	--build-arg NPM_TOKEN=$(NPM_TOKEN) \
	--no-cache \
	--network=host \
	.
	echo "TAG=${TAG}" > tag.properties

push:
	docker push \
	$(ORG)/$(REPO):${TAG}

