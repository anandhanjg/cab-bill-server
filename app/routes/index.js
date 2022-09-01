const { ClientError, ServerError } = require('../errors/errors');

module.exports.setRoutes=async (app,express)=>{
    
    app.get('/',(req,res)=>{
        res.json({message:'OK'});
    });
    
    app.use('/users',require('./user'));   
    app.use('/travels',require('./travel'));
    app.use('/invoices',require('./invoice'));

    app.use((error,req,res,next)=>{
        let code=error.code || 500;
        res.status(code).json({error:error.message || error});
    });

    app.use((req,res,next)=>{
        res.status(404).json({error:'404 Not Found'});
    });
    
}