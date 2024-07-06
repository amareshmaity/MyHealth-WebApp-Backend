// imports
const { v4: uuidv4 } = require('uuid'); // for tracking user sessions
const fs = require('fs');
const multer = require('multer');

const { Doctor } = require("../models/user");
const { DoctorService } = require("../models/doctor");
const { PatientDetails } = require("../models/patient");
const { ReportDetails } = require("../models/reports");
const { setUser } = require("../services/auth");
const upload  = require("../services/imageupload");

// handle doctor signup router
async function handleUserSignup(req, res){

    try{
        const {name, email, password} = req.body;

        // Add data to doctor model
        await Doctor.create({
            name,
            email,
            password,
            signup_as: 'doctor',
        });

        return res.redirect("/doctor/login"); 

    } catch(error) {
        res.status(400).send(error.message);
    }   
}


// handle doctor's login router
async function handleUserLogin(req, res){

    try{
        const {email, password} = req.body;   
        const doctor = await Doctor.findOne({email, password}); // find user from database
    
        // If no doctor is found
        if(!doctor) return res.render("Doctors/doctor_login", {
            error: "Invalid email or password"
        });
    
        // if doctor is found make a session cookies
        const sessionId = uuidv4();
        setUser(sessionId, doctor);     
        res.cookie("uid", sessionId);
    
        res.redirect("/doctor/dashboard");

    } catch (error) {
        res.status(400).send(error.message);
    }  
}



// doctor dahsboard router
async function doctorDashboard(req, res){
    try {
        const doctorId = req.user._id; // Assuming you have user ID available in req.user
        const doctor = await Doctor.findById(doctorId);

        if (!doctor) {
            return res.status(400).send('User not found');
        }
        const profileImageAddress = doctor.profileImage.filename;
        res.render("Doctors/doctor_dashboard", {
            file: profileImageAddress,
            home: 'home'
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
}


/*---------- Upload Profile Image --------- */

async function uploadDoctorImage(req, res){
    upload(req, res, async (err) => {
        if (err) {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.render('Doctors/doctor_dashboard', {
                        view: 'Upload View',
                        msg: 'Error: File too large. Please upload an image less than 100KB.'
                    });
                }
            } else {
                return res.render('Doctors/doctor_dashboard', {
                    view: 'Upload View',
                    msg: err.message
                });
            }

        } else {
            if (req.file == undefined) {
                res.render('Doctors/doctor_dashboard', {
                    view: 'Upload View',
                    msg: 'Error: No File Selected!'
                });
            } else {
                try {
                    const userId = req.user._id; // Assuming you have user ID available in req.user
                    const user = await Doctor.findById(userId);

                    if (!user) {
                        return res.status(400).send('User not found');
                    }

                    user.profileImage = {
                        filename: req.file.filename,
                        contentType: req.file.mimetype,
                        imageBase64: fs.readFileSync(req.file.path).toString('base64')
                    };

                    await user.save();
                    res.render('Doctors/doctor_dashboard', {
                        view: 'Upload View',
                        msg: 'Profile Image Updated!',
                        file: `${req.file.filename}`
                    });
                } catch (error) {
                    res.status(500).send('Server Error');
                }
            }
        }
    });
};


/* ---------- Doctor Service ------------ */

// service form view
async function getDoctorService(req, res){

    // return ssr data (html)
    return res.render('Doctors/doctor_dashboard', {
        msg: "create service",
    });

}

// Create a service
async function createDoctorService(req, res){

    try{
        const body = req.body;

        // if there is missing content inside req.body
        if(!body || !body.profileName || !body.qualification || !body.specialist || !body.experience || !body.serviceCharge || !body.description){
            return res.status(400).render('Doctors/doctor_dashboard',{msg: "All fields are required..."});
        }
    
        // create object of incoming doctor service data
        const doctorServiceData = await DoctorService.create({
            profileName: body.profileName,
            qualification: body.qualification,
            specialist: body.specialist,
            experience: body.experience,
            serviceCharge: body.serviceCharge,
            description: body.description,
            createdBy: req.user._id,
            bookedDetails: [],
            ReportDetails: []
    
        });
    
        //console.log("Inserted data : ", doctorServiceData);
    
        // Succes status 201
        return res.status(201).render('Doctors/doctor_dashboard');

    } catch (error) {
        res.status(400).send(error.message);
    }
}


// handle MyServices
async function handleMyServices(req, res){
    try {
        const doctorId = req.user?._id;
        // const doctorId = "66862d869b4aa53ff079abd3";
        if(!doctorId) return res.status(404).redirect("/doctor/login");         // if no doctor cookies
        const myServices = await DoctorService.find({createdBy: doctorId});     // find services of a particular doctor       
        
        res.status(200).render('Doctors/doctor_dashboard', {
            myServices
        });

    } catch (error) {
        res.status(400).send(error.message);
    }
}


// handle mypatients
async function handleMyPatients(req, res){
    try {
        const doctorId = req.user?._id;
        // const doctorId = "66862d869b4aa53ff079abd3";
        if(!doctorId) return res.status(404).redirect("/doctor/login");         // if no doctor cookies
        const myPatients = await DoctorService.find({createdBy: doctorId});     // find services of a particular doctor       
        const patientIds = myPatients.flatMap(doc => doc.bookedDetails.map(doc => doc.bookedBy));       // Get booked patient's id from doctor service

        // Fetch patient details
        const patientPromises = patientIds.map(async (patientId) => {
            return await PatientDetails.find({_id:patientId});
        });
    
        // Using Promise.all to wait for all promises to resolve
        const patientsDetails = (await Promise.all(patientPromises)).flat();
        res.status(200).render('Doctors/doctor_dashboard', {
            patientsDetails: patientsDetails
        });

    } catch (error) {
        res.status(400).send(error.message);
    }
}


// Generate Report view
async function  generateReportView(req, res){

    try {
        if(!req.user._id) return res.status(404).redirect("/doctor/login");

        const patientDetailsReport = await PatientDetails.findById(req.params.id);
        const doctorServicesReport = await DoctorService.find({createdBy: req.user._id});
        // const doctorServicesReport = await DoctorService.find({createdBy: "66862d869b4aa53ff079abd3"});
        if (patientDetailsReport && doctorServicesReport) {
            res.render('Doctors/doctor_dashboard', { patientDetailsReport, doctorServicesReport });
        } else {
            res.status(400).send('Patientdetails not found');
        }

    } catch (error) {
        res.status(400).send(error.message);
    }
}

// Generate Report (post)
async function createReport(req, res){

    try{
        const body = req.body;
        const patientDetailsId = req.params.id;
        const serviceId = body.service;
        // const patientDetailsId = '668632c801fab71ce3cece09';

        // if there is missing content inside req.body
        if(!body || !body.name || !body.age || !body.healthIssue || !body.medicalHistory || !body.diagnosticTests || !body.followUp || !body.service){
            return res.status(400).render('Doctors/doctor_dashboard',{msg: "All fields are required..."});
        }
    
        console.log(body.service);

        // Get specialist from 
        const doctorServicebyId = await DoctorService.findById(serviceId);


        // Create report and save into reports collection
        const reportDetailsData = await ReportDetails.create({
            patientDetailsId: patientDetailsId,
            cratedByServiceID: body.service,
            name: body.name,
            age: body.age,
            category: doctorServicebyId.specialist,
            healthIssue: body.healthIssue,
            medicalHistory: body.medicalHistory,
            diagnosticTests: body.diagnosticTests,
            followUp: body.followUp,
    
        });
    
        console.log("Inserted data : ", reportDetailsData);
        
        // fetch report details id
        const reportDetailsId = reportDetailsData._id;
        console.log(reportDetailsId);

        // update report details data to doctor service collection
        await DoctorService.findOneAndUpdate({
            _id:serviceId
        }, { $push: {
            ReportDetails: reportDetailsId,
        },});


        // update report details data to patient details collection
        await PatientDetails.findOneAndUpdate({
            _id:patientDetailsId
        }, { $push: {
            ReportDetails: reportDetailsId,
        },});

       
        // Succes status 201
        return res.status(201).render('Doctors/doctor_dashboard');

    } catch (error) {
        res.status(400).send(error.message);
    }
}


// show patients reports
async function showPatientReports(req, res){
    try {
        if(!req.user._id) return res.status(404).redirect("/doctor/login");
        const doctorServicesData = await DoctorService.find({createdBy: req.user._id});
        // const doctorServicesData = await DoctorService.find({createdBy: "66862d869b4aa53ff079abd3"});
        console.log(doctorServicesData);
        const reportPromises = doctorServicesData.map(async (doc) => {
            return await ReportDetails.find({cratedByServiceID: doc._id});
            // console.log(await ReportDetails.find({cratedByServiceID: doc._id}));
        });

        // Using Promise.all to wait for all promises to resolve
        const reportDetailsData = (await Promise.all(reportPromises)).flat();  
        console.log(reportDetailsData);

        if (reportDetailsData) {
            res.render('Doctors/doctor_dashboard', {reportDetailsData});
        } else {
            res.status(400).send('Report DetailsData not found');
        }

    } catch (error) {
        res.status(400).send(error.message);
    }
}

// show individual reports
async function showPatientIndividualReport(req, res){
    try {
        if(!req.params.id) return res.status(404).render("Doctors/doctor_dashboard");
        
        const individualReport = await ReportDetails.findById(req.params.id);

        if (individualReport) {
            res.render('Doctors/doctor_dashboard', {individualReport});
        } else {
            res.status(400).send('Report DetailsData not found');
        }

    } catch (error) {
        res.status(400).send(error.message);
    }
}


// exports
module.exports = {
    handleUserSignup,
    handleUserLogin,
    doctorDashboard,
    uploadDoctorImage,
    getDoctorService,
    createDoctorService,
    handleMyServices,
    handleMyPatients,
    generateReportView,
    createReport,
    showPatientReports,
    showPatientIndividualReport,
}