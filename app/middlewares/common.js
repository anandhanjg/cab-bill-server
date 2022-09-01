const { isEmptyObject } = require("../common/util");
const { jwtVerify } = require("../configs/jwt");
const { ClientError } = require("../errors/errors");
const UserModel = require("../models/userModel");


module.exports={
    checkToken:async (req,res,next)=>{
        try{
            let token = req.headers['authorization'] || req.headers['Authorization'];
            if(!token) throw new ClientError("AUTH_TOKEN REQUIRED",401);
            token=token.replace("Bearer ","");
            let payload=jwtVerify(token);
            req.user=await UserModel.findOne({where:{id:payload.id}});
            if(!req.user || isEmptyObject(req.user)) throw "User Not Found";
            next();
        }catch(err){
            next(err);
        }
    }
}