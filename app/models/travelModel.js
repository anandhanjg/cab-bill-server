const { tables } = require('../common/const');
const sequelize=require('../configs/sequelize');
const RootModel = require('./rootModel');
const {DataTypes}=require('sequelize');
const uuid4 = require('uuid4');
const AddressModel = require('./addressModel');
const UserModel = require('./userModel');

class TravelModel extends RootModel{}

TravelModel.init({
    id:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,
        primaryKey:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    mobile:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
        validate:{
            isEmail:true
        }
    }
},{
    timestamps:true,
    tableName:tables.travels,
    modelName:'Travel',
    sequelize
});

try{
    AddressModel.hasOne(TravelModel,{foreignKey:'address_id',as:'address'});
    TravelModel.belongsTo(AddressModel,{foreignKey:'address_id',as:'address'});
    

    UserModel.hasMany(TravelModel,{foreignKey:'user_id',as:'user'});
    TravelModel.belongsTo(UserModel,{foreignKey:'user_id',as:'user'});

}catch(err){
    console.log(err.message);
    process.exit(0);
}


module.exports=TravelModel;