// import modules
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");

// import custom modules
const { connectToMongoDB } = require("./connect");

// import custom middlewares
const {checkAuth} = require("./middlewares/auth");

// import routes
const staticRoute = require("./routes/staticRouter");
const doctorRoute = require("./routes/doctor");
const patientRoute = require("./routes/patient");

// express app
const app = express();
const PORT = 8000;

// connect to database
connectToMongoDB("mongodb://127.0.0.1:27017/MyHealth")
.then(() => console.log("MongoDB connected..."))
.catch(err=>{
    console.log("MongoDB connection error: ", err.message);
});


// To tell express that we use EJS template engine (for SSR)
app.set("view engine", "ejs");                      // Set EJS template engine
app.set("views", path.resolve("./views"));          // tell express where is your views (.ejs files)

// add middlewares
app.use(express.json());                            // add middleware - to parse url (json data)
app.use(express.urlencoded({ extended: false }));   // middleware to handle form data
app.use(cookieParser());                            // middleware to extract(parse) data from cookie
app.use(express.static(path.join(__dirname, 'public')));

// http request for routes
app.use("/", checkAuth, staticRoute);
app.use("/doctor", checkAuth, doctorRoute); 
app.use("/patient", checkAuth, patientRoute); 

// Route to handle sign out and delete cookies
app.get('/signout', (req, res) => {
    res.clearCookie('uid'); // Delete specific cookie
    res.clearCookie('sessionId'); // Delete specific cookie
    // You can clear other cookies here
    res.redirect('/'); // Redirect to login page
});


// listen : start the server
app.listen(PORT, () => console.log("Server started at port ", PORT));
