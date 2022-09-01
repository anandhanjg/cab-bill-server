require('dotenv').config();
const express=require('express');
const sequelize=require('./configs/sequelize');
const { setMiddlewares } = require('./middlewares');
const { setRoutes } = require('./routes');
const app=express();

const PORT=process.env.PORT || 5000;
setMiddlewares(app,express);
setRoutes(app,express);



async function startServer(){
    try{
        await sequelize.authenticate();
        await sequelize.sync({});
        app.listen(PORT,()=>{
            console.log(`Server Running on http://localhost:${PORT}`);
        })
    }catch(err){
        console.log(err);
    }
}

startServer();