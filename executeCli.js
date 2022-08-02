// Adding code to execute binary commands via Express
var exec = require('child_process').exec, child;
// Adjust pattern of qvf-cli binary to your path(server path)
child = exec('bash invoke-qvf.sh ~Plutus/plutus/cardano-express-backend');
child.stdout.on('data', (data)=>{
    console.log(data); 
    // do whatever you want here with data
});
child.stderr.on('data', (data)=>{
    console.error(data);
});