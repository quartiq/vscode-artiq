#!/bin/bash

cd "$(dirname "$0")" || exit 1

for cmd in esbuild go; do
    if ! command -v "$cmd" >/dev/null 2>&1; then
        echo "Please install $cmd"
        exit 1
    fi
done

esbuild src/* --bundle --outdir=static --format=esm
go run main.go localhost:1071
