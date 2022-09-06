#!/usr/bin/env bash

node index.js \
    -f https://raw.githubusercontent.com/stripe/openapi/master/openapi/spec3.beta.sdk.yaml \
    -f https://raw.githubusercontent.com/kubernetes/kubernetes/master/api/openapi-spec/swagger.json \
    -f https://petstore.swagger.io/v2/swagger.json 
