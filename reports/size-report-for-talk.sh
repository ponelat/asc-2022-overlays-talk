#!/usr/bin/env bash

node index.js -f https://raw.githubusercontent.com/stripe/openapi/master/openapi/spec3.beta.sdk.yaml
node index.js -f https://raw.githubusercontent.com/kubernetes/kubernetes/master/api/openapi-spec/swagger.json
node index.js -f https://petstore.swagger.io/v2/swagger.json
