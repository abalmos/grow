#!/usr/bin/env bash

echo "Add wasm32-unknown-unkown target"
rustup target add wasm32-unknown-unknown
echo "cargo install wasm-bindgen-cli"
cargo install --version 0.2.78 -- wasm-bindgen-cli
echo "cargo build"
cargo build --lib --target wasm32-unknown-unknown --release
echo "wasm-bingen"
wasm-bindgen ./target/wasm32-unknown-unknown/release/geo_utils.wasm --out-dir "pkg" --out-name "geo-utils" --target web
echo "wasm-opt"
wasm-opt ./pkg/geo-utils_bg.wasm -O -g --output ./pkg/geo-utils_bg.wasm
echo "Fix new URL() bug"
node ./fix-new-urls.js
