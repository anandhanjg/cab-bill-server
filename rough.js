const { jwtSignSync, jwtVerifySync } = require("./app/configs/jwt");

let token=jwtSignSync({message:'ok'},{expiresIn:"1s"});

console.log(token);
setTimeout(()=>{
    let payload=jwtVerifySync(token);
    console.log(payload);
},1000*60)
