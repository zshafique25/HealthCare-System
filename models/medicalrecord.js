var mongoose = require("mongoose");

var medicalrecordSchema= new mongoose.Schema({
    hospitalname: String,
    patientcnic: String,
    patientname: String,
    doctorcnic: String,
    doctorname: String,
    timeofarrival: {type:Date,default:Date.now},
    medication: String,
    medicationdescription: String,
    comments: String,
    illness:String 
}); 

module.exports=mongoose.model("Medicalrecord",medicalrecordSchema);