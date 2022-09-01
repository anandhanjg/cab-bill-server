const { isEmptyObject } = require("../common/util");
const { ClientError } = require("../errors/errors");
const AddressModel = require("../models/addressModel");
const InvoiceModel = require("../models/invoiceModel");
const TravelModel = require("../models/TravelModel");
const UserModel = require("../models/userModel");
const amodel={model:AddressModel,as:'address'}
class Travel{
    static async view(req,res,next){
        try{
            const id=req.params.id;
            const travel=await TravelModel.findOne({where:{id},include:[amodel]});
            res.json({travel});
        }catch(err){
            next(err);
        }
    }

    static async add(req,res,next){
        try{
            if((await TravelModel.count({where:{user_id:req.user.id}}))>5){
                throw new ClientError("Maximum Limit is 5");
            }

            let tvl=req.body.travel;
            if(!tvl.address) throw new ClientError("Address Required");
            delete tvl.address.id; 
            const address=AddressModel.build(tvl.address);
            await address.validate();
            await address.save();
            
            delete tvl.id;
            delete tvl.address;
            tvl['address_id']=address.id;
            tvl['user_id']=req.user.id;
            const travel=TravelModel.build(tvl); 
            await travel.validate();
            await travel.save();

            let mTravel=JSON.parse(JSON.stringify(travel));
            mTravel.address=JSON.parse(JSON.stringify(address));
            res.json({travel:mTravel});
        }catch(err){
            next(err);
        }
    }

    static async update(req,res,next){
        try{
            const id=req.params.id;
            if(!id) throw new ClientError("id required");
            delete req.body.travel.id;
            let tvl=req.body.travel;
            console.table(tvl.address);
            if(tvl.address){
                delete tvl.addressId;
                let aid=tvl.address.id;
                delete tvl.address.id;
                console.table(tvl.address);
                await AddressModel.update(tvl.address,{where:{id:aid}});
            }

            await TravelModel.update(tvl,{where:{id,user_id:req.user.id}});
            let travel=await TravelModel.findOne({where:{id},include:[amodel]});
            res.json({message:'Updated Successfully!',travel});
        }catch(err){
            next(err);
        }
    }

    static async delete(req,res,next){
        try{
            const id=req.params.id;
            if(!id) throw new ClientError("id required");
            let travel=await TravelModel.findOne({where:{id},include:[amodel]});
            if(!travel || isEmptyObject(travel)) throw ClientError("Invalid Id");
            await InvoiceModel.destroy({where:{travel_id:id}});
            await TravelModel.destroy({where:{id,user_id:req.user.id}});
            await AddressModel.destroy({where:{id:travel.address.id}});
            res.json({message:'Deleted Successfully!'});
        }catch(err){
            next(err);
        }
    }

    static async fetch(req,res,next){
        try{
            let travels=await TravelModel.findAll({where:{user_id:req.user.id},include:[amodel]});
            res.json({travels});
        }catch(err){
            next(err);
        }
    }
   
}

module.exports=Travel;