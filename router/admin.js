var express     = require("express");
var passport    = require("passport");
var router      = express.Router({ mergeParams: true });
var Hospital    = require("../models/hospital");



//
///Routes for admin only
//

//
//Register a new hospital routes
//
router.get("/", isLoggedIn, function (req, res) {
    res.render("admin/registerhospital", { currentUser: req.user });
});

router.post("/", isLoggedIn, function (req, res) {
    Hospital.create({
        name: req.body.name,
        city: req.body.city,
        contact: req.body.contact,
        email: req.body.email,
        address: req.body.address,
        medicine: req.body.medicine,
        cardiology: req.body.cardiology,
        optics: req.body.optics
    }, function () {

        res.render("admin/registered");
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/HCS/home");
}
module.exports = router;