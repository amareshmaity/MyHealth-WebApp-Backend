
// import modules
const express = require("express");
const {handleUserSignup, handleUserLogin, doctorDashboard, createDoctorService, getDoctorService, handleMyPatients,  generateReportView, createReport, showPatientReports, showPatientIndividualReport, uploadDoctorImage, handleMyServices} = require("../controllers/doctor");
const {restrictToLoggedinUserOnly} = require("../middlewares/auth"); // middleware to restrict dashboard
const { render } = require("ejs");

// instantiate router
const router = express.Router();

// Doctor signup and login 
router.get("/login", (req, res) => res.status(200).render("Doctors/doctor_login"));
router.get("/signup", (req, res) => res.status(200).render("Doctors/doctor_signup"));


// Doctor signup and login (post method)
router.post('/signup', handleUserSignup);
router.post('/login', handleUserLogin);


// Doctor dashboard
router.get("/dashboard", restrictToLoggedinUserOnly,  doctorDashboard);
// router.get("/dashboard", (req, res) => res.render("Doctors/doctor_dashboard"));


// Doctor's service (service views and creation)
router.route('/service')
.get(restrictToLoggedinUserOnly, getDoctorService)
// .get(getDoctorService)
.post(createDoctorService);


// Upload Image view
router.route("/uploadImage")
.get(restrictToLoggedinUserOnly, (req, res) => res.status(200).render("Doctors/doctor_dashboard", {view:"Upload View"}))
.post(uploadDoctorImage);


// handle doctor's appoinment view
router.get("/appointment/:id", (req, res) => res.render("Patients/patient_dashboard", {
    id : req.params.id,     // appointed service id
    msg: "success",
}));


// Get myPatients
router.get("/myPatients", restrictToLoggedinUserOnly, handleMyPatients);

// handle generate report view
router.route("/generateReport/:id")
.get(restrictToLoggedinUserOnly, generateReportView)
.post(createReport);


// Get my services reports
router.get("/myServices", restrictToLoggedinUserOnly, handleMyServices);

// show reports
router.get("/showReports", restrictToLoggedinUserOnly, showPatientReports);
router.get("/showPatientIndividualReport/:id", restrictToLoggedinUserOnly, showPatientIndividualReport);


module.exports = router;