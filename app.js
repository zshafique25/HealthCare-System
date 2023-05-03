const
    express = require("express"),
    mongoose = require("mongoose"),
    bodyparser = require("body-parser"),
    flash = require("connect-flash"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    expressSession = require("express-session");

var app = express();
User = require("./models/user"),
    Hospital = require("./models/hospital.js"),
    Medicalrecord = require("./models/medicalrecord.js"),
    Appointment = require("./models/appointment.js");


var indexRouter = require("./router/index"),
    recordsRouter = require("./router/records"),
    hospitalManagerRouter = require("./router/hospitalManager"),
    authenticationRouter = require("./router/authentication"),
    appointmentsRouter = require("./router/appointments");
adminRouter = require("./router/admin");



mongoose.connect("mongodb://localhost/HCS", { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('strictQuery', true);

app.use(bodyparser.urlencoded({ extended: true }));
app.use(expressSession({
    secret: "Auth",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(flash());
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});



app.use("/", indexRouter);
app.use("/HCS/:id", recordsRouter);
app.use("/HCS/:id", hospitalManagerRouter);
app.use("/", authenticationRouter);
app.use("/HCS/:id/bookappointment", appointmentsRouter);
app.use("/HCS/:id/registerhospital", adminRouter);





var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log("server is running!");
});