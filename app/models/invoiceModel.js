const { DataTypes } = require('sequelize');
const { tables, BillTypes } = require('../common/const');
const sequelize=require('../configs/sequelize');
const RootModel = require('./rootModel');
const TravelModel = require('./TravelModel');
const UserModel = require('./userModel');

class InvoiceModel extends RootModel{}

InvoiceModel.init({
    invoiceNo:{
        type:DataTypes.STRING,
        allowNull:false,
        field:'invoice_no'
    },
    id:{
        type:DataTypes.UUID,
        primaryKey:true,
        defaultValue:DataTypes.UUIDV4
    },
    startingKm:{
        type:DataTypes.INTEGER,
        allowNull:false,
        validate:{
            min:0
        },
        field:'starting_km'
    },
    endingKm:{
        type:DataTypes.INTEGER,
        allowNull:false,
        validate:{
            min:0
        },
        field:'ending_km'
    },
    invoiceType:{
        type:DataTypes.STRING,
        validate:{
            validateTripType(value){
                if(!Object.values(BillTypes).find(v=>value==v)){
                    throw new Error("Invalid Invoice Type");
                }
            }
        },
        field:'invoice_type'
    },
    nonAcKms:{
        type:DataTypes.INTEGER,
        defaultValue:0,
        validate:{
            min:0
        },
        field:'non_ac_kms'
    },
    acKms:{
        type:DataTypes.INTEGER,
        defaultValue:0,
        validate:{
            min:0
        },
        field:'ac_kms'
    },
    acChargePerKm:{
        type:DataTypes.INTEGER,
        defaultValue:0,
        validate:{
            min:0
        },
        field:'ac_charge_per_km'
    },
    nonAcChargePerKm:{
        type:DataTypes.INTEGER,
        defaultValue:0,
        validate:{
            min:0
        },
        field:'non_ac_charge_per_km'
    },
    vehicleChargePerDay:{
        type:DataTypes.INTEGER,
        defaultValue:0,
        validate:{
            min:0
        },
        field:'vehicle_charge_per_day'
    },
    chargePerHour:{
        type:DataTypes.INTEGER,
        defaultValue:0,
        validate:{
            min:0
        },
        field:'charge_per_hour'
    },
    tripStartingDate:{
        type:DataTypes.DATE,
        allowNull:false,
        field:'trip_starting_date'
    },
    tripEndDate:{
        type:DataTypes.DATE,
        allowNull:false,
        field:'trip_end_date'
    },
    totalKms:{
        type:DataTypes.VIRTUAL,
        get(){
            return this.endingKm-this.startingKm;
        }
    },
    totalHours:{
        type:DataTypes.VIRTUAL,
        get(){
            return Math.round((new Date(this.tripEndDate)-new Date(this.tripStartingDate))/3600000);
        }
    },
    totalDays:{
        type:DataTypes.VIRTUAL,
        get(){
            return Math.ceil(this.totalHours/24);
        }
    },
    totalVehicleCharge:{
        type:DataTypes.VIRTUAL,
        get(){
            return Math.round(this.totalDays*this.vehicleChargePerDay)
        }
    },
    hourCharge:{
        type:DataTypes.VIRTUAL,
        get(){
            return this.chargePerHour*this.totalHours;
        }
    },
    kmCharge:{
        type:DataTypes.VIRTUAL,
        get(){
            return (this.nonAcChargePerKm*this.nonAcKms) +(this.acChargePerKm*this.acKms);
        }
    },
    total:{
        type:DataTypes.VIRTUAL,
        get(){
            let amount=0;
            if(this.invoiceType===BillTypes.KM_AND_VEH_CHARGE){
                amount=this.kmCharge+this.totalVehicleCharge;
            }else if(this.invoiceType===BillTypes.HOUR_AND_KM_CHARGE){
                amount=this.kmCharge+this.hourCharge;
            }else if(this.invoiceType===BillTypes.HOUR_CHARGE){
                amount=this.hourCharge;
            }else if(this.invoiceType===BillTypes.PACKAGE){
                amount=this.packageAmount;
            }else{
                amount=this.kmCharge;
            }
            return this.tollGateCharge+this.driverBatta+this.parkingCharge+amount;
        }
    },
    vehicleName:{
        type:DataTypes.STRING,
        allowNull:false,
        field:'vehicle_name'
    },
    totalSeats:{
        type:DataTypes.INTEGER,
        allowNull:false,
        field:'total_seats'
    },
    vehicleNo:{
        type:DataTypes.STRING,
        allowNull:false,
        field:'vehicle_no'
    },
    driverBatta:{
        type:DataTypes.INTEGER,
        defaultValue:0,
        validate:{
            min:0
        },
        field:'driver_batta'
    },
    tollGateCharge:{
        type:DataTypes.INTEGER,
        defaultValue:0,
        validate:{
            min:0
        },
        field:'toll_gate_charge'
    },
    parkingCharge:{
        type:DataTypes.INTEGER,
        defaultValue:0,
        validate:{
            min:0
        },
        field:'parking_charge'
    },
    packageAmount:{
        type:DataTypes.INTEGER,
        defaultValue:0,
        validate:{
            min:0
        },
        field:'package_amount'
    },
    packageTripCity:{
        type:DataTypes.STRING,
        defaultValue:null,
        field:'package_trip_city'
    },
    locationsCovered:{
        type:DataTypes.ARRAY(DataTypes.STRING),
        defaultValue:[],
        field:'locations_covered',
        // get(){
        //     if(this.locationsCovered){
        //         return this.locationsCovered.join(',');
        //     }else{
        //         return '';
        //     }
        // }
        // ,
        // set(value){
        //     if(value && !Array.isArray(value)){
        //         value=value.split(',');
        //     }

        //     this.setDataValue('locationsCovered',value);
        // }
    },
    customerName:{
        type:DataTypes.STRING,
        allowNull:false,
        field:'customer_name'
    },
    customerEmail:{
        type:DataTypes.STRING,
        allowNull:false,
        field:'customer_email'
    },
    customerMobile:{
        type:DataTypes.STRING,
        allowNull:false,
        field:'customer_mobile'
    }
},{
    sequelize,
    tableName:tables.invoices,
    modelName:'Invoice',
    timestamps:true,
    validate:{
        endingKmGreaterThanStartingKm(){
            if(+this.endingKm <= +this.startingKm){
                throw new Error("Invalid Starting and Ending Km");
            }
        },
        validateTripDates(){
            if(new Date(this.tripStartingDate) >= new Date(this.tripEndDate)){
                throw new Error("Invalid Trip Dates!");
            }
        },
        validateValues(){
            if(this.invoiceType===BillTypes.PACKAGE ){
                if(this.packageAmount===0) throw new Error("Package Amount Required for Invoice Type Package");
                if(!this.packageTripCity) throw new Error("Please Enter Package Trip City");
            }

            if(this.invoiceType===BillTypes.HOUR_CHARGE && !this.chargePerHour) throw new Error("Please Enter Charge Per Hour");

            if(this.invoiceType!=BillTypes.PACKAGE && this.locationsCovered.length==0) throw new Error("Please Enter Locations Covered");

            if(this.invoiceType===BillTypes.KM_AND_VEH_CHARGE && !this.vehicleChargePerDay) throw new Error("Please Enter Vehicle Charge Per Day");

            if(this.invoiceType!=BillTypes.PACKAGE && this.invoiceType!=BillTypes.HOUR_CHARGE ){
                
                if(!(+this.nonAcChargePerKm) && !(+this.acChargePerKm)) throw new Error("Enter Charge Per km");
                    
                if(!(+this.nonAcKms) && !(+this.acKms)) throw new Error("Enter km Covered in A/C and Non A/C");
                    
                if(+this.nonAcKms && !this.nonAcChargePerKm) throw new Error("Enter Amount for Non A/C km")
                    
                if(+this.acKms && !this.acChargePerKm) throw new Error("Enter Amount for Ac km")
                    
                if((+this.acKms + +this.nonAcKms) != (this.endingKm-this.startingKm)) throw new Error("Invalid A/C or Non A/C km");
                    
            }

        }
    }
})

TravelModel.hasMany(InvoiceModel,{foreignKey:'travel_id',as:'travels'});
InvoiceModel.belongsTo(TravelModel,{foreignKey:'travel_id',as:'travels'});

UserModel.hasMany(InvoiceModel,{foreignKey:'created_by',as:'createdBy'})
InvoiceModel.belongsTo(UserModel,{foreignKey:'created_by',as:'createdBy'});


module.exports=InvoiceModel;