var express = require("express"),
    Hospital = require("../models/hospital.js"),
    passport = require("passport"),
    router = express.Router({ mergeParams: true });

//
//Routes only for booking an appointment
//Renders the hospitals
//
router.get("/", isLoggedIn, function (req, res) {
    Hospital.find({}, function (err, hospitals) {
        res.render("appointments/bookappointment", { currentUser: req.user, hospitals: hospitals });
    });
});


//
//Creates an appointment only if the requested date and case type has space
//That space(Number of daily patients for a specific case)
//is provided to the database when a hospital is registered by an admin
//
router.post("/", isLoggedIn, function (req, res) {
    var requesteddate = req.body.date + "-" + req.body.month + "-" + req.body.year;
    Hospital.findOne({ name: req.body.hospital }, function (err, foundHospital) {
        Appointment.countDocuments({ hospital: req.body.hospital, typeofcase: req.body.typeofcase, date: requesteddate }, function (err, result) {
            if ((result) >= foundHospital[req.body.typeofcase]) {
                res.render("appointments/appointmentsfull");
            }
            else {
                Appointment.create({
                    typeofcase: req.body.typeofcase,
                    patientcnic: req.user.cnic,
                    patientname: req.user.name,
                    date: requesteddate,
                    hospital: req.body.hospital,
                },
                    function (err, newappointment) {
                        foundHospital.appointments.push(newappointment._id);
                        foundHospital.save();
                        res.render("appointments/appointmentconfirmed");
                    });
            };
        });
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/HCS/home");
}

module.exports = router;