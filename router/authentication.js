var express = require("express"),
    User = require("../models/user"),
    Hospital = require("../models/hospital.js"),
    passport = require("passport"),
    router = express.Router({ mergeParams: true });

//
///Authentication Routes
//

//
//Sign up route
//
router.get("/HCS/register", function (req, res) {
    Hospital.find({}, function (err, hospitals) {

        res.render("authentication/register", { hospitals: hospitals })

    });
});

//
//Creates a new user
//Saves the password in hashed form to the database
//
router.post("/HCS/register", function (req, res) {
    var dateOfBirth = req.body.month + "-" + req.body.date + "-" + req.body.year,
        specialization = req.body.specialization,
        hospital = req.body.hospital;
    if (req.body.accounttype !== "doctor" && req.body.accounttype !== "hospitalManager") {
        specialization = null;
        hospital = null;
    };
    if (req.body.accounttype === "hospitalManager") {
        specialization = null;
    }
    User.register(new User(
        {
            username: req.body.username,
            mobileNumber: req.body.mobileNumber,
            name: req.body.name,
            email: req.body.email,
            bloodGroup: req.body.bloodGroup,
            dateOfBirth: dateOfBirth,
            gender: req.body.gender,
            accounttype: req.body.accounttype,
            specialization: specialization,
            hospital: hospital
        }
    ), req.body.password, function (err, user) {
        if (err) {
            return res.redirect("/HCS/register");
        }
        else {
            if (req.body.accounttype === "doctor") {
                Hospital.findOne({ name: req.body.hospital }, function (err, foundHospital) {
                    foundHospital.doctors.push(user._id);
                    foundHospital.save();
                });
            };
            passport.authenticate("local")(req, res, function () {
                res.redirect("/HCS/home");
            });
        };
    });
});


//
//Login routes
//
router.get("/HCS/login", function (req, res) {
    res.render("authentication/login");
});

router.post("/HCS/login", passport.authenticate("local", {
    successRedirect: "/HCS/home",
    failureRedirect: "/HCS/login"

}), function (req, res) { });





module.exports = router;