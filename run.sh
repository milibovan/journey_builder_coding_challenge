#!/bin/bash

cleanup() {
    echo ""
    echo "Terminating background processes..."
    if [ -n "$SERVER_PID" ]; then
        kill $SERVER_PID
    fi
    exit
}

trap cleanup SIGINT

echo "Initializing project sequence..."

echo "[1/2] Starting frontendchallengeserver..."
cd frontendchallengeserver
npm start &
SERVER_PID=$!
cd ..

echo "[2/2] Starting journey_builder..."
cd journey_builder
npm install --legacy-peer-deps
npm run dev
