var express = require("express"),
    router = express.Router({ mergeParams: true }),
    User = require("../models/user"),
    Appointment = require("../models/appointment"),
    Hospital = require("../models/hospital");



//
///Routes for the Hospital manager only
//


//
//Searching the appointments of a specific day
//
router.get("/checkappointments", isLoggedIn, function (req, res) {
    res.render("hospitalManager/checkappointment");
});

//
//Appointments of the requested day passed to the session for display in the next route
//

router.post("/checkappointments", isLoggedIn, function (req, res) {
    console.log(req.user.hospital);
    var date = req.body.date + "-" + req.body.month + "-" + req.body.year;
    var result = [];
    Appointment.find({}, function (err, all) {
        if (err) {
            console.log(error)
        }
        else {
            all.forEach(function (appointment) {
                if (appointment.hospital === req.user.hospital && appointment.typeofcase === req.body.typeofcase && appointment.date === date) {
                    result.push(appointment);
                };
            });
            req.session.appointments = { appointments: result };
            res.redirect(`/HCS/${req.user._id}/searchedappointments`);
        };
    });
});

//
//renders all the appointments of a specific day
//

router.get("/searchedappointments", isLoggedIn, function (req, res) {
    var searchedappointments = req.session.appointments.appointments;
    res.render("hospitalManager/searchedappointments", { currentUser: req.user, appointments: searchedappointments });
});


//
//route for adding a doctor to the hospital database and
//removing his data from the previous hospital the doctor was in
//
router.get("/addadoctor", isLoggedIn, function (req, res) {
    res.render("hospitalManager/addadoctor");
});

router.post("/addadoctor", isLoggedIn, function (req, res) {
    User.findOne({ username: req.body.username }, function (err, foundUser) {

        if (foundUser.accounttype === "doctor") {
            Hospital.findOne({ name: foundUser.hospital }, function (err, foundhospital) {
                foundhospital.doctors.remove(foundUser._id);
                foundhospital.save();
            });
            Hospital.findOne({ name: req.user.hospital }, function (err, foundhospital) {
                foundUser.hospital = foundhospital.name;
                foundUser.save();
                foundhospital.doctors.push(foundUser._id);
                foundhospital.save();
                return res.render("admin/registered");
            });
        }
        else {
            return res.render("hospitalManager/invalidinfo");
        }
    });
});

//
//Route for adding a doctor who has just graduated
//Will turn his/her accounttype to doctor and open up new links for them
//

router.get("/registernewdoctor", isLoggedIn, function (req, res) {
    res.render("hospitalManager/registernewdoctor")
});

router.post("/registernewdoctor", isLoggedIn, function (req, res) {
    User.findOne({ username: req.body.username }, function (err, foundUser) {
        if (foundUser.accounttype === "patient") {
            foundUser.accounttype = "doctor";
            foundUser.specialization = req.body.specialization;
            foundUser.hospital = req.user.hospital;
            foundUser.save();
            Hospital.findOne({ name: req.user.hospital }, function (err, foundhospital) {
                foundhospital.doctors.push(foundUser._id);
                foundhospital.save();
                return res.render("admin/registered");
            });
        }
        else {
            res.render("hospitalManager/invalidinfo");
        }
    });
});


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/HCS/home");
}

module.exports = router;