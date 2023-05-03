var mongoose                =require("mongoose");

var appointmentSchema= new mongoose.Schema({
    typeofcase: String,
    patientcnic: String,
    patientname: String,
    date: String,
    hospital: String,    
}); 


module.exports=mongoose.model("Appointment",appointmentSchema);