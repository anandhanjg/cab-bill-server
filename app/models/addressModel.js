const {DataTypes}=require('sequelize');
const uuid4 = require('uuid4');
const { tables } = require('../common/const');
const sequelize=require('../configs/sequelize');
const RootModel = require('./rootModel');

class AddressModel extends RootModel{}

AddressModel.init({
    id:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,
        primaryKey:true
    },
    doorNo:{
        type:DataTypes.STRING,
        allowNull:false,
        field:'door_no'
    },
    street:{
        type:DataTypes.STRING,
        allowNull:false
    },
    city:{
        type:DataTypes.STRING,
        allowNull:false
    },
    pinCode:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:/^\d{6}$/,
        field:'pin_code'
    }
},{ 
    sequelize,
    tableName:tables.addressess,
    modelName:'Address'
});


module.exports=AddressModel;
