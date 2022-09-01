const { compare } = require('../configs/bcrypt');
const { QueryTypes } = require('sequelize');
const { isEmptyObject } = require('../common/util');
const { getHash } = require('../configs/bcrypt');
const { jwtSign } = require('../configs/jwt');
const TravelModel = require('../models/TravelModel');
const userModel=require('../models/userModel');
const { ClientError } = require('../errors/errors');
class User{

    static async profile(req,res,next){
        req.user=JSON.parse(JSON.stringify(req.user));
        delete req.user.password;
        res.json({user:req.user});
    }

    static async login(req,res,next){
        try{
            const {username,password}=req.body;
            console.log(req.body);
            if(!username  || !password) throw new ClientError("Username and Password Required");
            let user=await userModel.findOne({where:{username}});
            if(!user || isEmptyObject(user)) throw new ClientError("Invalid User",401);
            if(!(await compare(password,user.password))) throw new ClientError("Invalid Password",401);
            let token=jwtSign({id:user.id,username:user.username});
            res.json({token});
        }catch(err){
            next(err)      
        }
    }    

    static async getUsers(req,res,next){
        let users=await userModel.findAll({
            attributes:{
                exclude:['password']
            },
            include:[{model:TravelModel,as:'user'}]
        });
        res.json({users});
    }

    static async addUser(req,res,next){
        try{
            req.body.password=await getHash(req.body.password);
            let user=userModel.build(req.body);
            await user.validate();
            await user.save()
            res.json({user});
        }catch(err){
            next(err)
        }
    }

    static async updateProfile(req,res,next){
        try{
            let id=req.user.id;
            if(req.body.password){
                req.body.password=await getHash(req.body.password);
            }
            delete req.body.id;
            delete req.body.fullName;
            delete req.body.createdAt;
            delete req.body.updatedAt;

            await userModel.update(req.body,{where:{id}});
            let user=await userModel.findOne({where:{id},
                attributes:{
                    exclude:['password']
                }
            });
            res.json({user,message:'updated successfully'});
        }catch(err){
            next(err)
        }
    }

    static async updateUser(req,res,next){
        try{
            let id=req.params.id;
            if(!id) throw new ClientError('Id Required');
            if(req.body.password){
                req.body.password=await getHash(req.body.password);
            }
            delete req.body.id;
            await userModel.update(req.body,{where:{id}});
            
            res.json({message:'updated successfully'});
        }catch(err){
            next(err)
        }
    }

    static async getUser(req,res,next){
        try{
            let id=req.params.id;
            if(!id) throw new ClientError('id Required');
            let user=await userModel.selectQuery(`SELECT * FROM users WHERE id='${username}'`);
            res.json({user:user.length!=0?user[0]:null});
        }catch(err){
            next(err);
        }
    }

    static async deleteUser(req,res,next){
        try{
            let id=req.params.id;
            if(!id) throw new ClientError('id Required');
            await userModel.destroy({where:{id}});
            res.json({message:'Deleted Successfully'});
        }catch(err){
            res.status(500).json({error:err.message || err});
        }
    }
}

module.exports=User;