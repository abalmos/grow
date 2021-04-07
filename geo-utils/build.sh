#!/usr/bin/env bash

rustup target add wasm32-unknown-unknown
cargo install --version 0.2.73 -- wasm-bindgen-cli
cargo build --lib --target wasm32-unknown-unknown
wasm-bindgen ./target/wasm32-unknown-unknown/debug/geo_utils.wasm --out-dir ../src/lib/geo-utils --out-name "geo-utils" --target web
wasm-opt ../src/lib/geo-utils/geo-utils_bg.wasm -O -g --output ../src/lib/geo-utils/geo-utils_bg.wasm
