var mongoose = require("mongoose");

var hospitalSchema= new mongoose.Schema({
    name: String,
    city: String,
    address: String,
    contact: String,
    email: String, 
    medicine: Number,
    optics: Number,
    cardiology: Number,
    appointments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appointment"
        }
    ],
    doctors:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    medicalrecords:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Medicalrecord"
        }
    ]
}); 

module.exports=mongoose.model("Hospital",hospitalSchema);