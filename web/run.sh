#!/bin/bash

cd "$(dirname "$0")" || exit 1

for cmd in npm go; do
    if ! command -v "$cmd" >/dev/null 2>&1; then
        echo "Please install $cmd"
        exit 1
    fi
done

[ -d web/node_modules ] || npm install
npm run build
go run main.go localhost:1071