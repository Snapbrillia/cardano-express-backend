MAGIC="--testnet-magic 1097911063"

cardano-cli address key-gen --verification-key-file WalletKeys/$1.vkey --signing-key-file WalletKeys/$1.skey

cardano-cli address build --payment-verification-key-file WalletKeys/$1.vkey --out-file WalletKeys/$1.addr $MAGIC

