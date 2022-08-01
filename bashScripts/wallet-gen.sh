MAGIC="--testnet-magic 1097911063"

cardano-cli address key-gen --verification-key-file payment.vkey --signing-key-file payment.skey

cardano-cli address build --payment-verification-key-file payment.vkey --out-file payment.addr $MAGIC

