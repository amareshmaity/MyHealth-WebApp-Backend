const express = require("express");                                 // import express
const router = express.Router();                                    // router

// Define routing for home page rendering
router.get("/", async (req, res) => {
    
    if(!req.user) return res.render("home");                        // if no user inside session cookies
    
    // if user is a doctor or patient
    if(req.user.signup_as === 'doctor') return res.status(200).redirect("/doctor/dashboard");
    if(req.user.signup_as === 'patient') return res.status(200).redirect("/patient/dashboard");

});


module.exports = router;