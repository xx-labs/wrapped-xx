#!/bin/bash

set -e

# Bytecode
bytecode=$(jq -r '.bytecode' ./artifacts/contracts/WrappedXX.sol/WrappedXX.json)

# Encode args
admin=0xd74db3908a5ba94559ef9baa00cd597ad8cbd0f6

args=$(cast abi-encode "const(address)" $admin)
args=${args:2}

# Generate address
cast create2 --starts-with 17112021 --init-code $bytecode$args