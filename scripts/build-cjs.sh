#!/bin/bash

set -e

TARGET_FILE=dist/QueryBin.cjs

npx rollup src/QueryBin.js --format cjs --file "${TARGET_FILE}"
npx prettier -w "${TARGET_FILE}"
git add "${TARGET_FILE}"