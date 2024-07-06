// imports
const { v4: uuidv4 } = require('uuid');

const { Patient } = require("../models/user");
const { DoctorService } = require("../models/doctor");
const { PatientDetails } = require("../models/patient");
const { ReportDetails } = require("../models/reports");
const { setUser } = require("../services/auth");

// handle signup router
async function handleUserSignup(req, res){

    try{
        const {name, email, password} = req.body;

        // Add data to patient's model
        await Patient.create({
            name,
            email,
            password,
            signup_as: 'patient',
            
        });

        return res.redirect("/patient/login");

    } catch (error) {
        res.status(400).send(error.message);
    }
}

// handle patient's login router
async function handleUserLogin(req, res){

    try {
        const {email, password} = req.body;

        // find user from database
        const patient = await Patient.findOne({email, password});
    
        // If no patient is found
        if(!patient) return res.render("Patients/patient_login", {
            error: "Invalid email or password"
        });
    
        // if patient is found make a session cookies
        const sessionId = uuidv4(); 
        setUser(sessionId, patient);    
        res.cookie("uid", sessionId);    
    
        res.redirect("/patient/dashboard");

    } catch (error) {
        res.status(400).send(error.message);
    }
}


// Handle available doctors route
async function getAvailableDoctors(req, res){
    try{
        const availableDoctors = await DoctorService.find();

        // If no doctorService is found
        if(!availableDoctors) return res.render("Patients/patient_dashboard", {
            error: "No doctors found",
        });        

        
        // If found
        res.status(200).render("Patients/patient_dashboard", {
           availableDoctors
        });
        
    } catch (error) {
        res.status(400).send(error.message);
    }
}


// handle doctor's appoinment
async function fillAppointmentForm(req, res){
    try{
        const serviceId = req.params.id;  // appointed service id 
        console.log(serviceId);

        const body = req.body; 
        console.log(body);
        // if there is missing content inside req.body
        if(!body || !body.name || !body.age || !body.healthIssue){
            return res.status(400).render('Patients/patient_dashboard',{msg: "All fields are required..."});
        }


        // Store data into patientdetails collection
        const newPatientDetails = await PatientDetails.create({
            name: body.name,
            age: body.age,
            healthIssue: body.healthIssue,
            createdBy: req.user._id,
            bookedAppointment: [
                {
                    bookedTime:Date.now(),
                    serviceId:serviceId
                }
            ],
            ReportDetails: [],
    
        });

        // fetch patient details id
        const patientDetailsId = newPatientDetails._id;
        console.log(newPatientDetails);

        // update patient data to doctor service collection
        await DoctorService.findOneAndUpdate({
            _id:serviceId
        }, { $push: {
            bookedDetails: {
                bookedTime: Date.now(),
                bookedBy: patientDetailsId,
            },
        },});
        
        // Succes status 201
        return res.status(201).render('Patients/patient_dashboard',{msg:"You have successfully appointed"});
        
    } catch (error){
        res.status(400).send(error.message);
    }
}



// show My reports
async function showMyReports(req, res){
    try {
        if(!req.user._id) return res.status(404).redirect("/patient/login");
        const patientDetailsData = await PatientDetails.find({createdBy: req.user._id});
        console.log(patientDetailsData);

        const reportPromises = patientDetailsData.map(async (doc) => {
            return await ReportDetails.find({patientDetailsId: doc._id});
            // console.log(await ReportDetails.find({cratedByServiceID: doc._id}));
        });

        // Using Promise.all to wait for all promises to resolve
        const reportDetailsData = (await Promise.all(reportPromises)).flat();  
        console.log(reportDetailsData);

        if (reportDetailsData) {
            res.render('Patients/patient_dashboard', {reportDetailsData});
        } else {
            res.status(400).send('Report DetailsData not found');
        }

    } catch (error) {
        res.status(400).send(error.message);
    }
}

// show individual reports
async function viewMyReports(req, res){
    try {
        if(!req.params.id) return res.status(404).render("Patients/patient_dashboard");
        
        const individualReport = await ReportDetails.findById(req.params.id);

        if (individualReport) {
            res.render('Patients/patient_dashboard', {individualReport});
        } else {
            res.status(400).send('Report DetailsData not found');
        }

    } catch (error) {
        res.status(400).send(error.message);
    }
}


module.exports = {
    handleUserSignup,
    handleUserLogin,
    getAvailableDoctors,
    fillAppointmentForm,
    showMyReports,
    viewMyReports
}