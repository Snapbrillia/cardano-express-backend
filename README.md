# cardano-express-backend
ExpressJS app to handle user requests, cardano-cli commands, qvf-cli &amp; transaction construction.

### Install dependencies

`npm install`

### Step above should install everything
In case it does not, install separately
`npm i --save express`
`npm i --save-dev nodemon`


### Run the server

`npm run dev`

### All execution scripts are in the package.json file under scripts

### Access Project Key for Blockfrost
Create a file blockfrost.id and put the project key to be able to query blockfrosts api
`&`
create a .env file in the root level of the project and add inside
BLOCK_KEY=THEBLOCKFROSTRAWKEY