require('dotenv').config();
const {Sequelize}=require('sequelize');

const {PSQL_HOST,PSQL_USERNAME,PSQL_PASSWORD,PSQL_PORT,PSQL_DB_NAME}=process.env;

const sequelize=new Sequelize(`postgres://${PSQL_USERNAME}:${PSQL_PASSWORD}@${PSQL_HOST}:${PSQL_PORT}/${PSQL_DB_NAME}`,{
    // logging:console.log,
});

module.exports=sequelize;