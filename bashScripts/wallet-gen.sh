MAGIC="--testnet-magic 1097911063"

cardano-cli address key-gen --verification-key-file WalletsKeys/$1.vkey --signing-key-file WalletsKeys/$1.skey

cardano-cli address build --payment-verification-key-file WalletsKeys/$1.vkey --out-file WalletsKeys/$1.addr $MAGIC

cat "WalletsKeys/$1.addr"
