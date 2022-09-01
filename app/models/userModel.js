// const { DataTypes } = require('sequelize/types');
const DataTypes=require('sequelize');
const uuid4 = require('uuid4');
const { tables } = require('../common/const');
const { getHash, getHashSync } = require('../configs/bcrypt');
const sequelize=require('../configs/sequelize');
const RootModel = require('./rootModel');
class UserModel extends RootModel{

    static async findWithOutPassword(options={}){
        return UserModel.findAll({...options,attributes:{exclude:['password']}});
    }

}
UserModel.init(
    {
        id:{
            type:DataTypes.UUID,
            defaultValue:DataTypes.UUIDV4,
            primaryKey:true
        },
        firstName:{
            type:DataTypes.STRING(30),
            allowNull:false,
            validate:{
                notNull:{
                    msg:'firstName is not given'
                }
            }
        },
        lastName:{
            type:DataTypes.STRING(30),
            allowNull:false,
            validate:{
                notNull:{
                    msg:'lastName is not given'
                }
            }
        },
        fullName:{
            type:DataTypes.VIRTUAL,
            get(){
                return `${this.firstName} ${this.lastName}`;
            },
            set(value){
                throw new Error("Full Name Not Exists!");
            }
        },
        email:{
            type:DataTypes.STRING(80),
            unique:true,
            allowNull:false,
            validate: {
                is: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                notNull:{
                    msg:"email is not given."
                }
            }
        },
        username:{
            type:DataTypes.STRING(80),
            allowNull:false,
            unique:true,
            validate:{
                notNull:{
                    msg:'username required'
                }
            }
        },
        password:{
            type:DataTypes.STRING,
            allowNull:false,
            validate:{
                notNull:{
                    msg:'Password Required'
                }
            }
            // set(value){
            //     this.setDataValue('password',getHashSync(value))
            // }
            // async set(value){
            //     console.log("Setting Password");
            //     let p=await getHash(value);
            //     console.log(p);
            //     this.setDataValue('password',p);
            // }
        }
    },
    {
        sequelize,
        modelName:'User',
        timestamps:true,
        tableName:tables.users
    }
);

module.exports=UserModel;


