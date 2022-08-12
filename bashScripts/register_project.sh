# change this based on your own environment
. /Users/shanzhang/cardano-express-backend/bashScripts/env.sh

AUTH_ID="testnetUEYYJPhM1RhYsHGJaruXq2inBiDcvy56"
URL="https://cardano-testnet.blockfrost.io/api/v0"


scriptAddr="addr_test1wpl9c67dav6n9gjxlyafg6dmsql8tafy3pwd3fy06tu26nqzphnsx"
tokenName=$(cat $preDir/token.hex)
policyId=$(cat $preDir/qvf.symbol)
authAsset="$policyId.$tokenName"


currDatum="$preDir/curr.datum"
updatedDatum="$preDir/updated.datum"
action="$preDir/action.redeemer"


projectsPKH=$(cat /Users/shanzhang/cardano-express-backend/WalletsKeys/$1.pkh)
projectsAddr=$(cat /Users/shanzhang/cardano-express-backend/WalletsKeys/$1.addr)
txIn=$(get_first_utxo_of_wallet $projectsAddr)
obj=$(get_random_utxo_hash_lovelaces $scriptAddr "$policyId$tokenName" 0 9 | jq -c .)
obj=$(add_datum_value_to_utxo $obj)
setCommonVariables $(echo $obj | jq -c .) 2000000
$qvf add-project   \
     $projectsPKH  \
     $2            \
     $3            \
     $currDatum    \
     $updatedDatum \
     $action
update_contract $1 $txIn
