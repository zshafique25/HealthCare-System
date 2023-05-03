var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");



var userSchema = new mongoose.Schema({
    username:String,
    name: String,
    email: String,
    bloodGroup: String,
    dateOfBirth: String,
    gender: String,
    password: String,
    accounttype: String,
    isverified: { 
        type:Boolean,
        default:false
    },
    specialization: String,
    hospital: String,
    patientrecords: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Medicalrecord"
        }
    ],
    medicalrecords: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Medicalrecord"
        }
    ],

});



userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);