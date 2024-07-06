// import modules
const express = require("express");
const {handleUserSignup, handleUserLogin, getAvailableDoctors, fillAppointmentForm, showMyReports, viewMyReports} = require("../controllers/patient");
const {restrictToLoggedinUserOnly} = require("../middlewares/auth");                    // middleware to restrict dashboard

// instantiate router
const router = express.Router();

// Patient signup and login
router.get("/signup", (req, res) => res.status(200).render("Patients/patient_signup"));
router.get("/login", (req, res) => res.status(200).render("Patients/patient_login"));

// Patient's signup and login (post method)
router.post('/signup', handleUserSignup);
router.post('/login', handleUserLogin);

// Patient's dashboard
router.get("/dashboard", restrictToLoggedinUserOnly, (req, res) => res.render("Patients/patient_dashboard", {home: 'home'}));
// router.get("/dashboard", (req, res) => res.redirect("/patient/availableDoctors"));

// Get all available doctors
router.get('/availableDoctors', restrictToLoggedinUserOnly, getAvailableDoctors);

// Book doctors appoinment by filling form
router.post("/:id", fillAppointmentForm);

// show my reports
router.get("/myReports", restrictToLoggedinUserOnly, showMyReports);
router.get("/viewMyReport/:id", restrictToLoggedinUserOnly, viewMyReports);

module.exports = router;