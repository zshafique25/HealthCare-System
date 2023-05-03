var express = require("express"),
    router = express.Router({ mergeParams: true }),
    Medicalrecord = require("../models/medicalrecord"),
    Hospital = require("../models/hospital");

//
//Landing routes
//
router.get("/", function(req, res) {
    req.logout();
    res.redirect("/HCS");
});

router.get("/HCS", function(req, res) {
    res.render("common/index");
});


//
//Account Homepage route
//Analyzing the medical records
//
router.get("/HCS/home", isLoggedIn, function(req, res) {
    Medicalrecord.find({}, function(err, records) {
        var arr = ["Fever", "Flu", "Typhoid", "Cold", "Cough", "Sore Throat", "Diabetes"];
        var countarr = [];
        arr.forEach(function(str) {
            countarr.push(count(records, str));
        });
        res.render("common/home", { arr: arr, countarr: countarr });
    });
});


//
//Account profile route
//
router.get("/HCS/:id/personalinfo", isLoggedIn, function(req, res) {
    res.render("common/personalinfo");
});

//
//Hospital routes
//search the hospitals that are registered on the website
//rendering the page with the hospitals registered
//
router.get("/HCS/:id/searchhospital", isLoggedIn, function(req, res) {
    Hospital.find({}, function(err, hospital) {
        res.render("common/searchhospital", { hospital: hospital });
    });
});

//
//Passing the selected hospital to the session
//
router.post("/HCS/:id/searchhospital", isLoggedIn, function(req, res) {
    req.session.hospital = { hospital: req.body.hospital };
    res.redirect("/HCS/:id/hospitalinfo");

});


//
//show route of the selected hospital
//
router.get("/HCS/:id/hospitalinfo", isLoggedIn, function(req, res) {
    const hospital = req.session.hospital.hospital;
    Hospital.findOne({ name: hospital }).populate("doctors").exec(function(err, foundHospital) {
        res.render("common/hospitalinfo", { hospital: foundHospital });
    });
});

function count(arr, str) {
    var occurences = 0;
    var re = new RegExp(str, 'g');
    arr.forEach(function(record) {
        occurences += (record.illness.match(re) || []).length;
    });
    return occurences;
};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/HCS");
}


module.exports = router;