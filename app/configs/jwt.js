require('dotenv').config();
const jwt=require('jsonwebtoken');
const {JWT_SECRET}=process.env;


const jwtSign=(payload,option)=>{
    if(!option)
        option={expiresIn:"1000d"}
    return jwt.sign(payload,JWT_SECRET,option);
}

const jwtVerify=(token)=>{
    return jwt.verify(token,JWT_SECRET);
}


module.exports={
    jwtSign,
    jwtVerify,
}

