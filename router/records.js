var express = require("express"),
    router = express.Router({ mergeParams: true }),
    User = require("../models/user"),
    Medicalrecord = require("../models/medicalrecord"),
    Hospital = require("../models/hospital");

//
///Routes related to Medical records only
//

//
//Renders all the medical records of the current user to the page
//
router.get("/medicalrecords", isLoggedIn, function (req, res) {
    User.findOne({ username: req.user.username }).populate("medicalrecords").exec(function (err, foundUser) {
        res.render("records/medicalrecords", { currentUser: foundUser });
    });
});

//
//Show route of the selected medical record
router.get("/medicalrecords/:recordid/moreinfo", isLoggedIn, function (req, res) {
    moreinfo(req.params.recordid, res);
});



//
//Renders all the medical records of the current user to the page
//Route only for the doctors
//
router.get("/patientrecords", isLoggedIn, function (req, res) {
    User.findOne({ username: req.user.username }).populate("patientrecords").exec(function (err, foundUser) {
        res.render("records/patientrecords", { currentUser: foundUser });

    });
});


//
//show route of the selected patient record
//
router.get("/patientrecords/:recordid/moreinfo", isLoggedIn, function (req, res) {
    moreinfo(req.params.recordid, res);
});


//
//New patient record route
//
router.get("/new", isLoggedIn, function (req, res) {
    Hospital.findOne({ name: req.user.hospital }, function (err, hospital) {
        res.render("records/newpatientrecord", { hospital: hospital });
    });
});


//
//Passing the data to the session for confirmation
//redirecting to confirmation route
//
router.post("/new", isLoggedIn, function (req, res) {
    req.session.data = {
        search: req.body.search,
        illness1: req.body.illness1,
        illness2: req.body.illness2,
        illness3: req.body.illness3,
        medicine: req.body.medicine,
        medicinedescription: req.body.medicinedescription,
        comments: req.body.comments,
        hospital: req.body.hospital,
        doctor: req.user
    };
    res.redirect(`/HCS/${req.user._id}/confirmation`)
});

//
//Rendering the data from the previous route for confirmation
//
router.get("/confirmation", isLoggedIn, function (req, res) {
    const data = req.session.data;
    res.render("records/confirmation", { data: data });
});


//
//when confirmed the data is stored in the database
//This medical record will be stored in three different locations
//One as a patient record of the doctor
//Second as the medical record of the patient
//Third as the medical record of the hospital
//
router.post("/confirmation", isLoggedIn, function (req, res) {
    const data = req.session.data;
    Medicalrecord.create({
        hospitalname: data.hospital,
        patientcnic: data.search,
        doctorcnic: data.doctor.username,
        doctorname: data.doctor.name,
        medication: data.medicine,
        medicationdescription: data.medicinedescription,
        comments: data.comments,
        illness: data.illness1 + " | " + data.illness2 + " | " + data.illness3 + " | "
    }, function (err, record) {
        req.user.patientrecords.push(record._id);
        req.user.save();
        User.findOne({ username: data.search }, function (err, foundUser) {
            record.patientname = foundUser.name;
            foundUser.medicalrecords.push(record._id);
            foundUser.save();
        });
        Hospital.findOne({ name: data.hospital }, function (err, foundHospital) {
            foundHospital.medicalrecords.push(record._id);
            foundHospital.save();
        });
    });
    res.redirect("/HCS/home");
});


//
//Search a patient route
//only for doctors
//
router.get("/search", isLoggedIn, function (req, res) {
    res.render("records/searchpatient");

});

//
//passing the requested patient cnic to the session
//
router.post("/search", isLoggedIn, function (req, res) {
    req.session.search = { search: req.body.search };
    res.redirect(`/HCS/${req.user._id}/searchresult`);
});

//
//rendering the info of the patient
//
router.get("/searchresult", isLoggedIn, function (req, res) {
    const search = req.session.search.search;
    User.findOne({ username: search }).populate("medicalrecords").exec(function (err, foundUser) {
        res.render("records/searchresult", { searchedUser: foundUser });
    });
});


//
//show route of the selected medical record of the patient
//
router.get("/searchresult/:recordid/moreinfo", isLoggedIn, function (req, res) {
    moreinfo(req.params.recordid, res);
});


function moreinfo(id, res) {
    Medicalrecord.findById(id).exec(function (err, foundRecord) {
        res.render("records/moreinfo", { record: foundRecord });
    });
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/HCS/home");
}


module.exports = router;