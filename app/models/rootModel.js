const { Model, QueryTypes } = require("sequelize");
const sequelize=require('../configs/sequelize');

class RootModel extends Model{
    static async selectQuery(query,opts={}){
        return sequelize.query(query,{...opts,type:QueryTypes.SELECT});
    }

    static async deleteQuery(query,opts={}){
        return sequelize.query(query,{...opts,type:QueryTypes.DELETE});
    }

    static async updateQuery(query,opts={}){
        return sequelize.query(query,{...opts,type:QueryTypes.UPDATE});
    }

    static async insertQuery(query,opts={}){
        return sequelize.query(query,{...opts,type:QueryTypes.INSERT});
    }
}


module.exports=RootModel;