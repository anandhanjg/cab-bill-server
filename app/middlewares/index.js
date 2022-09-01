const cors=require('cors');
const path=require('path');
 

module.exports.setMiddlewares=(app,express)=>{

     
    // app.use(function(req,res,next){
    //     res.header("Access-Control-Allow-Origin", "*");
    //     res.header("Access-Control-Allow-Headers", "*");//"Origin, X-Requested-With, Content-Type, Accept, Authorization, authorization");
    //     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD');
    //     next();
    // });

    app.use(function(req,res,next){
        req.ip=req.connection.remoteAddress;
        next();    
    });
    
    app.use(cors("*"));

    app.use(express.json({limit:'150mb'}));
    app.use(express.urlencoded({extended:false}));

    app.set('views',path.join(__dirname,'../views'));
    app.set('view engine','ejs');

    
    app.use(express.static(path.join(__dirname,'../public')));
    app.use(express.static(path.join(__dirname,'../asset')));

}