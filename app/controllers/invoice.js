const { BillTypes } = require("../common/const");
const { ClientError, ServerError } = require("../errors/errors");
const InvoiceModel = require("../models/invoiceModel");
const ejs=require('ejs');
const path=require('path');
const wkhtmltopdf = require("wkhtmltopdf");


class Invoice{

    static async getInvoiceBill(req,res){
        try{
            console.log(path.join(__dirname,'../views/bill.ejs'));
            let html=await ejs.renderFile(path.join(__dirname,'../views/bill.ejs'),{},{});
            // wkhtmltopdf(html).pipe(res);
            // res.json({html});
            res.send(html);
        }catch(err){
            next(err);
        }
    }

    static correctValue(invoice){
        if(invoice.invoiceType==BillTypes.PACKAGE || invoice.invoiceType==BillTypes.HOUR_CHARGE){
            invoice.acKms=0;
            invoice.nonAcKms=0;
            invoice.acChargePerKm=0;
            invoice.nonAcChargePerKm=0;
            invoice.vehicleChargePerDay=0;
        }else if(invoice.invoiceType!=BillTypes.PACKAGE){
            invoice.packageAmount=0;
        }else if(invoice.invoiceType!=BillTypes.HOUR_CHARGE && invoice.invoiceType!=BillTypes.HOUR_AND_KM_CHARGE){
            invoice.chargePerHour=0;
        }        
    }

    static async create(req,res,next){
        try{

            if(!req.body.travel_id) throw new ClientError("Travel Id Required");
            
            req.body.created_by=req.user.id;

            if(req.body.locationsCovered && !Array.isArray(req.body.locationsCovered)){
                req.body.locationsCovered=req.body.locationsCovered.split(',');
            }
            
            delete req.body.id;
            delete req.body.invoiceNo;

            Invoice.correctValue(req.body);

            let lastInvoice=await InvoiceModel.findOne({
                where:{
                    travel_id:req.body.travel_id
                },order:[['createdAt','DESC']]})
            
            if(lastInvoice){
                let lin = +(lastInvoice.invoiceNo.replace('INC_',''));
                req.body.invoiceNo="INC_00"+(lin+1);
            }else{
                req.body.invoiceNo="INC_00"+1;
            }
            
            let invoice=InvoiceModel.build(req.body);
            await invoice.save();
            res.json({invoice});
        }catch(err){
            next(err);
        }
        
    }

    static async edit(req,res,next){
        try{
            let id=req.params.id;
            if(!id) throw new ClientError("id required");
            delete req.body.createdAt;
            delete req.body.updatedAt;
            delete req.body.created_by;
            delete req.body.id;
            delete req.body.invoiceNo;
            let invoice=await InvoiceModel.findOne({where:{id}});
            Object.entries(req.body).forEach(entry=>{
                invoice[entry[0]]=entry[1];
            });
            await invoice.save();
            res.json({invoice});
        }catch(err){
            next(err);
        }
    }

    static async view(req,res,next){
        try{
            const id=req.params.id;
            if(!id) throw new ClientError("id Required");
            let invoice=await InvoiceModel.findOne({where:{id}});
            res.json({invoice});
        }catch(err){
            next(err)
        }
    }

    static async download(req,res,next){

    }

    static async delete(req,res,next){
        try{
            const id=req.params.id;
            if(!id) throw new ClientError("id required");
            await InvoiceModel.destroy({where:{id}});
            res.json({"message":"ok"});
        }catch(err){
            next(err);
        }
    }

    static async fetch(req,res,next){
        try{
            let invoices=await InvoiceModel.findAll({where:{
                created_by:req.user.id
            }});
            res.json({invoices});
        }catch(err){
            next(err);
        }
    }
}

module.exports=Invoice;